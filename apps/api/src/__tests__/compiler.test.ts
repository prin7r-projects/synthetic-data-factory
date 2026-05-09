/**
 * Compiler unit tests — Phase 2
 *
 * Verifies:
 *  - Valid schema compiles to IR
 *  - Invalid regex pattern → field-level error with code "invalid_regex"
 *  - Unsafe YAML directives (!python/object, !!python) are rejected
 *  - Missing required fields produce errors
 *  - Cross-field constraint validation (table references, column references)
 */

import { compileSchema, compileSchemaOrThrow, CompileException } from "../compiler";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function assertCompileSuccess(yaml: string) {
  const result = compileSchema(yaml);
  if (!result.success) {
    const errors = result.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    throw new Error(`Expected success, got errors: ${errors}`);
  }
  return result.ir;
}

function assertCompileError(yaml: string, expectedCount = 1) {
  const result = compileSchema(yaml);
  if (result.success) {
    throw new Error("Expected compilation error, got success");
  }
  if (result.errors.length < expectedCount) {
    throw new Error(
      `Expected at least ${expectedCount} errors, got ${result.errors.length}: ${
        JSON.stringify(result.errors)
      }`,
    );
  }
  return result.errors;
}

function assertThrows422(fn: () => unknown) {
  try {
    fn();
    throw new Error("Expected CompileException (422), got no throw");
  } catch (err) {
    if (!(err instanceof CompileException)) {
      throw new Error(`Expected CompileException, got ${err}`);
    }
    if (err.statusCode !== 422) {
      throw new Error(`Expected 422, got ${err.statusCode}`);
    }
  }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

// --- Valid schema compilation ---

const VALID_LEGAL_TEXT_YAML = `
version: synthtable-schema-v1
vertical: legal-text
description: Test legal document schema
tables:
  - name: contracts
    description: Generated contract documents
    columns:
      - name: id
        type: uuid
      - name: title
        type: string
        constraints:
          minLength: 5
          maxLength: 200
      - name: body
        type: text
        constraints:
          minLength: 100
      - name: effective_date
        type: date
      - name: jurisdiction
        type: enum
        constraints:
          values:
            - "US-DE"
            - "US-CA"
            - "US-NY"
      - name: amount
        type: number
        constraints:
          min: 0
          max: 100000000
      - name: is_confidential
        type: boolean
      - name: contact_email
        type: email
`;

console.log("--- Valid schema compilation ---");
const ir = assertCompileSuccess(VALID_LEGAL_TEXT_YAML);
console.log(`  ✅ Valid schema compiles to IR: vertical=${ir.vertical}, tables=${ir.tables.length}`);
if (ir.vertical !== "legal-text") throw new Error(`Expected vertical=legal-text, got ${ir.vertical}`);
if (ir.tables.length !== 1) throw new Error(`Expected 1 table, got ${ir.tables.length}`);
if (ir.tables[0].columns.length !== 8) throw new Error(`Expected 8 columns, got ${ir.tables[0].columns.length}`);

// --- Invalid regex pattern → field-level error ---

const INVALID_REGEX_YAML = `
version: synthtable-schema-v1
vertical: legal-text
tables:
  - name: contracts
    columns:
      - name: id
        type: uuid
      - name: case_number
        type: string
        constraints:
          regex: "[invalid(("
`;

console.log("--- Invalid regex pattern → field-level error ---");
const regexErrors = assertCompileError(INVALID_REGEX_YAML, 1);
const regexErr = regexErrors.find((e) => e.code === "invalid_regex");
if (!regexErr) {
  throw new Error(`Expected invalid_regex error, got: ${JSON.stringify(regexErrors)}`);
}
console.log(`  ✅ Compiler rejects invalid regex with code=${regexErr.code}, path=${regexErr.path}, message=${regexErr.message}`);

// --- Unsafe YAML directives ---

const UNSAFE_YAML = `
version: synthtable-schema-v1
vertical: legal-text
tables:
  - name: contracts
    columns:
      - name: id
        type: uuid
!!python/object:__main__.Exploit
`;

console.log("--- Unsafe YAML directives ---");
const unsafeErrors = assertCompileError(UNSAFE_YAML, 1);
const unsafeErr = unsafeErrors.find((e) => e.code === "unsafe_directive");
if (!unsafeErr) {
  throw new Error(`Expected unsafe_directive error, got: ${JSON.stringify(unsafeErrors)}`);
}
console.log(`  ✅ Compiler rejects !!python directives with code=${unsafeErr.code}`);

// Also test the throw-variant
assertThrows422(() => compileSchemaOrThrow(UNSAFE_YAML));
console.log("  ✅ compileSchemaOrThrow throws CompileException with status 422");

// --- Missing required fields ---

const MISSING_VERTICAL_YAML = `
version: synthtable-schema-v1
tables:
  - name: contracts
    columns:
      - name: id
        type: uuid
`;

console.log("--- Missing required fields ---");
const missingErrors = assertCompileError(MISSING_VERTICAL_YAML, 1);
if (!missingErrors.some((e) => e.path === "vertical")) {
  throw new Error(`Expected error on "vertical" path, got: ${JSON.stringify(missingErrors)}`);
}
console.log(`  ✅ Compiler rejects schema missing "vertical" field`);

// --- Invalid table reference in relationship ---

const BAD_RELATIONSHIP_YAML = `
version: synthtable-schema-v1
vertical: legal-text
tables:
  - name: contracts
    columns:
      - name: id
        type: uuid
relationships:
  - from: contracts
    fromColumn: id
    to: nonexistent_table
    toColumn: id
    type: one-to-many
`;

console.log("--- Cross-field validation: invalid table reference ---");
const relErrors = assertCompileError(BAD_RELATIONSHIP_YAML, 1);
const relErr = relErrors.find((e) => e.code === "invalid_reference");
if (!relErr) {
  throw new Error(`Expected invalid_reference error, got: ${JSON.stringify(relErrors)}`);
}
console.log(`  ✅ Compiler rejects reference to nonexistent table: ${relErr.path}`);

// --- Valid schema with constraints passes cross-field validation ---

const VALID_WITH_CONSTRAINTS = `
version: synthtable-schema-v1
vertical: legal-text
tables:
  - name: contracts
    columns:
      - name: id
        type: uuid
      - name: reference_number
        type: string
        constraints:
          regex: "^[A-Z]{2}-[0-9]{4,8}$"
constraints:
  - type: unique
    columns:
      - reference_number
    message: Reference number must be unique
`;

console.log("--- Valid schema with regex and global constraints ---");
const ir2 = assertCompileSuccess(VALID_WITH_CONSTRAINTS);
console.log(`  ✅ Schema with valid regex and unique constraint compiles cleanly`);
if (ir2.constraints.length !== 1) throw new Error(`Expected 1 global constraint, got ${ir2.constraints.length}`);

// --- Empty tables list ---

const EMPTY_TABLES_YAML = `
version: synthtable-schema-v1
vertical: legal-text
tables: []
`;

console.log("--- Empty tables list ---");
const emptyErrors = assertCompileError(EMPTY_TABLES_YAML, 1);
console.log(`  ✅ Compiler rejects empty tables list: ${emptyErrors[0].path}`);

console.log("\n✅ All compiler tests passed.");
