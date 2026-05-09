/**
 * Legal-text prompt integration tests — Phase 2
 *
 * Verifies:
 *  - Prompt builder produces expected output for a sample schema
 *  - Response parser handles valid JSON arrays (recorded fixture — no live API)
 *  - Response parser handles JSONL (one object per line)
 *  - Response parser handles markdown-fenced JSON
 *  - Response parser returns empty array for invalid input
 *
 * These tests DO NOT make live API calls. They use recorded/expected fixtures.
 */

import type { SchemaIR } from "../compiler/schema";
import { buildLegalTextPrompt, parseLegalTextResponse } from "../verticals/legal-text/prompt";

// ─── Fixture schema ──────────────────────────────────────────────────────────

const TEST_SCHEMA: SchemaIR = {
  version: "synthtable-schema-v1",
  vertical: "legal-text",
  description: "Test legal document schema",
  tables: [
    {
      name: "contracts",
      description: "Generated contract documents",
      columns: [
        {
          name: "id",
          type: "uuid",
          nullable: false,
          constraints: {},
        },
        {
          name: "title",
          type: "string",
          nullable: false,
          constraints: { minLength: 5, maxLength: 200 },
        },
        {
          name: "body",
          type: "text",
          nullable: false,
          constraints: { minLength: 100 },
        },
        {
          name: "effective_date",
          type: "date",
          nullable: false,
          constraints: {},
        },
        {
          name: "jurisdiction",
          type: "enum",
          nullable: false,
          constraints: { values: ["US-DE", "US-CA", "US-NY"] },
        },
        {
          name: "amount",
          type: "number",
          nullable: false,
          constraints: { min: 0, max: 100000000 },
        },
        {
          name: "is_confidential",
          type: "boolean",
          nullable: false,
          constraints: {},
        },
        {
          name: "contact_email",
          type: "email",
          nullable: true,
          constraints: {},
        },
      ],
    },
  ],
  relationships: [],
  constraints: [],
  biasProfile: {},
};

// ─── Tests: Prompt builder ──────────────────────────────────────────────────

console.log("--- Prompt builder ---");
const prompt = buildLegalTextPrompt(TEST_SCHEMA, 10, 42);

// Prompt must include key schema information
if (!prompt.includes("contracts")) {
  throw new Error("Prompt should include table name 'contracts'");
}
if (!prompt.includes("legal-text")) {
  throw new Error("Prompt should mention legal-text domain");
}
if (!prompt.includes("10")) {
  throw new Error("Prompt should include target row count 10");
}
if (!prompt.includes("42")) {
  throw new Error("Prompt should include seed 42");
}

// Prompt must include column descriptions
for (const col of TEST_SCHEMA.tables[0].columns) {
  if (!prompt.includes(col.name)) {
    throw new Error(`Prompt should include column name "${col.name}"`);
  }
}

// Prompt must include constraint guidance for constrained columns
if (!prompt.includes("minLength")) {
  throw new Error("Prompt should mention minLength constraint");
}
if (!prompt.includes("US-DE")) {
  throw new Error("Prompt should mention enum values");
}

console.log(`  ✅ Prompt builder includes table name, column names, constraints, and seed`);
console.log(`     Prompt length: ${prompt.length} chars`);

// ─── Tests: Response parser (JSON array fixture) ────────────────────────────

console.log("--- Response parser: valid JSON array ---");

const validJsonArray = JSON.stringify([
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Master Services Agreement",
    body: "This Master Services Agreement (the 'Agreement') is entered into as of the Effective Date by and between Alpha Corporation, a Delaware corporation, and Beta LLC, a California limited liability company. The parties agree as follows:",
    effective_date: "2025-03-15",
    jurisdiction: "US-DE",
    amount: 150000,
    is_confidential: true,
    contact_email: "legal@alphacorp.example.com",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    title: "Non-Disclosure Agreement",
    body: "This Non-Disclosure Agreement (the 'NDA') is made effective as of the date of last signature below, by and between Gamma Industries and Delta Research Group. WHEREAS, the parties wish to explore a potential business relationship...",
    effective_date: "2025-04-22",
    jurisdiction: "US-CA",
    amount: 0,
    is_confidential: true,
    contact_email: null,
  },
]);

const rows = parseLegalTextResponse(validJsonArray);
if (rows.length !== 2) {
  throw new Error(`Expected 2 rows from valid JSON array, got ${rows.length}`);
}
if (rows[0].title !== "Master Services Agreement") {
  throw new Error(`Expected first row title to be "Master Services Agreement", got "${rows[0].title}"`);
}
if (rows[1].jurisdiction !== "US-CA") {
  throw new Error(`Expected second row jurisdiction to be "US-CA", got "${rows[1].jurisdiction}"`);
}
if (rows[0].amount !== 150000) {
  throw new Error(`Expected first row amount to be 150000, got ${rows[0].amount}`);
}
console.log(`  ✅ Parser handles valid JSON array: ${rows.length} rows parsed`);

// ─── Tests: Response parser (JSONL fixture) ─────────────────────────────────

console.log("--- Response parser: JSONL ---");

const validJsonl = `{"id":"c1","title":"Contract A","body":"Body text here more than one hundred characters long so it passes a minLength 100 constraint check. Additional filler text to reach the required minimum length."}
{"id":"c2","title":"Contract B","body":"Another body text that is sufficiently long to pass the minLength constraint of 100 characters. This is purely synthetic content."}`;

const jsonlRows = parseLegalTextResponse(validJsonl);
if (jsonlRows.length !== 2) {
  throw new Error(`Expected 2 rows from JSONL, got ${jsonlRows.length}`);
}
if (jsonlRows[0].id !== "c1") {
  throw new Error(`Expected first row id "c1", got "${jsonlRows[0].id}"`);
}
console.log(`  ✅ Parser handles JSONL format: ${jsonlRows.length} rows parsed`);

// ─── Tests: Response parser (markdown-fenced JSON) ──────────────────────────

console.log("--- Response parser: markdown-fenced JSON ---");

const markdownFenced = `Here is the generated data:

\`\`\`json
[
  {"id": "m1", "title": "Fenced Contract", "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."}
]
\`\`\`

Let me know if you need anything else.`;

const fencedRows = parseLegalTextResponse(markdownFenced);
if (fencedRows.length !== 1) {
  throw new Error(`Expected 1 row from markdown-fenced JSON, got ${fencedRows.length}`);
}
if (fencedRows[0].title !== "Fenced Contract") {
  throw new Error(`Expected title "Fenced Contract", got "${fencedRows[0].title}"`);
}
console.log(`  ✅ Parser extracts JSON from markdown fences`);

// ─── Tests: Response parser (empty/invalid input) ───────────────────────────

console.log("--- Response parser: invalid input ---");

const empty = parseLegalTextResponse("");
if (empty.length !== 0) {
  throw new Error(`Expected 0 rows from empty string, got ${empty.length}`);
}

const nonsense = parseLegalTextResponse("This is not JSON at all. Just some text.");
if (nonsense.length !== 0) {
  throw new Error(`Expected 0 rows from nonsense text, got ${nonsense.length}`);
}

const malformed = parseLegalTextResponse("[{invalid: true}]");
if (malformed.length !== 0) {
  throw new Error(`Expected 0 rows from malformed JSON, got ${malformed.length}`);
}

console.log(`  ✅ Parser returns empty array for empty, nonsense, and malformed input`);

// ─── Tests: Response parser (single object) ─────────────────────────────────

console.log("--- Response parser: single valid object ---");

const singleObj = `{"id": "s1", "title": "Single", "body": "Need at least one hundred characters in this body field so the adjudicator minLength check passing the check would require this much text to be present."}`;
const singleRows = parseLegalTextResponse(singleObj);
if (singleRows.length !== 1) {
  throw new Error(`Expected 1 row from single object, got ${singleRows.length}`);
}
console.log(`  ✅ Parser handles single JSON object: ${singleRows.length} row`);

console.log("\n✅ All legal-text prompt tests passed (no live API calls).");
