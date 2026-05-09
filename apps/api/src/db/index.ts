import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../config";
import * as schema from "./schema";

let _sql: postgres.Sql | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** Lazy-init the Postgres connection pool. */
export function getDb() {
  if (_db) return _db;

  const config = env();
  console.log(`🐘 Connecting to Postgres at ${config.DATABASE_URL}`);

  _sql = postgres(config.DATABASE_URL, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
    // Log queries in development
    ...(config.NODE_ENV === "development" && {
      debug: (query) => console.debug("  SQL:", query),
    }),
  });

  _db = drizzle(_sql, { schema });
  return _db;
}

/** Close the Postgres connection pool cleanly. */
export async function closeDb(): Promise<void> {
  if (_sql) {
    await _sql.end();
    _sql = null;
    _db = null;
    console.log("🐘 Postgres connection closed");
  }
}

/** Re-export schema for convenience. */
export { schema };
