import { z } from "zod";

/**
 * Environment configuration for the SynthTable API.
 *
 * All config values read from environment variables with defaults
 * suitable for local development. Secrets are required at runtime.
 */
const envSchema = z.object({
  // Server
  PORT: z.coerce.number().int().positive().default(3001),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Postgres
  DATABASE_URL: z
    .string()
    .url()
    .default("postgres://synthtable:synthtable@localhost:5432/synthtable"),

  // NATS
  NATS_URL: z.string().default("nats://localhost:4222"),
  NATS_USER: z.string().optional(),
  NATS_PASS: z.string().optional(),

  // LLM providers (empty string = not set)
  ANTHROPIC_API_KEY: z.preprocess((v) => (v === "" ? undefined : v), z.string().min(1).optional()),
  GLM_API_KEY: z.preprocess((v) => (v === "" ? undefined : v), z.string().min(1).optional()),
  GLM_BASE_URL: z.string().url().optional().default("https://open.bigmodel.cn/api/paas/v4"),

  // Forge
  FORGE_CONCURRENCY: z.coerce.number().int().positive().default(4),
  FORGE_TIMEOUT_MS: z.coerce.number().int().positive().default(600_000),
  FORGE_BATCH_SIZE: z.coerce.number().int().positive().default(10),

  // Generator model preference
  GENERATOR_MODEL: z.string().default("claude-sonnet-4-20250514"),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

/** Parse and cache environment config. Call once at startup. */
export function loadEnv(): Env {
  if (_env) return _env;
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment configuration:");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  _env = result.data;
  return _env;
}

/** Access parsed env (must call loadEnv first, or it will lazy-load). */
export function env(): Env {
  return loadEnv();
}
