import type { SchemaIR, TableIR } from "../../compiler/schema";

/**
 * Build a generation prompt for the legal-text vertical.
 *
 * The prompt instructs the model to emit synthetic legal documents
 * as a JSON array of objects, one per table row.
 */
export function buildLegalTextPrompt(
  schema: SchemaIR,
  targetRows: number,
  seed: number,
): string {
  const table = schema.tables[0];
  if (!table) {
    throw new Error("Legal-text vertical requires at least one table");
  }

  const columnDescriptions = table.columns
    .map((col) => {
      let desc = `- ${col.name} (${col.type})`;
      if (col.description) desc += `: ${col.description}`;
      if (col.nullable) desc += ` [nullable]`;
      if (col.constraints && Object.keys(col.constraints).length > 0) {
        desc += ` constraints: ${JSON.stringify(col.constraints)}`;
      }
      return desc;
    })
    .join("\n");

  return `You are a synthetic data generator for the legal domain.

Generate ${targetRows} realistic synthetic legal-text records for the table "${table.name}".

SCHEMA:
${columnDescriptions}

RULES:
1. Output ONLY a valid JSON array of objects. Do not include markdown fences, explanations, or commentary.
2. Each object in the array must have exactly the keys listed above.
3. Values must respect type and constraints.
4. Content must be realistic legal text (contracts, clauses, motions, briefs, etc.).
5. Do not output real PII, real case numbers, or real attorney names. Use fictional but realistic placeholders.
6. Seed hint: ${seed} (use this to diversify output if you are stateful).

OUTPUT FORMAT:
[
  { "${table.columns[0]?.name}": "...", ... },
  ...
]

Generate exactly ${targetRows} objects.`;
}

/**
 * Parse the LLM response into an array of row objects.
 *
 * Handles JSON arrays, JSONL (one object per line), and
 * extracts JSON from markdown fences if needed.
 */
export function parseLegalTextResponse(text: string): Array<Record<string, unknown>> {
  const trimmed = text.trim();

  // Try to extract JSON from markdown fences
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenceMatch ? fenceMatch[1].trim() : trimmed;

  // Try parsing as JSON array
  try {
    const parsed = JSON.parse(jsonText);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // not a valid JSON array
  }

  // Try JSONL: one JSON object per line
  const lines = jsonText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const rows: Array<Record<string, unknown>> = [];
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (typeof obj === "object" && obj !== null) {
        rows.push(obj as Record<string, unknown>);
      }
    } catch {
      // skip malformed lines
    }
  }

  return rows;
}
