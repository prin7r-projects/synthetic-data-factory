import { Hono } from "hono";

const health = new Hono();

/** GET /health — liveness check (no dependencies). */
health.get("/", (c) => {
  return c.json({
    status: "ok",
    service: "synthtable-api",
    version: "0.1.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/** GET /health/ready — readiness check (with DB + NATS). */
health.get("/ready", async (c) => {
  try {
    const { getDb } = await import("../db");
    const { getNats } = await import("../nats");

    // Verify DB
    const db = getDb();
    await db.execute("SELECT 1");

    // Verify NATS
    const nc = await getNats();
    const rtt = await nc.flush();

    return c.json({
      status: "ready",
      checks: {
        database: "ok",
        nats: "ok",
        natsRttMs: rtt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return c.json(
      {
        status: "not_ready",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      503,
    );
  }
});

export default health;
