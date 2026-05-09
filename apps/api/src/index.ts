import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { loadEnv } from "./config";
import { closeDb } from "./db";
import { closeNats } from "./nats";
import routes from "./routes";

// ─── Bootstrap ───────────────────────────────────────────────────────────────

const config = loadEnv();
console.log(`🚀 SynthTable API v0.1.0 starting in ${config.NODE_ENV} mode`);

// ─── App ─────────────────────────────────────────────────────────────────────

const app = new Hono();

// Global middleware
app.use("*", cors());
if (config.NODE_ENV === "development") {
  app.use("*", logger());
}

// API routes mounted under /api/v1
app.route("/api/v1", routes);

// Root redirect to health
app.get("/", (c) => c.redirect("/api/v1/health"));

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: "Not found",
      path: c.req.path,
      method: c.req.method,
    },
    404,
  );
});

// Global error handler
app.onError((err, c) => {
  console.error("❌ Unhandled error:", err);
  return c.json(
    {
      error: "Internal server error",
      detail: config.NODE_ENV === "development" ? err.message : undefined,
    },
    500,
  );
});

// ─── Serve ───────────────────────────────────────────────────────────────────

const server = Bun.serve({
  port: config.PORT,
  hostname: config.HOST,
  fetch: app.fetch,
});

console.log(`🟢 SynthTable API listening on http://${config.HOST}:${config.PORT}`);
console.log(`   Health: http://localhost:${config.PORT}/api/v1/health`);
console.log(`   Ready:  http://localhost:${config.PORT}/api/v1/health/ready`);
console.log(`   Forge:  http://localhost:${config.PORT}/api/v1/forge/runs`);

// ─── Graceful shutdown ───────────────────────────────────────────────────────

const shutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  await closeNats();
  await closeDb();
  server.stop();
  console.log("👋 Bye.");
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
