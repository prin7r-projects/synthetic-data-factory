import { eq } from "drizzle-orm";
import { getDb, schema } from "../db";
import { publishJson, Subjects } from "../nats";
import { getLlmProvider, getGeneratorModelName, type LlmMessage } from "../llm";
import { adjudicateRow } from "../adjudicator";
import type { SchemaIR } from "../compiler/schema";
import { buildLegalTextPrompt, parseLegalTextResponse } from "../verticals/legal-text/prompt";
import { env } from "../config";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ForgeWorkerInput {
  runId: string;
  userId: string;
  schemaIR: SchemaIR;
  biasProfile: Record<string, unknown>;
  targetRows: number;
  seed: number;
}

export interface ForgeProgress {
  runId: string;
  status: string;
  progress: number; // 0.0–1.0
  passedRows: number;
  rejectedRows: number;
  totalRows: number;
  currentPhase: string;
}

// ─── Progress emitter ───────────────────────────────────────────────────────

async function emitProgress(progress: ForgeProgress): Promise<void> {
  await publishJson(Subjects.RUN_PROGRESS, progress);
}

async function updateRunStatus(
  runId: string,
  status: string,
  extra?: Partial<typeof schema.runs.$inferInsert>,
): Promise<void> {
  const db = getDb();
  await db
    .update(schema.runs)
    .set({ status: status as any, ...extra })
    .where(eq(schema.runs.id, runId));

  await db.insert(schema.auditLog).values({
    runId,
    event: `run.${status}`,
    payload: { status, ...(extra ?? {}) },
  });
}

// ─── Row persistence ────────────────────────────────────────────────────────

async function persistRow(
  runId: string,
  idx: number,
  row: Record<string, unknown>,
  generatorModel: string,
  adjudication: {
    passed: boolean;
    confidence: number;
    rejectionReason?: string;
    promptInjectionDetected: boolean;
  },
): Promise<void> {
  const db = getDb();
  await db.insert(schema.rows).values({
    runId,
    idx,
    payload: row,
    generatorModel,
    judgeModel: "stub-adjudicator@0.1.0",
    judgeConfidence: Math.round(adjudication.confidence * 1000),
    passed: adjudication.passed,
    rejectionReason: adjudication.rejectionReason,
    promptInjectionDetected: adjudication.promptInjectionDetected,
  });
}

// ─── Generation ─────────────────────────────────────────────────────────────

function buildPrompt(schemaIR: SchemaIR, targetRows: number, seed: number): string {
  switch (schemaIR.vertical) {
    case "legal-text":
      return buildLegalTextPrompt(schemaIR, targetRows, seed);
    default:
      // Generic fallback for unimplemented verticals
      return buildLegalTextPrompt(schemaIR, targetRows, seed);
  }
}

async function generateRows(
  input: ForgeWorkerInput,
): Promise<Array<Record<string, unknown>>> {
  const provider = getLlmProvider();
  const prompt = buildPrompt(input.schemaIR, input.targetRows, input.seed);

  const messages: LlmMessage[] = [
    {
      role: "system",
      content:
        "You are a synthetic data generator. You output only valid JSON. Do not include explanations, markdown fences, or commentary.",
    },
    { role: "user", content: prompt },
  ];

  // For small batches we can use non-streaming; for large ones we might want streaming.
  // Phase 2: use non-streaming for reliability, stream in Phase 3+.
  const result = await provider.complete({
    messages,
    temperature: 0.8,
    maxTokens: Math.min(8192, Math.max(2048, input.targetRows * 200)),
    model: env().GENERATOR_MODEL,
  });

  const rows = parseLegalTextResponse(result.content);
  return rows;
}

// ─── Main worker entry point ────────────────────────────────────────────────

/**
 * Execute a forge run end-to-end.
 *
 * 1. Compile (already done before calling this)
 * 2. Generate rows via LLM
 * 3. Adjudicate each row
 * 4. Persist rows incrementally
 * 5. Emit progress events
 * 6. Build manifest and mark done
 */
export async function executeForgeRun(input: ForgeWorkerInput): Promise<void> {
  const db = getDb();
  const startedAt = new Date();
  const generatorModel = getGeneratorModelName();
  const { runId, targetRows } = input;

  console.log(`🔨 Forge run ${runId} starting — target ${targetRows} rows`);

  await updateRunStatus(runId, "forging", {
    startedAt,
    generatorModel,
    targetRows,
    seed: input.seed,
    vertical: input.schemaIR.vertical,
  });

  await emitProgress({
    runId,
    status: "forging",
    progress: 0,
    passedRows: 0,
    rejectedRows: 0,
    totalRows: targetRows,
    currentPhase: "generating",
  });

  let rows: Array<Record<string, unknown>>;
  try {
    rows = await generateRows(input);
  } catch (err) {
    console.error(`❌ Generation failed for run ${runId}:`, err);
    await updateRunStatus(runId, "failed", {
      elapsedMs: Date.now() - startedAt.getTime(),
    });
    await publishJson(Subjects.FORGE_RUN_FAILED, {
      runId,
      error: err instanceof Error ? err.message : "Generation failed",
    });
    return;
  }

  console.log(`📝 Run ${runId} generated ${rows.length} raw rows`);

  // ─── Adjudication & persistence ───────────────────────────────────────────

  await updateRunStatus(runId, "adjudicating");

  let passedCount = 0;
  let rejectedCount = 0;
  const table = input.schemaIR.tables[0];
  const columnSpecs =
    table?.columns.map((c) => ({
      name: c.name,
      type: c.type,
      constraints: c.constraints as Record<string, unknown>,
    })) ?? [];

  const batchSize = env().FORGE_BATCH_SIZE;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const adjudication = adjudicateRow({
      row,
      tableName: table?.name ?? "unknown",
      columnSpecs,
    });

    await persistRow(runId, i, row, generatorModel, {
      passed: adjudication.passed,
      confidence: adjudication.confidence,
      rejectionReason: adjudication.rejectionReason,
      promptInjectionDetected: adjudication.promptInjectionDetected,
    });

    if (adjudication.passed) {
      passedCount++;
    } else {
      rejectedCount++;
    }

    // Emit progress every batch
    if ((i + 1) % batchSize === 0 || i === rows.length - 1) {
      await emitProgress({
        runId,
        status: "adjudicating",
        progress: (i + 1) / Math.max(rows.length, targetRows),
        passedRows: passedCount,
        rejectedRows: rejectedCount,
        totalRows: targetRows,
        currentPhase: "adjudicating",
      });
    }
  }

  // ─── Stamping / completion ────────────────────────────────────────────────

  await updateRunStatus(runId, "stamping");

  const elapsedMs = Date.now() - startedAt.getTime();
  const manifest = {
    pipeline: "synthtable-forge@0.2.0",
    seed: input.seed,
    modelVersions: {
      generator: generatorModel,
      adjudicator: "stub-adjudicator@0.1.0",
    },
    lineageHash: `sha256:forge-${runId}-${Date.now()}`,
    constraintResults: {
      passed: passedCount,
      failed: rejectedCount,
      total: rows.length,
    },
    biasDriftSigma: 0,
    elapsedMs,
    reproducibility: "unsigned-phase-2",
  };

  await db
    .update(schema.runs)
    .set({
      status: "done",
      manifestHash: manifest.lineageHash,
      manifest,
      rowCount: rows.length,
      passedRows: passedCount,
      rejectedRows: rejectedCount,
      constraintPassed: passedCount,
      constraintFailed: rejectedCount,
      elapsedMs,
      completedAt: new Date(),
    })
    .where(eq(schema.runs.id, runId));

  await db.insert(schema.auditLog).values({
    runId,
    event: "run.completed",
    payload: {
      manifestHash: manifest.lineageHash,
      passedRows: passedCount,
      rejectedRows: rejectedCount,
    },
  });

  await publishJson(Subjects.FORGE_RUN_COMPLETED, {
    runId,
    manifestHash: manifest.lineageHash,
    elapsedMs,
    passedRows: passedCount,
    rejectedRows: rejectedCount,
  });

  console.log(
    `✅ Forge run ${runId} completed — ${passedCount} passed, ${rejectedCount} rejected in ${elapsedMs}ms`,
  );
}
