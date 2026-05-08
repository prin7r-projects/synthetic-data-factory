# 10 — Pitch deck

10-slide investor / partnership deck. The companion HTML at
`/docs/pitch-deck.html` is a single self-contained file that opens in a
browser without a build step.

---

## Slide 01 — Title

**Mintset**

Synthetic data, declared.

A precision foundry for ML and AI teams.

`synthetic-data-factory.prin7r.com`

---

## Slide 02 — The problem

ML teams need labeled data. Three things go wrong:

- Cold-start: no real data yet.
- Long-tail: real data is too smooth; edge cases hit production first.
- Privacy: legal won't let real data leave the building.

Today's synthetic-data tools generate the data — but ship the manifest as
an afterthought. **Without a manifest, the data is gossip.**

---

## Slide 03 — Our wedge

**The manifest is the product. The dataset is the byproduct.**

Every Mintset run delivers:

- Schema, seed, model versions, constraint pass/fail, bias drift in σ
- Row-level Merkle proofs (drop one row without re-running the dataset)
- ed25519 signatures (verifiable offline)
- Vertical specialists for medical, legal, fintech, robotics

Your auditor accepts it. Your CEO defends it. Your CI re-runs it.

---

## Slide 04 — Product

```
declare schema → forge → adjudicate → stamp → ship signed dataset
```

| Phase | Time |
|-------|------|
| Compile (lint constraints) | T+0 |
| Forge (generate records) | T+0 → T+34m |
| Adjudicate (LLM-of-judgement + optional human panel) | T+34m → T+38m |
| Stamp (manifest + Merkle root + signed URL) | T+38m |

REST API + Python SDK + Node SDK. Webhooks signed with HMAC.

---

## Slide 05 — Market

- **TAM (synthetic data market):** $2.5B in 2025; ~35% CAGR toward $11B by 2030.
- **SAM:** AI-mature product cos + AI labs + regulated verticals: ~$700M.
- **Initial wedge:** eval and benchmark datasets — the buyers care most about
  reproducibility, the manifest is the moat.

Buyers we sell to: Mei (eval lead, AI lab), Ravi (ML engineer, product
co.), Elena (applied scientist, regulated vertical).

---

## Slide 06 — Why now

- 2025–2026: regulator pressure on AI training-data provenance — EU AI Act,
  US executive orders on safe AI, healthcare/financial regulators demanding
  audit trails for AI predictions.
- Eval has become a board-level concern. Public benchmarks are saturated.
- Crypto rails (NOWPayments, Plisio) make global B2B billing possible
  without a 6-month KYC cycle.

---

## Slide 07 — Business model

| Tier        | Price             | Cadence              |
|-------------|-------------------|----------------------|
| **Bench**   | $480              | Single run           |
| **Production** | $2,400 setup + $1,900/mo | Monthly credit |
| **Enterprise** | $12,000+        | Quarterly            |

- Crypto-default checkout (USDT/USDC) via NOWPayments + fiat-partner card.
- Wire/EUR invoice on email request.
- Add-ons: vertical packs, private compute, dedicated foundry engineer.

Target: $250k ARR by month-12 (90 paying Bench + 30 Production + 5 Enterprise quarters).

---

## Slide 08 — Moats

1. **Manifest format ownership.** We define the spec, ship the verifier, and
   release the open-source SDK. The format becomes the standard auditors
   ask vendors for.
2. **Vertical packs.** Each pack is a small in-house specialist team plus
   curated reference data. Hard to replicate without a 6+ month head start
   per vertical.
3. **Row-level provenance.** Merkle proofs + ed25519 signing — competitors
   sign at dataset granularity because per-row is more expensive. We do it.
4. **Open-source SDK + closed-source forge.** Community moat (PRs, eval
   templates, integrations) without giving away the generation stack.

---

## Slide 09 — Traction (placeholder)

Wave 2 ships 2026-05-08:

- Landing + NOWPayments invoice live.
- Brand + 10-doc strategy stack published as MIT-licensed source.
- First paying Bench customer: founder-internal, validating pipeline.

90-day target (see `/docs/09-go-to-market.md`):

- 25 Bench customers
- 6 Production customers
- 1 signed Enterprise quarter
- $32k+ revenue

---

## Slide 10 — Ask

Wave 2 self-funded. Wave 3 raise targets:

- $400k seed for the dashboard (`apps/app/`), API, forge worker pool.
- 1 founding ML engineer (verticals lead), 1 ops engineer (compute), 1 SDR
  for Enterprise outbound.
- 18-month runway to $1M ARR + a Series-A datasheet.

Contact: `foundry@synthetic-data-factory.prin7r.com`
GitHub: `github.com/prin7r-projects/synthetic-data-factory`
Notion: prin7r workspace, opportunity row "Synthetic data and datasets factory"
