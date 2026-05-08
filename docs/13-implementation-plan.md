# 13 · Implementation plan

> **Hand-off ready.** Read `01`, `02`, `11`, `12` first. Phase 0 (landing + sandbox stub + crypto
> checkout) is COMPLETE. Phases 1–6 ship the runtime.
>
> **Repo:** https://github.com/prin7r-projects/synthetic-data-factory
> **Live:** https://synthetic-data-factory.prin7r.com (landing live; API stubbed)
> **Deploy:** storage-contabo `/opt/prin7r-deploys/synthetic-data-factory`
> **Secrets:** ANTHROPIC_API_KEY, ZAI_API_KEY (GLM), NOWPAYMENTS_API_KEY, NOWPAYMENTS_IPN_SECRET,
> POSTMARK_SERVER_TOKEN, B2_KEY_ID, B2_APP_KEY, SYNTHTABLE_KEY_PASSPHRASE, NATS_TOKEN, DATABASE_URL.
> **Tone:** "synthetic data, declared." Auditable. Industrious. Unsentimental. See `01-brand-identity.md` §Voice.

## Phase 0 — Wave 2 landing + payment surface (DONE)

- ✅ Public landing, vertical pages, pricing, NOWPayments invoice round-trip, branded 503,
  screenshots in `/docs/screenshots/`. (SynthTable rebrand landed 2026-05-08; canvas swap to
  hyperstudio dark direction is a Phase 6 polish task per `HANDOFF.md`.)

## Phase 1 — apps/api scaffold (Bun + Hono) + Postgres + NATS

- **Goal.** Stand up `apps/api` with auth, runs table, NATS, and a stub forge worker that returns
  100 random rows for the legal-text vertical.
- **Tasks.**
  1. New `apps/api` directory with Bun + Hono. Routes: `/v1/sandbox`, `/v1/runs`, `/v1/manifests`,
     `/v1/keys`, `/healthz`.
  2. Drizzle schema for the data model in `12-technical-specification.md` §2. Migration applied.
  3. NATS JetStream sidecar in compose. Topic `synthtable.runs.queued`.
  4. Stub forge worker that subscribes, generates 100 fake rows for legal-text, persists, marks
     run `status=finished`. No judge yet.
  5. `synthtable` CLI (Bun binary) with `run`, `verify`, `manifest`.
- **Deps.** Phase 0.
- **Effort.** 200 tool-uses, 10h.
- **DoD.**
  - `synthtable run examples/legal-text-100.yaml --sandbox` returns 100 rows + a stub manifest within
    60s.
  - `synthtable verify <manifest>` returns `valid: true` against the stub key.
  - `apps/api` Docker image builds reproducibly.
- **Hand-off.** Bun + Hono + Drizzle stack matches `lead-enrichment` (Triangulate); reuse patterns
  from that repo's `apps/api`.

## Phase 2 — Compiler + first real generator (legal-text)

- **Goal.** Real generation with Claude 4.7 + judge-stub. Manifest is unsigned for now.
- **Tasks.**
  1. Compiler: parse YAML → IR (Zod schema). Validate constraints; reject with field errors.
  2. Forge worker for legal-text: prompt template with `{vertical, schema, target_rows, seed}`.
     Stream Claude responses; persist rows.
  3. Stub adjudicator: regex + length checks; assigns confidence 0.7 default; marks reject if
     prompt-injection flags fire.
  4. Run progress events on `synthtable.runs.progress` topic.
- **Deps.** Phase 1.
- **Effort.** 200 tool-uses, 10h.
- **DoD.**
  - 1k-row legal-text run finishes in <15m p95.
  - All rows have `generator_model = claude-4.7` and `judge_confidence > 0`.
  - Compiler rejects schema with `regex: invalid` field-level error.

## Phase 3 — Real adjudicator + manifest signing

- **Goal.** Judge model gates row acceptance. Manifests are signed Ed25519. `synthtable verify` works
  end-to-end.
- **Tasks.**
  1. Adjudicator uses Claude 4.7 with a judge prompt. Confidence + per-criterion notes.
  2. Rejection logic: confidence < 0.6 → reject; 0.6–0.7 → flag for operator queue.
  3. Stamp service: sign manifest with Ed25519 key (`SYNTHTABLE_KEY_PASSPHRASE`). Compute Merkle root
     over compressed payload bytes.
  4. `pki.synthtable.prin7r.com/v1/keys` serves public keys (active + rotated).
- **Deps.** Phase 2.
- **Effort.** 180 tool-uses, 9h.
- **DoD.**
  - End-to-end run signs the manifest; CLI verifies; tampering with one row breaks verification.
  - Judge rejection at >5% halts the run with `paused_for_review`.
  - Public key rotation works without invalidating past manifests.

## Phase 4 — Webhook delivery + customer-facing dashboard

- **Goal.** Customers receive `run.*` events via signed webhooks; can manage api keys + see runs.
- **Tasks.**
  1. Webhook dispatcher worker: signs `x-synthtable-sig`, retries with backoff (1m, 5m, 30m, 4h, 24h).
  2. Per-customer webhook secret rotation.
  3. Customer dashboard (`apps/app` Wave 3 deferred; for Phase 4, a thin Next.js page on
     `apps/landing/dashboard` is acceptable as a stop-gap).
- **Deps.** Phase 3.
- **Effort.** 130 tool-uses, 6h.
- **DoD.**
  - Synthetic customer endpoint receives 100% of progress events within 30s p95.
  - Failed webhooks retry 5 times then mark `webhook_failed`.

## Phase 5 — Multi-vertical + tabular forge + sharding

- **Goal.** Add `medical-coding` (text) and `financial-tabular` (CSV/parquet) verticals; large runs
  shard automatically.
- **Tasks.**
  1. Per-vertical forge prompt + judge config. Vertical specialist patterns isolated in
     `lib/verticals/`.
  2. Tabular generator emits parquet via duckdb; manifest covers schema-checksum + parquet hash.
  3. Sharding: if `target_rows × est_bytes_per_row > 1GB`, compiler returns `{shards, shard_size}`
     and customer must pass `--shards N`.
  4. Top-level Merkle root over per-shard roots.
- **Deps.** Phase 3.
- **Effort.** 200 tool-uses, 10h.
- **DoD.**
  - 50k-row medical-coding run signs.
  - 100k-row financial-tabular run shards into 4× 25k, top-level manifest verifies.

## Phase 6 — Refund tooling + ops dashboard + canvas dark-direction polish

- **Goal.** Operators run refunds; ops dashboard shows queue + alerts; canvas pivots fully to
  hyperstudio dark direction (per `HANDOFF.md` D4 follow-up).
- **Tasks.**
  1. Operator refund tool: re-issues run with adjusted IR, refunds original NOWPayments invoice
     via mass-payout.
  2. Loki + Grafana dashboard. Queue depth, judge confidence histogram, webhook delivery times.
  3. Pager wired (PagerDuty or operator phone) for Sev1 alerts.
  4. Landing canvas: from current milky to hyperstudio dark `#0B0E12`. `globals.css`,
     `tailwind.config.ts`, `DESIGN.md` §4 + §5 + §15.
- **Deps.** Phases 3 + 4.
- **Effort.** 150 tool-uses, 7h.
- **DoD.**
  - Scenario E end-to-end: refund + re-issue.
  - Grafana dashboard live and watched.
  - Lighthouse pass on `/`; LCP < 2.0s p95.

## Cross-cutting concerns

- **Accessibility:** WCAG AA on landing + dashboard.
- **i18n:** EN-only Wave 2/3; ES Wave 4.
- **Mobile:** landing responsive Phase 0; dashboard mobile-usable Phase 4.
- **Telemetry:** structured logs Phase 1; metrics + alerts Phase 6.

## Risk register

| Risk | Owner | Mitigation |
|---|---|---|
| LLM costs eat margin on long runs | Ops | Tier the price by row count + judge model; cap per-run spend; fall back to GLM for high-volume verticals. |
| Manifest signing key compromise | Ops | Hardware key (YubiHSM) for production keys (Wave 4); quarterly rotation in Wave 3. |
| Schema injections in customer YAML | Eng | YAML Zod schema; reject `!python/object` and !!python directives; sandbox compiler. |
| Customer webhook endpoint flaky | Eng | Webhook retry envelope + delivery dashboard; mark `webhook_failed` and surface in run detail. |
| Vertical specialist drift over time | Curator | Quarterly per-vertical eval; update prompts + judge in versioned releases. |

## Resume instructions

1. `git clone https://github.com/prin7r-projects/synthetic-data-factory && cd synthetic-data-factory`
2. Read `01`, `02`, `11`, `12`.
3. Pick the next phase whose DoD is unmet.
