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

    // Input declarations
    schemaSpec: jsonb("schema_spec").notNull(), // { tables: [...], constraints: {...}, relationships: [...] }
    biasProfile: jsonb("bias_profile").default({}), // { distributions: {...}, edgeCaseDensity: number }
    volume: integer("volume").notNull().default(1_000), // target row count

    // Output artifacts
    artifactS3Path: varchar("artifact_s3_path", { length: 1024 }),
    manifestHash: varchar("manifest_hash", { length: 128 }),
    manifest: jsonb("manifest"), // full reproducibility manifest

    // Stats
    rowCount: integer("row_count"),
    constraintPassed: integer("constraint_passed"),
    constraintFailed: integer("constraint_failed"),
    elapsedMs: integer("elapsed_ms"),

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
