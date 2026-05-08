# 11 · User stories and scenarios

> SynthTable is a synthetic-data factory whose product is the manifest, not the rows. This doc
> documents who buys, what they generate, what proves provenance, and what we never build.

## 1. Personas summary

- **Eval lead at an AI lab (Maya).** 28–40, owns a regression dashboard. Buys SynthTable because she
  needs labeled benchmark data with a defensible audit trail. Reports to a head of research. — see
  `05-audience-profile.md` §Eval lead.
- **Compliance-minded ML engineer (Ahmed).** 30–50, fintech / health / public-sector ML team.
  Needs synthetic data because real data is regulated. Reads the manifest before the rows. — see
  `05-audience-profile.md` §Compliance ML.
- **SynthTable operator (curator).** Internal. Reviews flagged generations, signs the manifest, runs
  refund decisions when row count or quality misses the spec.

## 2. Primary user stories (12)

1. **As Maya**, I want to declare a schema (entities + fields + constraints + bias profile) in YAML,
   so that the dataset I receive is reproducible from the same declaration.
2. **As Maya**, I want every dataset to ship with a signed manifest (source model versions, prompt
   templates, judge model, sample-pass rate, generation seed, Merkle root over rows), so that I can
   defend the dataset to a regulator or eval committee.
3. **As Maya**, I want to fetch the dataset via signed S3 URL, so that I never store API keys in
   shell history.
4. **As Maya**, I want a webhook on completion (HMAC-signed), so that I can wire SynthTable into my
   internal eval pipeline without polling.
5. **As Maya**, I want vertical specialists (legal-text, medical-coding, financial-tabular, etc.)
   rather than a generic generator, so that the data is plausible to a domain expert.
6. **As Ahmed**, I want a row-level provenance trail (which model wrote each row, judge score, did
   any human reviewer touch this row), so that I can prove the synthetic dataset has no real-PII
   contamination.
7. **As Ahmed**, I want a sandbox of 100 rows for free, so that I can validate the schema before
   committing to a 100k-row run.
8. **As Ahmed**, I want a "no-go" gate: if the judge model rejects > 5% of rows, the run halts and
   I'm notified rather than silently truncated, so that the count I'm billed for is the count I get.
9. **As SynthTable operator**, I want a queue of flagged runs (judge confidence below 0.7, anomaly
   score above 0.9, regulator-flagged-domain), sorted by deadline, so that I can review before the
   manifest is signed.
10. **As SynthTable operator**, I want a refund tool that reissues a run with adjusted parameters when
    the customer reports a quality miss within 14 days, so that the refund is faster than a chargeback.
11. **As Maya**, I want the SynthTable CLI (`synthtable run schema.yaml`) to drive everything from intake
    to manifest-fetch, so that my CI can run this headless.
12. **As Ahmed**, I want signed reproducibility: someone else re-running my schema + seed should
    get a byte-identical Merkle root, so that the manifest is an honest claim.

## 3. Main scenarios (happy paths)

### Scenario A — Maya runs a 50k-row legal-text benchmark

1. **Trigger.** Quarter starts; Maya needs a fresh legal-text eval set for her LLM regression dashboard.
2. **Steps.**
   1. Writes `schema.yaml`: entity = `contract_clause`, fields = `[clause_type, jurisdiction, severity, text]`,
      bias profile = `{jurisdiction: balanced across [US, UK, EU]}`, count = 50000, vertical = `legal-text`.
   2. Runs `synthtable run schema.yaml --seed 42`. CLI hits `POST /v1/runs`, gets `run_id`.
   3. Compiler returns IR; Maya sees an estimate ($428, 3h ETA, judge model = Claude 4.7,
      generator = GLM 5.1 + Claude 4.7 ensemble).
   4. Confirms. NOWPayments invoice opens; Maya pays 428 USDC.
   5. Run begins. Maya gets a webhook ping every 10% progress.
   6. 3h later, run finishes. Webhook fires `run.finished`. Manifest URL + dataset signed-URL emailed.
   7. Maya verifies the Merkle root + signature locally with `synthtable verify`. Loads the dataset
      into her eval suite.
3. **Success criteria.** `runs.status = finished`, `runs.passed_rows = 50000`, manifest.signature
   verifies, dataset Merkle root matches manifest.
4. **Frontend.** CLI + dashboard run-detail page.
5. **Backend.** `POST /v1/runs` → compiler → JetStream queue → forge workers → judge → stamp service
   → manifest write → webhook dispatcher → S3 signed URL.

### Scenario B — Ahmed runs a 100-row sandbox before paying

1. **Trigger.** Ahmed reads `01-brand-identity.md` claim of "every dataset signed"; wants to validate.
2. **Steps.**
   1. Sandbox endpoint `POST /v1/sandbox` with the schema he intends to use; no payment required.
   2. Sandbox returns 100 rows + manifest within 5 min.
   3. Ahmed opens the manifest, verifies signature with the public key from `pki.synthtable.prin7r.com/v1/keys`.
   4. Inspects 5 rows by hand; satisfied.
   5. Signs in, runs the full 100k schema with payment.
3. **Success criteria.** Sandbox manifest signature verifies. Ahmed converts within 7 days.

### Scenario C — Operator catches a flagged run

1. **Trigger.** Pager: "Run 7f3c flagged, judge confidence p50 = 0.62."
2. **Steps.**
   1. Operator opens run detail. 7,800 of 50,000 rows below confidence 0.7.
   2. Operator inspects 20 sample-rows: judge is right; the generator is producing plausible-but-wrong
      jurisdictional facts.
   3. Operator fires "regenerate flagged subset with stricter prompt" (re-runs ~7,800 rows with
      adjusted system prompt).
   4. Re-runs converge: confidence p50 = 0.81. Operator approves.
   5. Manifest signed. Run completes.
3. **Success criteria.** Customer receives the dataset on time; manifest documents the regeneration
   step (auditable).

### Scenario D — Webhook delivery loop

1. **Trigger.** `runs.status` transitions.
2. **Steps.** Webhook dispatcher signs the body with HMAC-SHA256, POSTs to customer URL. On
   non-2xx, retry with exponential backoff (1m, 5m, 30m, 4h, 24h). After 24h, status = `webhook_failed`,
   alert.
3. **Success criteria.** 99% delivered first try; >99.9% delivered within 4h.

### Scenario E — Refund within 14 days

1. **Trigger.** Customer emails: "the dataset failed our internal eval, here are 200 example rows."
2. **Steps.** Operator opens the runs detail, examines the cited rows, confirms the miss
   (e.g., schema miss-interpreted "severity" enum), runs a re-issue with adjusted IR, refunds
   the original via NOWPayments mass-payout.
3. **Success criteria.** Refund + re-issue within 5 business days. Customer receives a new manifest.

### Scenario F — CI-driven regression eval

1. **Trigger.** Maya's CI fires nightly; calls `synthtable run --schema-from-git --seed=$NIGHTLY_SEED`.
2. **Steps.** SynthTable returns the manifest URL; CI verifies signature; loads dataset; runs eval;
   posts result to Slack.
3. **Success criteria.** Round-trip < 4h p95 for a 10k-row run.

## 4. Edge case scenarios

### Edge A — Schema is invalid

Compiler returns 422 with field-level errors (`fields[2].constraint: regex invalid`). CLI prints
errors and exits non-zero. No charge, no run.

### Edge B — Judge model degrades mid-run

Adjudicator confidence drifts below 0.6 across 10% of recent rows. Forge workers pause; operator
paged. Customer sees `runs.status = paused_for_review` with ETA reset.

### Edge C — Billing race: payment confirmed but run already started in sandbox mode

Idempotency on `(invoice_id, run_id)`. The first `payment_status=finished` flips run to
`status=running_billed`. Subsequent IPNs no-op.

### Edge D — Concurrent sandboxes from same IP

Rate limit: 5 sandboxes per IP per day. After 5, customer prompted to register (free) for 50/day.

### Edge E — Dataset would exceed 1GB

If estimated dataset size > 1GB, compiler suggests sharding. Run proceeds only with explicit
`shards: N` in the schema. Manifest covers all shards via a top-level Merkle root over per-shard
roots.

### Edge F — Domain in `regulator-flagged-domain` list

Domains like `clinical-trial-PII`, `child-eval`, `weapons` auto-route to operator queue and
require human approval before a forge worker starts.

## 5. Anti-scenarios

1. **No "real data lookalike" mode.** We do not ingest customer real data and produce a
   look-alike. We only generate from declared schemas.
2. **No silent truncation.** Runs that miss the row count due to judge rejections halt and notify;
   they do NOT silently return fewer rows.
3. **No prompt-only generators.** Every dataset goes through judge + manifest stamping. We will not
   ship a "fast unsigned" tier.
4. **No multi-tenant fine-tuning.** Customers do not bring their own model weights. We use SynthTable's
   approved generator + judge models per vertical.
5. **No PII in any dataset.** Even in legal-text or medical-coding verticals, all entity names are
   synthetic (drawn from a curated pool) and run through a de-identifier before stamping.
