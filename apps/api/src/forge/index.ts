import { z } from "zod";
import { getDb, schema } from "../db";
import { publishJson, Subjects } from "../nats";
import { eq } from "drizzle-orm";
import { compileSchema, CompileException } from "../compiler";
import { schemaIRSchema } from "../compiler/schema";
import { executeForgeRun } from "./worker";
import type { SchemaIR } from "../compiler/schema";

// ─── Zod schemas for the forge API ──────────────────────────────────────────

export const forgeRequestSchema = z.object({
  schemaSpec: z.record(z.unknown()).optional(),
  schemaYaml: z.string().optional(),
  biasProfile: z.record(z.unknown()).optional().default({}),
  volume: z.number().int().positive().default(1_000),
  seed: z.number().int().optional(),
});

export type ForgeRequest = z.infer<typeof forgeRequestSchema>;

export interface ForgeResponse {
  runId: string;
  status: string;
  submittedAt: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function resolveSchemaIR(input: ForgeRequest): SchemaIR {
  if (input.schemaYaml) {
    const result = compileSchema(input.schemaYaml);
    if (!result.success) {
      throw new CompileException(result.errors, 422);
    }
    return result.ir;
  }

  if (input.schemaSpec) {
    const withDefaults =
      typeof input.schemaSpec === "object" &&
      input.schemaSpec !== null &&
      !("version" in input.schemaSpec)
        ? { version: "synthtable-schema-v1", ...input.schemaSpec }
        : input.schemaSpec;

    const parsed = schemaIRSchema.safeParse(withDefaults);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));
      throw new CompileException(errors, 422);
    }
    return parsed.data;
  }

  throw new CompileException(
    [
      {
        path: "schema",
        message: "Either schemaYaml or schemaSpec is required",
        code: "required",
      },
    ],
    422,
  );
}

// ─── Forge service ──────────────────────────────────────────────────────────

/**
 * Submit a new forge run. Creates a run record, publishes a NATS event,
 * and dispatches to the forge worker for real generation.
 */
export async function submitForgeRun(
  userId: string,
  input: ForgeRequest,
): Promise<ForgeResponse> {
  const db = getDb();

  // Resolve/compile schema IR
  const ir = await resolveSchemaIR(input);

  // Create the run record
  const [run] = await db
    .insert(schema.runs)
    .values({
      userId,
      status: "pending",
      vertical: ir.vertical,
      schemaSpec: input.schemaSpec ?? {},
      schemaYaml: input.schemaYaml ?? null,
      ir,
      biasProfile: input.biasProfile,
      volume: input.volume,
      targetRows: input.volume,
      seed: input.seed ?? Math.floor(Math.random() * 1_000_000),
    })
    .returning({ id: schema.runs.id, status: schema.runs.status });

  // Log the audit event
  await db.insert(schema.auditLog).values({
    runId: run.id,
    event: "run.created",
    payload: {
      volume: input.volume,
      vertical: ir.vertical,
      schemaKeys: Object.keys(ir.tables[0] ?? {}),
    },
  });

  // Publish NATS event for forge workers
  await publishJson(Subjects.FORGE_RUN_REQUESTED, {
    runId: run.id,
    userId,
    schemaIR: ir,
    biasProfile: input.biasProfile,
    targetRows: input.volume,
    seed: input.seed ?? Math.floor(Math.random() * 1_000_000),
  });

  // Phase 2: dispatch directly in-process (extract to worker process in Phase 3+)
  executeForgeRun({
    runId: run.id,
    userId,
    schemaIR: ir,
    biasProfile: input.biasProfile,
    targetRows: input.volume,
    seed: input.seed ?? Math.floor(Math.random() * 1_000_000),
  }).catch((err) => {
    console.error(`❌ Forge worker failed for run ${run.id}:`, err);
    publishJson(Subjects.FORGE_RUN_FAILED, {
      runId: run.id,
      error: err instanceof Error ? err.message : "Unknown error",
    }).catch(() => {});
  });

  return {
    runId: run.id,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Get the status of a forge run.
 */
export async function getRunStatus(runId: string) {
  const db = getDb();
  const [run] = await db
    .select()
    .from(schema.runs)
    .where(eq(schema.runs.id, runId))
    .limit(1);

  return run ?? null;
}

/**
 * Get generated rows for a run.
 */
export async function getRunRows(runId: string, limit = 100, offset = 0) {
  const db = getDb();
  return db
    .select()
    .from(schema.rows)
    .where(eq(schema.rows.runId, runId))
    .orderBy(schema.rows.idx)
    .limit(limit)
    .offset(offset);
}
