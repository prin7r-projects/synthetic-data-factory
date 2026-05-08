# 04 — Pain points (root-cause)

Synthetic data is a busy market. The problem isn't *that* it exists — it's
that the existing alternatives fail on three specific axes that ML teams
care about. We attack those three failures.

## P1 — Manifests are an afterthought

Most synthetic-data tools generate a dataset and call it done. The audit
trail — which model, which seed, which schema version, which constraints
passed, which rows came from human review — lives in screenshots, Slack
threads, or a vendor support ticket.

**Why this fails.** When a regulator, board, or partner asks "where did this
record come from?", an ML team needs an answer with a hash on it. They don't
have one. They lose 2–4 weeks reconstructing provenance from runtime logs.

**Our root cause.** Vendors treat the dataset as the product. *We treat the
manifest as the product*; the dataset is the byproduct.

## P2 — One-model-fits-all generators

Generic synthetic-data platforms ship a single tabular generator (typically
a GAN-family model) and a single text generator (a fine-tuned 7B-13B model).
That stack hits 60–70% on most domains and falls off a cliff in regulated
verticals (medical coding, legal contract clauses, fintech AML, robotics
sensor traces).

**Why this fails.** Domain-specific failure modes (drug-drug interactions,
jurisdictional clause variation, false-positive AML triggers, sensor
calibration drift) require domain priors the generator doesn't have. The
output is plausible but wrong in ways that only an SME catches.

**Our root cause.** Vendors over-generalize because hiring vertical
specialists doesn't scale a SaaS. *We staff vertical packs* (medical, legal,
fintech, robotics) and let the buyer pay for that specificity.

## P3 — Row-level provenance is missing

When something goes wrong with a synthetic dataset, vendors can usually tell
you "this came from this run" — but not "row 14,495 was re-rolled three
times because the sentiment constraint kept failing, and here's the proof
chain". Without per-record proofs, you can't legally drop one row, and you
can't defend your dataset against targeted attack ("we believe row 482 is
poisoned").

**Why this fails.** Without row-level proofs:
- You can't prove that PII was scrubbed from a specific record.
- You can't drop one row from training without rebuilding the whole dataset.
- You can't answer the regulator's "show me the lineage of this prediction"
  question.

**Our root cause.** Existing tools sign at dataset granularity because that's
cheap. *We sign at row granularity* (Merkle chain + ed25519) because that's
what auditors actually need.

## Head-to-head with named alternatives

| Need                              | Generic synthetic-data platform | SynthTable |
|-----------------------------------|----------------------------------|-----------|
| Schema-as-input                   | Often; many use a GUI            | Always; YAML/JSON; lints constraints |
| Reproducibility manifest          | Out-of-band; PDF report          | First-class; signed; in every dataset |
| Row-level provenance              | Rare                              | Default; Merkle + ed25519 |
| Vertical specialists              | One model for all                 | Vertical packs |
| Bias drift report                 | Optional                          | In manifest, σ vs declared profile |
| Privacy-safe clones (k-anon, etc.)| Often (a feature)                | Standard, with attestation pack |
| Crypto-paid checkout              | Rare                              | Default (NOWPayments) |
| Open-source SDK                   | Sometimes                         | Yes (MIT, in the same monorepo) |
| Per-record drop                   | Re-run dataset                    | Drop with a row proof |

## What's *not* a SynthTable problem

We are not trying to be:

- A real-time data API for production inference. (We ship batches.)
- A scraper or labeler-of-existing-data. (Customer brings the schema and
  optional samples; we synthesize.)
- A full data-platform competitor (Snowflake / Databricks). (We integrate
  with them, we do not replace them.)
- A safety/red-team product. (We can serve their datasets, but that's a
  customer use case, not our positioning.)

## Source

This document distills the Stage-4 normalized score (7.276) and Codex
rating (76/100) recorded in the parent Notion opportunity. The Codex
verdict explicitly recommends "focus on domain-specific benchmark/eval
datasets first" — which is reflected in P2 and the **Bench** pricing tier
being the cheapest entry point.
