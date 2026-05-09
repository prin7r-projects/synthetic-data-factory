# SynthTable API — apps/api

> Bun + Hono + Postgres + NATS + stub forge

## Stack

| Layer       | Technology                                          |
|-------------|-----------------------------------------------------|
| Runtime     | [Bun](https://bun.sh) 1.2+                          |
| Framework   | [Hono](https://hono.dev) 4.x                        |
| Database    | [Postgres](https://postgresql.org) + [Drizzle ORM](https://orm.drizzle.team) |
| Message bus | [NATS](https://nats.io)                             |
| Validation  | [Zod](https://zod.dev)                              |

## Structure

```
apps/api/
├── src/
│   ├── index.ts            Entry point — Hono server + graceful shutdown
│   ├── config.ts           Environment config (Zod-validated)
│   ├── db/
│   │   ├── index.ts        Postgres connection pool (postgres.js + Drizzle)
│   │   └── schema.ts       Drizzle schema — users, runs, audit_log, api_keys
│   ├── nats/
│   │   └── index.ts        NATS connection + pub/sub helpers
│   ├── forge/
│   │   └── index.ts        Stub forge — submit runs, simulate pipeline
│   └── routes/
│       ├── index.ts        Route aggregator (/api/v1/*)
│       ├── health.ts       GET /health, GET /health/ready
│       └── forge.ts        POST /forge/runs, GET /forge/runs/:id
├── drizzle.config.ts       Drizzle Kit config
├── Dockerfile.api          Multistage Bun production image
├── package.json
└── tsconfig.json
```

## Quickstart

### Prerequisites
- [Bun](https://bun.sh) ≥ 1.2
- Postgres 15+ running on `localhost:5432`
- NATS 2.x running on `localhost:4222`

### Install & run

```bash
cd apps/api
bun install
bun run dev   # → http://localhost:3001
```

### Docker

```bash
docker compose build api
docker compose up -d api
```

## Endpoints

| Method | Path                     | Description                |
|--------|--------------------------|----------------------------|
| GET    | `/api/v1/health`         | Liveness check             |
| GET    | `/api/v1/health/ready`   | Readiness (DB + NATS)      |
| POST   | `/api/v1/forge/runs`     | Submit a forge run (stub)  |
| GET    | `/api/v1/forge/runs/:id` | Get run status + manifest  |

### Submit a forge run

```bash
curl -X POST http://localhost:3001/api/v1/forge/runs \
  -H "Content-Type: application/json" \
  -d '{
    "schemaSpec": {
      "tables": [{"name": "users", "columns": [{"name": "id", "type": "uuid"}]}]
    },
    "volume": 100
  }'
```

## Database

```bash
# Push schema to dev DB (no migration files)
bun run db:push

# Generate migration files
bun run db:generate

# Apply migrations
bun run db:migrate
```

## Environment

| Variable        | Default                                            | Notes                      |
|-----------------|----------------------------------------------------|----------------------------|
| `PORT`          | `3001`                                             | Server listen port         |
| `DATABASE_URL`  | `postgres://synthtable:synthtable@localhost:5432/synthtable` | Postgres connection |
| `NATS_URL`      | `nats://localhost:4222`                            | NATS server(s)             |
| `NATS_USER`     | (none)                                             | NATS auth user             |
| `NATS_PASS`     | (none)                                             | NATS auth password         |

## Phase plan

- **Phase 1 (current):** Scaffold + stub forge. API accepts forge requests, creates DB records, returns stub manifests. No real data generation.
- **Phase 2:** Real forge workers consuming NATS events. Schema compiler → generator → adjudicator → stamper pipeline.
- **Phase 3:** Authentication, API keys, webhooks, billing integration.
- **Phase 4:** S3 artifact storage, signed manifests, row-level Merkle proofs.
