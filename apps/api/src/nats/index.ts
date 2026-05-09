import {
  connect,
  type NatsConnection,
  type Subscription,
  StringCodec,
} from "nats";
import { env } from "../config";

let _nc: NatsConnection | null = null;
const sc = StringCodec();

/** Subjects used by SynthTable services. */
export const Subjects = {
  /** Emitted when a new forge run is requested. */
  FORGE_RUN_REQUESTED: "synthtable.forge.run.requested",
  /** Emitted when a forge run completes (payload: runId). */
  FORGE_RUN_COMPLETED: "synthtable.forge.run.completed",
  /** Emitted when a forge run fails (payload: { runId, error }). */
  FORGE_RUN_FAILED: "synthtable.forge.run.failed",
  /** Heartbeat from the forge worker. */
  FORGE_WORKER_HEARTBEAT: "synthtable.forge.worker.heartbeat",
  /** Run progress updates (payload: ForgeProgress). */
  RUN_PROGRESS: "synthtable.runs.progress",
} as const;

/** Get or create the NATS connection. */
export async function getNats(): Promise<NatsConnection> {
  if (_nc) return _nc;

  const config = env();
  const servers = config.NATS_URL.split(",");

  const connectOpts: Record<string, unknown> = { servers };
  if (config.NATS_USER && config.NATS_PASS) {
    connectOpts.user = config.NATS_USER;
    connectOpts.pass = config.NATS_PASS;
  }

  console.log(`✉️  Connecting to NATS at ${config.NATS_URL}`);
  _nc = await connect(connectOpts);

  // Handle disconnect gracefully
  (async () => {
    for await (const status of _nc!.status()) {
      if (status.type === "disconnect") {
        console.warn("⚠️  NATS disconnected");
      } else if (status.type === "reconnect") {
        console.log("✉️  NATS reconnected");
      }
    }
  })().catch(() => {});

  console.log("✉️  NATS connected");
  return _nc;
}

/** Close the NATS connection cleanly. */
export async function closeNats(): Promise<void> {
  if (_nc) {
    await _nc.drain();
    _nc = null;
    console.log("✉️  NATS connection closed");
  }
}

/** Publish a JSON payload to a subject. */
export async function publishJson<T>(subject: string, payload: T): Promise<void> {
  const nc = await getNats();
  nc.publish(subject, sc.encode(JSON.stringify(payload)));
}

/** Subscribe to a subject with a JSON handler. */
export async function subscribeJson<T>(
  subject: string,
  handler: (payload: T, subject: string) => void | Promise<void>,
): Promise<Subscription> {
  const nc = await getNats();
  const sub = nc.subscribe(subject);

  (async () => {
    for await (const msg of sub) {
      try {
        const data = JSON.parse(sc.decode(msg.data)) as T;
        await handler(data, msg.subject);
      } catch (err) {
        console.error(`❌ Error handling NATS message on "${subject}":`, err);
      }
    }
  })().catch((err) => {
    console.error(`❌ NATS subscription loop crashed for "${subject}":`, err);
  });

  return sub;
}
