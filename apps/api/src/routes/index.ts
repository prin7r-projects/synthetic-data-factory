import { Hono } from "hono";
import health from "./health";
import forge from "./forge";

/**
 * Root API router. Mounts all sub-routers under versioned paths.
 *
 *   /api/v1/health  → health routes
 *   /api/v1/forge   → forge routes
 */
const routes = new Hono();

routes.route("/health", health);
routes.route("/forge", forge);

export default routes;
