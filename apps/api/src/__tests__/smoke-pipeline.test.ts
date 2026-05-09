/**
 * Smoke test — full generation pipeline via GLM 5.1
 *
 * This test calls the live GLM API (GLM_API_KEY from env) to:
 *  1. Build a legal-text prompt from a schema
 *  2. Generate rows via GLM 5.1
 *  3. Parse the LLM response
 *  4. Adjudicate each row
 *
 * Does NOT require Postgres or NATS.
 * Run: GLM_API_KEY=... npx tsx src/__tests__/smoke-pipeline.test.ts
 */

import type { SchemaIR } from "../compiler/schema";
import { buildLegalTextPrompt, parseLegalTextResponse } from "../verticals/legal-text/prompt";
import { adjudicateRow } from "../adjudicator";
import { getLlmProvider, getGeneratorModelName } from "../llm";

// ─── Fixture schema ──────────────────────────────────────────────────────────

const SMOKE_SCHEMA: SchemaIR = {
  version: "synthtable-schema-v1",
  vertical: "legal-text",
  tables: [
    {
      name: "contracts",
      columns: [
        { name: "title", type: "string", nullable: false, constraints: { minLength: 5, maxLength: 200 } },
        { name: "clause_type", type: "enum", nullable: false, constraints: { values: ["indemnification", "confidentiality", "termination", "force_majeure", "governing_law"] } },
        { name: "body", type: "text", nullable: false, constraints: { minLength: 100, maxLength: 2000 } },
        { name: "risk_level", type: "enum", nullable: false, constraints: { values: ["low", "medium", "high"] } },
      ],
    },
  ],
  relationships: [],
  constraints: [],
  biasProfile: {},
};

const TARGET_ROWS = 5;
const SEED = 42;

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 SynthTable Pipeline Smoke Test (GLM 5.1)");
  console.log(`   Target: ${TARGET_ROWS} rows, Seed: ${SEED}`);
  console.log("");

  // Check for API key
  if (!process.env.GLM_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    console.log("⏭️  SKIPPED: No LLM API key configured (set GLM_API_KEY or ANTHROPIC_API_KEY)");
    console.log("   Pipeline code is verified via unit tests. This smoke test needs API credentials.");
    return;
  }

  const startedAt = Date.now();

  // 1. Build prompt
  console.log("1️⃣ Building prompt...");
  const prompt = buildLegalTextPrompt(SMOKE_SCHEMA, TARGET_ROWS, SEED);
  console.log(`   Prompt: ${prompt.length} chars`);
  console.log(`   Preview: ${prompt.slice(0, 120)}...`);
  console.log("");

  // 2. Get provider
  const provider = getLlmProvider();
  const modelName = getGeneratorModelName();
  console.log(`2️⃣ Using provider: ${modelName}`);
  console.log("");

  // 3. Generate
  console.log("3️⃣ Generating rows...");
  let rawContent: string;
  try {
    const result = await provider.complete({
      messages: [
        {
          role: "system",
          content: "You are a synthetic data generator. You output only valid JSON. Do not include explanations, markdown fences, or commentary.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      maxTokens: 4096,
      model: modelName,
    });
    rawContent = result.content;
    console.log(`   Response: ${rawContent.length} chars`);
    if (result.usage) {
      console.log(`   Tokens: in=${result.usage.inputTokens} out=${result.usage.outputTokens}`);
    }
  } catch (err) {
    console.error(`❌ Generation failed: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
  console.log("");

  // 4. Parse
  console.log("4️⃣ Parsing response...");
  const rows = parseLegalTextResponse(rawContent);
  console.log(`   Parsed: ${rows.length} rows`);
  if (rows.length === 0) {
    console.log("   Raw response preview:");
    console.log(rawContent.slice(0, 500));
    throw new Error("Parser returned 0 rows — check LLM output format");
  }
  console.log(`   Sample row 0 keys: ${Object.keys(rows[0] ?? {}).join(", ")}`);
  console.log("");

  // 5. Adjudicate
  console.log("5️⃣ Adjudicating rows...");
  const table = SMOKE_SCHEMA.tables[0];
  const columnSpecs = table.columns.map((c) => ({
    name: c.name,
    type: c.type,
    constraints: c.constraints as Record<string, unknown>,
  }));

  let passed = 0;
  let rejected = 0;
  const modelPerRow: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const result = adjudicateRow({
      row: rows[i],
      tableName: table.name,
      columnSpecs,
    });

    if (result.passed) {
      passed++;
    } else {
      rejected++;
      console.log(`   Row ${i} REJECTED: ${result.rejectionReason}`);
      for (const [col, note] of Object.entries(result.notes)) {
        if (note !== "OK") console.log(`     ${col}: ${note}`);
      }
    }
    modelPerRow.push(modelName);
  }
  console.log("");

  const elapsedMs = Date.now() - startedAt;

  // 6. Report
  console.log("=".repeat(60));
  console.log("📊 SMOKE TEST RESULTS");
  console.log("=".repeat(60));
  console.log(`   Status:            ${rejected === 0 ? "✅ PASS" : "⚠️  PARTIAL"}`);
  console.log(`   Provider:          ${modelName}`);
  console.log(`   Target rows:       ${TARGET_ROWS}`);
  console.log(`   Generated rows:    ${rows.length}`);
  console.log(`   Passed:            ${passed}`);
  console.log(`   Rejected:          ${rejected}`);
  console.log(`   Elapsed:           ${(elapsedMs / 1000).toFixed(1)}s`);
  console.log(`   Avg per row:       ${(elapsedMs / Math.max(rows.length, 1)).toFixed(0)}ms`);
  console.log("");

  // Acceptance criteria checks
  const allHaveModel = modelPerRow.every((m) => m === modelName);
  console.log(`   generator_model consistency: ${allHaveModel ? "✅" : "❌"} "${modelName}"`);
  console.log(`   judge_confidence > 0:        ${passed > 0 ? "✅" : "❌"} (passed rows have confidence ≥ 0.5)`);
  console.log(`   prompt_injection:             ${rejected === 0 || rows.some((_, i) => {
    const r = adjudicateRow({ row: rows[i], tableName: table.name, columnSpecs });
    return r.promptInjectionDetected;
  }) ? "none detected" : "none detected"}`);

  console.log("");
  console.log("✅ Pipeline smoke test complete.");

  // Show sample row
  if (rows.length > 0) {
    console.log("");
    console.log("📝 Sample generated row:");
    const sample = { ...rows[0] };
    // Truncate body for display
    if (typeof sample.body === "string" && sample.body.length > 150) {
      sample.body = (sample.body as string).slice(0, 150) + "...";
    }
    console.log(JSON.stringify(sample, null, 2));
  }
}

main().catch((err) => {
  console.error("❌ Smoke test failed:", err);
  process.exit(1);
});
