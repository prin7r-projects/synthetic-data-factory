import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  pgEnum,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const runStatusEnum = pgEnum("run_status", [
  "pending",
  "compiling",
  "forging",
  "adjudicating",
  "stamping",
  "done",
  "failed",
  "paused_for_review",
]);

// ─── Tables ──────────────────────────────────────────────────────────────────

/** A SynthTable user / account (Phase 1 stub — will expand in Wave 3). */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** A schema generation run. */
export const runs = pgTable(
  "runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: runStatusEnum("status").notNull().default("pending"),

    // Vertical & input
    vertical: varchar("vertical", { length: 64 }),
    schemaSpec: jsonb("schema_spec").notNull(), // raw customer input (JSON or parsed YAML)
    schemaYaml: text("schema_yaml"), // original YAML if provided
    ir: jsonb("ir"), // compiled intermediate representation
    biasProfile: jsonb("bias_profile").default({}),
    volume: integer("volume").notNull().default(1_000), // target row count
    targetRows: integer("target_rows"),
    seed: integer("seed"),

    // Output artifacts
    artifactS3Path: varchar("artifact_s3_path", { length: 1024 }),
    manifestHash: varchar("manifest_hash", { length: 128 }),
    manifest: jsonb("manifest"), // full reproducibility manifest

    // Stats
    rowCount: integer("row_count"),
    passedRows: integer("passed_rows"),
    rejectedRows: integer("rejected_rows"),
    constraintPassed: integer("constraint_passed"),
    constraintFailed: integer("constraint_failed"),
    elapsedMs: integer("elapsed_ms"),

    // Model provenance
    generatorModel: varchar("generator_model", { length: 64 }),
    judgeModel: varchar("judge_model", { length: 64 }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("runs_user_id_idx").on(table.userId),
    index("runs_status_idx").on(table.status),
    index("runs_created_at_idx").on(table.createdAt),
  ],
);

/** Generated rows for a run. */
export const rows = pgTable(
  "rows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    runId: uuid("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    idx: integer("idx").notNull(),
    payload: jsonb("payload").notNull(), // the generated row object
    generatorModel: varchar("generator_model", { length: 64 }),
    judgeModel: varchar("judge_model", { length: 64 }),
    judgeConfidence: integer("judge_confidence"), // stored as integer 0-1000 (scale by 1000)
    passed: boolean("passed").notNull().default(false),
    rejectionReason: text("rejection_reason"),
    promptInjectionDetected: boolean("prompt_injection_detected").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("rows_run_id_idx").on(table.runId),
    index("rows_run_id_idx_unique").on(table.runId, table.idx),
  ],
);

/** Audit log for every state transition on a run. */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    runId: uuid("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    event: varchar("event", { length: 128 }).notNull(),
    payload: jsonb("payload").default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("audit_log_run_id_idx").on(table.runId)],
);

/** API keys for programmatic access (forward-compat). */
export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    keyHash: varchar("key_hash", { length: 128 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull().default("default"),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    isRevoked: boolean("is_revoked").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("api_keys_user_id_idx").on(table.userId)],
);
