import { z } from "zod";
import { getDb, schema } from "../db";
import { publishJson, Subjects } from "../nats";
import { eq } from "drizzle-orm";

// ─── Zod schemas for the forge API ──────────────────────────────────────────

export const forgeRequestSchema = z.object({
  schemaSpec: z.record(z.unknown()),
  biasProfile: z.record(z.unknown()).optional().default({}),
  volume: z.number().int().positive().default(1_000),
});

export type ForgeRequest = z.infer<typeof forgeRequestSchema>;

export interface ForgeResponse {
  runId: string;
  status: string;
  submittedAt: string;
}

// ─── Forge service ──────────────────────────────────────────────────────────

/**
 * Submit a new forge run. Creates a run record, publishes a NATS event,
 * and returns the run ID for polling.
 *
 * Phase 1 stub: marks the run as "done" immediately with a stub manifest.
 * Phase 2+ will dispatch to real forge workers via NATS.
 */
export async function submitForgeRun(
  userId: string,
  input: ForgeRequest,
): Promise<ForgeResponse> {
  const db = getDb();

  // Create the run record
  const [run] = await db
    .insert(schema.runs)
    .values({
      userId,
      status: "pending",
      schemaSpec: input.schemaSpec,
      biasProfile: input.biasProfile,
      volume: input.volume,
    })
    .returning({ id: schema.runs.id, status: schema.runs.status });

  // Log the audit event
  await db.insert(schema.auditLog).values({
    runId: run.id,
    event: "run.created",
    payload: {
      volume: input.volume,
      schemaKeys: Object.keys(input.schemaSpec),
    },
  });

  // Publish NATS event for forge workers (Phase 1: stub; Phase 2: real workers)
  await publishJson(Subjects.FORGE_RUN_REQUESTED, {
    runId: run.id,
    userId,
    schemaSpec: input.schemaSpec,
    biasProfile: input.biasProfile,
    volume: input.volume,
  });

  // Phase 1 stub: immediately "complete" the run with a stub manifest
  await completeRunStub(run.id);

  return {
    runId: run.id,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Phase 1 stub: simulate forging and mark the run as done.
 * In Phase 2, this logic will live in a separate forge worker process
 * that consumes NATS events.
 */
async function completeRunStub(runId: string): Promise<void> {
  const db = getDb();
  const now = new Date();
  const elapsedMs = Math.floor(Math.random() * 500) + 50; // 50–550ms stub

  // Simulate forge phases
  const phases = ["compiling", "forging", "adjudicating", "stamping"] as const;
  for (const phase of phases) {
    await db
      .update(schema.runs)
      .set({ status: phase })
      .where(eq(schema.runs.id, runId));

    await db.insert(schema.auditLog).values({
      runId,
      event: `run.${phase}`,
      payload: { phase, timestamp: new Date().toISOString() },
    });
  }

  // Mark as done with stub artifacts
  const stubManifest = {
    pipeline: "synthtable-forge@0.1.0-stub",
    seed: 42,
    modelVersions: { generator: "stub@0.1.0", adjudicator: "stub@0.1.0" },
    lineageHash: `sha256:stub-${runId}`,
    constraintResults: { passed: 0, failed: 0, total: 0 },
    biasDriftSigma: 0,
    elapsedMs,
    reproducibility: "not-verified-phase-1-stub",
  };

  await db
    .update(schema.runs)
    .set({
      status: "done",
      manifestHash: `sha256:stub-${runId}`,
      manifest: stubManifest,
      rowCount: 0,
      constraintPassed: 0,
      constraintFailed: 0,
      elapsedMs,
      completedAt: now,
    })
    .where(eq(schema.runs.id, runId));

  await db.insert(schema.auditLog).values({
    runId,
    event: "run.completed",
    payload: { manifestHash: `sha256:stub-${runId}` },
  });

  // Notify completion
  await publishJson(Subjects.FORGE_RUN_COMPLETED, {
    runId,
    manifestHash: `sha256:stub-${runId}`,
    elapsedMs,
  });
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
