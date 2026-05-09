import { z } from "zod";

// ─── Column types supported by SynthTable ───────────────────────────────────

export const columnTypeSchema = z.enum([
  "string",
  "text",
  "integer",
  "number",
  "boolean",
  "enum",
  "date",
  "uuid",
  "email",
  "url",
]);

export type ColumnType = z.infer<typeof columnTypeSchema>;

// ─── Column constraint schemas ──────────────────────────────────────────────

export const stringConstraintsSchema = z.object({
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().nonnegative().optional(),
  regex: z.string().optional(),
  format: z.enum(["email", "url", "uuid", "datetime"]).optional(),
});

export const numericConstraintsSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  precision: z.number().int().nonnegative().optional(),
  scale: z.number().int().nonnegative().optional(),
});

export const enumConstraintsSchema = z.object({
  values: z.array(z.string().min(1)).min(1),
});

export const columnConstraintsSchema = z.union([
  stringConstraintsSchema,
  numericConstraintsSchema,
  enumConstraintsSchema,
  z.object({}), // no constraints
]);

// ─── Column schema ──────────────────────────────────────────────────────────

export const columnSchema = z.object({
  name: z.string().min(1).max(128).regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
    message: "Column name must be a valid identifier",
  }),
  type: columnTypeSchema,
  nullable: z.boolean().default(false),
  constraints: columnConstraintsSchema.optional().default({}),
  description: z.string().max(1024).optional(),
});

export type ColumnIR = z.infer<typeof columnSchema>;

// ─── Table schema ───────────────────────────────────────────────────────────

export const tableSchema = z.object({
  name: z.string().min(1).max(128).regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
    message: "Table name must be a valid identifier",
  }),
  description: z.string().max(2048).optional(),
  columns: z.array(columnSchema).min(1).max(256),
});

export type TableIR = z.infer<typeof tableSchema>;

// ─── Relationship schema ────────────────────────────────────────────────────

export const relationshipSchema = z.object({
  from: z.string().min(1),
  fromColumn: z.string().min(1),
  to: z.string().min(1),
  toColumn: z.string().min(1),
  type: z.enum(["one-to-one", "one-to-many", "many-to-many"]),
});

export type RelationshipIR = z.infer<typeof relationshipSchema>;

// ─── Global constraint schema ───────────────────────────────────────────────

export const globalConstraintSchema = z.object({
  type: z.enum(["unique", "check", "not-null", "foreign-key"]),
  columns: z.array(z.string().min(1)).optional(),
  expression: z.string().optional(),
  message: z.string().max(512).optional(),
});

export type GlobalConstraintIR = z.infer<typeof globalConstraintSchema>;

// ─── Bias profile schema ────────────────────────────────────────────────────

export const biasProfileSchema = z.object({
  distributions: z.record(z.number().min(0).max(1)).optional(),
  edgeCaseDensity: z.number().min(0).max(1).optional(),
  locale: z.string().max(16).optional().default("en-US"),
  tone: z.string().max(64).optional().default("neutral"),
});

export type BiasProfileIR = z.infer<typeof biasProfileSchema>;

// ─── Full schema IR ─────────────────────────────────────────────────────────

export const schemaIRSchema = z.object({
  version: z.literal("synthtable-schema-v1"),
  vertical: z.string().min(1).max(64),
  description: z.string().max(4096).optional(),
  tables: z.array(tableSchema).min(1).max(64),
  relationships: z.array(relationshipSchema).max(256).optional().default([]),
  constraints: z.array(globalConstraintSchema).max(256).optional().default([]),
  biasProfile: biasProfileSchema.optional().default({}),
});

export type SchemaIR = z.infer<typeof schemaIRSchema>;

// ─── Validation error type ──────────────────────────────────────────────────

export interface FieldError {
  path: string;
  message: string;
  code: string;
}

export interface CompileResult {
  success: true;
  ir: SchemaIR;
}

export interface CompileError {
  success: false;
  errors: FieldError[];
}

export type CompileOutput = CompileResult | CompileError;
