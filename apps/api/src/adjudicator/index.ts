// ─── Adjudicator stub ───────────────────────────────────────────────────────
// Phase 2: regex + length checks; assigns confidence 0.7 default;
// marks reject if prompt-injection flags fire.
// Phase 3 will upgrade to a real LLM judge.

export interface AdjudicateRequest {
  /** The generated row payload. */
  row: Record<string, unknown>;
  /** The table schema IR for this row. */
  tableName: string;
  columnSpecs: Array<{
    name: string;
    type: string;
    constraints?: Record<string, unknown>;
  }>;
}

export interface AdjudicateResult {
  /** Whether the row passed adjudication. */
  passed: boolean;
  /** Confidence score 0.0–1.0. */
  confidence: number;
  /** Per-field notes. */
  notes: Record<string, string>;
  /** Rejection reason, if passed === false. */
  rejectionReason?: string;
  /** Whether prompt-injection was detected. */
  promptInjectionDetected: boolean;
}

// ─── Prompt-injection heuristics ────────────────────────────────────────────

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/gi,
  /ignore\s+above\s+instructions/gi,
  /you\s+are\s+now\s+a/gi,
  /DAN\s+mode/gi,
  /jailbreak/gi,
  /\/\/\s*system\s*:/gi,
  /<\s*\|\s*im_start\s*\|>/gi,
  /ignore\s+the\s+above/gi,
  /disregard\s+the/gi,
  /new\s+persona\s*:/gi,
];

function detectPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(text));
}

// ─── Field-level checks ─────────────────────────────────────────────────────

function checkField(
  value: unknown,
  spec: AdjudicateRequest["columnSpecs"][number],
): { ok: boolean; note: string; confidence: number } {
  const constraints = spec.constraints ?? {};

  // Null check
  if (value === null || value === undefined) {
    if (!(constraints as Record<string, unknown>).nullable) {
      return { ok: false, note: "Value is null/undefined", confidence: 0.1 };
    }
    return { ok: true, note: "Null value allowed", confidence: 0.7 };
  }

  // Type checks
  const typeofValue = typeof value;
  switch (spec.type) {
    case "string":
    case "text":
    case "enum":
    case "email":
    case "url":
      if (typeofValue !== "string") {
        return {
          ok: false,
          note: `Expected string, got ${typeofValue}`,
          confidence: 0.2,
        };
      }
      break;
    case "integer":
      if (!Number.isInteger(value)) {
        return {
          ok: false,
          note: `Expected integer, got ${typeofValue}`,
          confidence: 0.2,
        };
      }
      break;
    case "number":
      if (typeofValue !== "number") {
        return {
          ok: false,
          note: `Expected number, got ${typeofValue}`,
          confidence: 0.2,
        };
      }
      break;
    case "boolean":
      if (typeofValue !== "boolean") {
        return {
          ok: false,
          note: `Expected boolean, got ${typeofValue}`,
          confidence: 0.2,
        };
      }
      break;
    case "date":
      if (typeofValue !== "string" || isNaN(Date.parse(value as string))) {
        return {
          ok: false,
          note: `Expected valid date string`,
          confidence: 0.2,
        };
      }
      break;
    case "uuid":
      if (
        typeofValue !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          value as string,
        )
      ) {
        return {
          ok: false,
          note: `Expected valid UUID`,
          confidence: 0.2,
        };
      }
      break;
  }

  // String constraints
  if (typeof value === "string") {
    const minLen = (constraints as Record<string, unknown>).minLength;
    if (typeof minLen === "number" && value.length < minLen) {
      return {
        ok: false,
        note: `Length ${value.length} < min ${minLen}`,
        confidence: 0.3,
      };
    }

    const maxLen = (constraints as Record<string, unknown>).maxLength;
    if (typeof maxLen === "number" && value.length > maxLen) {
      return {
        ok: false,
        note: `Length ${value.length} > max ${maxLen}`,
        confidence: 0.3,
      };
    }

    const regex = (constraints as Record<string, unknown>).regex;
    if (typeof regex === "string") {
      try {
        const re = new RegExp(regex);
        if (!re.test(value)) {
          return {
            ok: false,
            note: `Value does not match regex /${regex}/`,
            confidence: 0.3,
          };
        }
      } catch {
        // Invalid regex already caught by compiler, skip here
      }
    }

    // Prompt injection check on string fields
    if (detectPromptInjection(value)) {
      return {
        ok: false,
        note: "Potential prompt-injection detected in field value",
        confidence: 0.0,
      };
    }
  }

  // Numeric constraints
  if (typeof value === "number") {
    const min = (constraints as Record<string, unknown>).min;
    if (typeof min === "number" && value < min) {
      return {
        ok: false,
        note: `Value ${value} < min ${min}`,
        confidence: 0.3,
      };
    }

    const max = (constraints as Record<string, unknown>).max;
    if (typeof max === "number" && value > max) {
      return {
        ok: false,
        note: `Value ${value} > max ${max}`,
        confidence: 0.3,
      };
    }
  }

  // Enum constraints
  if (spec.type === "enum") {
    const values = (constraints as Record<string, unknown>).values;
    if (Array.isArray(values) && !values.includes(value)) {
      return {
        ok: false,
        note: `Value "${value}" not in enum [${values.join(", ")}]`,
        confidence: 0.3,
      };
    }
  }

  return { ok: true, note: "OK", confidence: 0.7 };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Adjudicate a single generated row.
 *
 * Phase 2 stub performs:
 *   - Type validation
 *   - Constraint validation (length, regex, range, enum)
 *   - Prompt-injection heuristics
 *
 * Returns confidence 0.7 by default for passing rows.
 */
export function adjudicateRow(req: AdjudicateRequest): AdjudicateResult {
  const notes: Record<string, string> = {};
  let totalConfidence = 0;
  let promptInjectionDetected = false;

  for (const spec of req.columnSpecs) {
    const value = req.row[spec.name];
    const result = checkField(value, spec);
    notes[spec.name] = result.note;
    totalConfidence += result.confidence;

    if (result.note.includes("prompt-injection")) {
      promptInjectionDetected = true;
    }
  }

  const fieldCount = req.columnSpecs.length || 1;
  const avgConfidence = totalConfidence / fieldCount;

  // If prompt injection detected, force reject regardless of other checks
  if (promptInjectionDetected) {
    return {
      passed: false,
      confidence: 0.0,
      notes,
      rejectionReason:
        "Prompt-injection pattern detected in generated content",
      promptInjectionDetected: true,
    };
  }

  const allOk = Object.values(notes).every((n) => n === "OK");

  return {
    passed: allOk,
    confidence: allOk ? Math.max(0.5, Math.min(1.0, avgConfidence)) : avgConfidence,
    notes,
    rejectionReason: allOk ? undefined : "One or more fields failed constraint checks",
    promptInjectionDetected: false,
  };
}
