# 12 · Technical specification

> SynthTable = compiler + run queue + forge workers + adjudicator + stamp service. Wave 2 ships the
> landing + payment surface; Wave 3 ships the runtime. This doc is the implementer's contract.

## 1. Architecture overview

```mermaid
flowchart LR
  subgraph Edge[storage-contabo · Traefik]
    Tr[Traefik]
  end
  subgraph Landing[apps/landing · Next.js]
    L[Marketing + verticals + pricing]
    SAND[/api/sandbox]
    CK[/api/checkout/nowpayments]
    WH[/api/webhooks/nowpayments]
  end
  subgraph API[apps/api · Bun + Hono · Wave 3]
    R[/v1/runs]
    SR[/v1/sandbox]
    M[/v1/manifests]
    K[/v1/keys · pki]
  end
  subgraph Pipeline
    COMP[Compiler · YAML → IR]
    Q[(NATS JetStream queue)]
    FORGE[Forge workers · text/tabular]
    JUDGE[Adjudicator · LLM-of-judgement + human]
    STAMP[Stamp service · sign + Merkle]
  end
  subgraph Storage
    PG[(Postgres · runs/manifests)]
    S3[(S3-compat · datasets)]
    LEDGER[(Provenance ledger · append-only)]
  end
  subgraph Ext
    NP[NOWPayments]
    PM[Postmark]
    HOOK[Customer webhooks]
    ANTH[Anthropic Claude 4.7]
    GLM[Z.AI / GLM 5.1]
  end
  Tr --> L
  L --> CK --> NP --> WH
  L --> SAND --> SR
  R --> COMP --> Q --> FORGE --> JUDGE --> STAMP
  STAMP --> S3
  STAMP --> LEDGER
  STAMP --> HOOK
  STAMP --> M
  FORGE --> ANTH
  FORGE --> GLM
  JUDGE --> ANTH
```

**Topology.** Two Docker compose stacks on storage-contabo: `landing` and `api+pipeline`. NATS
JetStream + forge workers run as sidecars to `apps/api`. Postgres external. S3 = Backblaze B2.

## 2. Data model

```mermaid
erDiagram
  USERS ||--o{ RUNS : owns
  RUNS ||--o| MANIFESTS : has
  RUNS ||--o{ ROWS : contains
  RUNS ||--o{ EVENTS : audit
  MANIFESTS ||--|| KEYS : signed_by
  USERS {
    uuid id PK
    text email UK
    text api_key_hash
    int sandbox_credits "default 5/day"
    timestamptz created_at
  }
  RUNS {
    uuid id PK
    uuid user_id FK
    text vertical "legal-text|medical-coding|financial-tabular|..."
    jsonb schema_yaml
    jsonb ir "compiled intermediate representation"
    int target_rows
    int passed_rows
    int rejected_rows
    text status "queued|compiling|running|paused_for_review|finished|failed|webhook_failed|refunded"
    int seed
    text invoice_id "NOWPayments"
    int amount_cents
    timestamptz started_at
    timestamptz finished_at
  }
  ROWS {
    uuid id PK
    uuid run_id FK
    int idx
    bytea payload "compressed jsonl line"
    text generator_model "claude-4.7|glm-5.1|..."
    text judge_model
    float judge_confidence
    bool human_reviewed
  }
  MANIFESTS {
    uuid id PK
    uuid run_id FK UK
    text merkle_root
    text signature "Ed25519"
    uuid signing_key_id FK
    jsonb metadata "model versions, prompts, judge stats"
    timestamptz signed_at
  }
  KEYS {
    uuid id PK
    text public_key_pem
    text status "active|rotated|revoked"
    timestamptz rotated_at
  }
  EVENTS {
    uuid id PK
    uuid run_id FK
    text type "compiled|started|paused|resumed|reviewed|signed|webhook_sent|refunded"
    jsonb payload
    timestamptz at
  }
```

Indexes: `users.email` UNIQUE, `users.api_key_hash` UNIQUE, `runs.status`, `runs.invoice_id`,
`(rows.run_id, rows.idx)` UNIQUE.

## 3. API contracts

### Public

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/v1/sandbox` | Bearer api_key (free tier) | `{schema_yaml}` | `{run_id, manifest_url}` 202 |
| POST | `/v1/runs` | Bearer api_key | `{schema_yaml, target_rows, seed?}` | `{run_id, estimate_cents, invoice_url}` |
| GET | `/v1/runs/:id` | Bearer api_key | — | `{status, progress, ...}` |
| GET | `/v1/manifests/:run_id` | public | — | `{manifest, signature, public_key_id}` |
| GET | `/v1/keys` | public | — | `[{key_id, public_key_pem, status, rotated_at}]` |
| POST | `/api/webhooks/nowpayments` | HMAC-SHA512 | NOWPayments IPN | `{ok:true}` |

### Webhook (outbound to customer)

| Header | Value |
|---|---|
| `x-synthtable-sig` | `t=<unix_ms>,v1=<HMAC-SHA256(secret, t + "." + body)>` |
| Body events | `run.queued`, `run.progress`, `run.paused`, `run.finished`, `run.failed`, `run.refunded` |

## 4. Integrations

| 3rd-party | Auth | Rate | Fallback |
|---|---|---|---|
| Anthropic Claude 4.7 | API key | tier-2 RPM | GLM 5.1 |
| Z.AI / GLM 5.1 | API key | tier-2 RPM | Claude 4.7 |
| NOWPayments | x-api-key + IPN HMAC | 100 RPM | Manual invoice |
| Backblaze B2 | app key | 1000 ops/sec | None — single source |
| NATS JetStream | localhost token | — | n/a (in-cluster) |
| Postmark | server token | 10k/day | Resend on retry |

## 5. Storage

- **Postgres 16** for `users/runs/rows/manifests/keys/events`. `rows` partitioned by `run_id` for
  large runs.
- **B2** for the final dataset jsonl (sometimes parquet) under `prin7r-synthtable/datasets/<run_id>/...`.
  Lifecycle: 90-day hot, 1-year archive, then cold tier.
- **Provenance ledger** is an append-only Postgres table + a daily B2 export of the day's events.
  Hash-chained to the previous day.
- **Retention.** Runs + manifests forever (provenance is forever). Customer payloads (IR, schema)
  retained 5 years. PII never stored.

## 6. Auth

- **API key** for programmatic access. Stored as `bcrypt` hash. Rotated by user from dashboard.
- **Magic-link** for dashboard. Wasp / Open-SaaS pattern.
- Two-factor optional via TOTP (Wave 4).
- All API requests must hit HTTPS; HSTS enforced.

## 7. Security

- Secrets in `.env`; `direnv` on operator workstations.
- Rate limits: `/v1/sandbox` 5/day/user, `/v1/runs` 50/hour/user, `/v1/keys` 60/min/IP.
- Manifest-signing keys are Ed25519, generated in-process at first boot, persisted encrypted with
  a `SYNTHTABLE_KEY_PASSPHRASE` env var. Rotated quarterly; old keys retained for verification.
- IPN HMAC-SHA512 validation; inbound webhooks idempotent on `(payment_id, payment_status)`.
- Customer webhook secrets stored encrypted with libsodium per-row.
- Audit log on every manifest sign, every refund, every key rotation.

## 8. Observability

- Pino JSON logs → Loki on storage-contabo (Wave 3).
- Metrics: `synthtable.run.duration_ms`, `synthtable.judge.confidence_p50`, `synthtable.webhook.delivery_ms`,
  `synthtable.queue.depth`.
- Traces: NATS message headers carry `traceparent`.
- Alerts: queue depth > 200 for 1h; webhook delivery failures > 5/hour; judge confidence p50 < 0.65
  for 24h.

## 9. Performance budgets

| Path | p50 | p95 |
|---|---|---|
| `/v1/sandbox` (100 rows) | 60s | 120s |
| `/v1/runs` 1k rows | 6m | 15m |
| `/v1/runs` 50k rows | 90m | 4h |
| Manifest sign | 80ms | 250ms |
| Webhook delivery | 200ms | 1s |
| `/v1/keys` | 20ms | 80ms |

Throughput: 50 concurrent runs cluster-wide; 200 IPN/min; 10k webhooks/min.

## 10. Non-goals

- No customer-supplied generator weights.
- No real-data look-alike from customer-provided seed records.
- No "fast unsigned" tier — every dataset is stamped or no dataset.
- No web playground for data exploration (we ship JSONL, customer pipes into their tools).
- No subscription tier in Wave 2/3 (per-run pricing only); Wave 4 candidate.
- No on-prem (cloud-hosted only).
- No GPU dataset generation (text + tabular only). Image / audio is Wave 4 candidate.
