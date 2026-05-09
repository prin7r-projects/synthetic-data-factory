import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { submitForgeRun, getRunStatus, forgeRequestSchema } from "../forge";

const forge = new Hono();

/**
 * POST /forge/runs — Submit a new forge run.
 *
 * Body: { schemaSpec, biasProfile?, volume? }
 * Returns: { runId, status, submittedAt }
 */
forge.post("/runs", zValidator("json", forgeRequestSchema), async (c) => {
  try {
    // Phase 1: use a stub user ID (Phase 2 will extract from auth)
    const userId = "00000000-0000-0000-0000-000000000000";

    const result = await submitForgeRun(userId, c.req.valid("json"));

    return c.json(result, 201);
  } catch (error) {
    console.error("❌ Forge run submission failed:", error);
    return c.json(
      {
        error: "Forge run submission failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

/**
 * GET /forge/runs/:runId — Get the status of a forge run.
 *
 * Returns the full run record including manifest if complete.
 */
forge.get("/runs/:runId", async (c) => {
  try {
    const runId = c.req.param("runId");
    const run = await getRunStatus(runId);

    if (!run) {
      return c.json({ error: "Run not found" }, 404);
    }

    return c.json(run);
  } catch (error) {
    console.error("❌ Failed to fetch run status:", error);
    return c.json(
      {
        error: "Failed to fetch run status",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

export default forge;
