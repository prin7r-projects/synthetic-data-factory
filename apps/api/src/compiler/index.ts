import yaml from "js-yaml";
import { z } from "zod";
import {
  schemaIRSchema,
  type SchemaIR,
  type CompileOutput,
  type FieldError,
} from "./schema";

// ─── Unsafe YAML directive blocklist ────────────────────────────────────────

const UNSAFE_PATTERNS = [
  /!python\/object/gi,
  /!!python/gi,
  /!java/gi,
  /!ruby/gi,
  /!perl/gi,
  /<script/gi,
  /javascript:/gi,
];

function containsUnsafeDirectives(yamlText: string): boolean {
  return UNSAFE_PATTERNS.some((re) => re.test(yamlText));
}

// ─── YAML parsing ───────────────────────────────────────────────────────────

/**
 * Parse raw YAML text into a plain JS object.
 * Rejects unsafe directives before parsing.
 */
function parseYaml(yamlText: string): unknown {
  if (containsUnsafeDirectives(yamlText)) {
    throw new CompileException(
      [
        {
          path: "yaml",
          message:
            "Unsafe YAML directives detected. !python/object, !!python, and similar tags are forbidden.",
          code: "unsafe_directive",
        },
      ],
      422,
    );
  }

  try {
    return yaml.load(yamlText, {
      json: true, // forbid non-standard types
      schema: yaml.JSON_SCHEMA, // strict JSON-compatible schema
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid YAML";
    throw new CompileException(
      [
        {
          path: "yaml",
          message: msg,
          code: "invalid_yaml",
        },
      ],
      422,
    );
  }
}

// ─── Zod error → field errors ───────────────────────────────────────────────

function zodErrorsToFieldErrors(error: z.ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}

// ─── Compile exception ──────────────────────────────────────────────────────

export class CompileException extends Error {
  constructor(
    public readonly fieldErrors: FieldError[],
    public readonly statusCode: number = 422,
  ) {
    super(`Schema compilation failed with ${fieldErrors.length} error(s)`);
    this.name = "CompileException";
  }
}

// ─── Compiler entry point ───────────────────────────────────────────────────

/**
 * Compile a customer YAML schema into the SynthTable IR.
 *
 * Steps:
 *  1. Reject unsafe YAML directives (!python/object, !!python, etc.)
 *  2. Parse YAML → JS object
 *  3. Validate against Zod schemaIRSchema
 *  4. Return typed IR or structured field-level errors
 */
export function compileSchema(yamlText: string): CompileOutput {
  // Parse YAML, catching unsafe-directive and parse errors
  let raw: unknown;
  try {
    raw = parseYaml(yamlText);
  } catch (err) {
    if (err instanceof CompileException) {
      return {
        success: false,
        errors: err.fieldErrors,
      };
    }
    throw err;
  }

  // Inject default version if missing
  const withDefaults =
    typeof raw === "object" && raw !== null && !("version" in raw)
      ? { version: "synthtable-schema-v1", ...raw }
      : raw;

  const result = schemaIRSchema.safeParse(withDefaults);

  if (!result.success) {
    return {
      success: false,
      errors: zodErrorsToFieldErrors(result.error),
    };
  }

  // Additional cross-field validations
  const crossFieldErrors = validateCrossFieldConstraints(result.data);
  if (crossFieldErrors.length > 0) {
    return {
      success: false,
      errors: crossFieldErrors,
    };
  }

  return {
    success: true,
    ir: result.data,
  };
}

/**
 * Compile and throw on error (convenience for internal use).
 */
export function compileSchemaOrThrow(yamlText: string): SchemaIR {
  const out = compileSchema(yamlText);
  if (!out.success) {
    throw new CompileException(out.errors, 422);
  }
  return out.ir;
}

// ─── Cross-field validation ─────────────────────────────────────────────────

function validateCrossFieldConstraints(ir: SchemaIR): FieldError[] {
  const errors: FieldError[] = [];
  const tableNames = new Set(ir.tables.map((t) => t.name));

  // Validate relationship references
  for (let i = 0; i < ir.relationships.length; i++) {
    const rel = ir.relationships[i];
    if (!tableNames.has(rel.from)) {
      errors.push({
        path: `relationships.${i}.from`,
        message: `Table "${rel.from}" does not exist`,
        code: "invalid_reference",
      });
    }
    if (!tableNames.has(rel.to)) {
      errors.push({
        path: `relationships.${i}.to`,
        message: `Table "${rel.to}" does not exist`,
        code: "invalid_reference",
      });
    }
  }

  // Validate global constraint column references
  for (let i = 0; i < ir.constraints.length; i++) {
    const cons = ir.constraints[i];
    if (cons.columns) {
      for (let j = 0; j < cons.columns.length; j++) {
        const col = cons.columns[j];
        // Check that the column exists in at least one table
        const exists = ir.tables.some((t) =>
          t.columns.some((c) => c.name === col),
        );
        if (!exists) {
          errors.push({
            path: `constraints.${i}.columns.${j}`,
            message: `Column "${col}" does not exist in any table`,
            code: "invalid_reference",
          });
        }
      }
    }
  }

  // Validate regex constraints are well-formed
  for (const table of ir.tables) {
    for (const col of table.columns) {
      const regex =
        "regex" in col.constraints
          ? (col.constraints as Record<string, unknown>).regex
          : undefined;
      if (typeof regex === "string") {
        try {
          new RegExp(regex);
        } catch {
          errors.push({
            path: `tables.${table.name}.columns.${col.name}.constraints.regex`,
            message: `Invalid regex pattern: ${regex}`,
            code: "invalid_regex",
          });
        }
      }
    }
  }

  return errors;
}
