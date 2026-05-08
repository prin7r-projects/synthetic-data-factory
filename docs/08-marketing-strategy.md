# 08 — Marketing strategy

## Positioning (one-line)

**SynthTable is the synthetic-data factory that ships the manifest *as the
product*** — schema in, dataset out, with row-level provenance an auditor
will accept.

## Messaging hierarchy

### Tier 1 — North star

> Schema in. Dataset out. With a receipt.

### Tier 2 — Audience-segmented headlines

| Audience | Headline |
|----------|----------|
| Eval lead | "A benchmark your CEO can defend." |
| ML engineer | "Cold-start your model in 48 hours." |
| Applied scientist (regulated) | "A clone the regulator will accept." |
| Generic developer | "POST a schema. GET a dataset." |

### Tier 3 — Proof points (always with a number)

- "50,000 records, 8/8 constraints passed, 0.014σ drift, 38 minutes."
- "Row-level Merkle proofs — drop one row without re-running the dataset."
- "Vertical packs: medical, legal, fintech, robotics."
- "Pay in USDT or USDC. Or wire us EUR. Either works."
- "Open-source SDK, MIT-licensed."

## Content pillars

| Pillar | Why | Sample artifacts |
|--------|-----|------------------|
| **Reproducibility** | Our differentiator. Every artifact has a hash. | "Manifests as the product" essay; manifest-format spec; ed25519 verification CLI |
| **Verticals** | Where generic vendors fail. | "Medical-coding benchmarks: what we learned from 7 runs"; "Legal clause generation: getting jurisdictional variation right"; robotics sensor-trace whitepapers |
| **Honest limits** | Trust earned by saying what we *can't* do. | "What synthetic data is bad at"; "When to use us, when not to" |
| **Open-source** | Community moat. | foundry7-sdk on GitHub; eval-template integrations (Inspect/Promptfoo/Weave); free benchmark drops once a quarter |

## Cadence (Wave-3 plan; Wave 2 lays the foundation)

| Channel | Frequency | Owner |
|---------|-----------|-------|
| X/Twitter founder | 5 posts + 1 thread / week | Founder |
| LinkedIn founder | 2 posts / week | Founder |
| LinkedIn ops engineer | 1 post / week | Ops |
| Long-form site post | 1 / week | Founder + ghost-edit |
| HN launch | One per major milestone | Founder |
| Conference talk | 2 / quarter | Founder |
| Newsletter | 1 / 2 weeks | Marketing (Wave 3) |

## Launch sequence (next 90 days)

| Week | Action |
|------|--------|
| 0–2  | Wave 2 ship: landing live, NOWPayments invoice live, brand identity locked, DESIGN.md published, 10 docs published. **Done by 2026-05-08.** |
| 2–4  | First-50 outbound: hand-emailed introductions to named eval leads at 30 AI labs. Free Bench credit code (`PRIN7R-FOUNDRY-50`). |
| 4–6  | First long-form post: "Manifests as the product". Crosspost LinkedIn + HN. |
| 6–8  | "Show HN: SynthTable" launch (only after at least 5 paying Bench customers + 1 Production customer). |
| 8–10 | First case study (with explicit logo permission). Recorded teardown of a synthetic medical-coding benchmark. |
| 10–12 | Eval-framework partnership (Promptfoo or Inspect) — co-author the eval-template repo. |
| 12+  | Apply to NeurIPS Reproducibility Workshop with co-author. |

## Brand voice in marketing copy

**Do.**
- Talk like a precision-instrument catalogue: confident, neutral, exact.
- Use numbers and hashes. ("0.014σ", "0x8c4f9aa1", "38 minutes", "8/8")
- Acknowledge synthetic-data limits.
- Quote real customers (after permission, of course).

**Don't.**
- Use the words "AI" or "intelligent" gratuitously.
- Compare to competitors by name in headline copy. (Comparisons live in
  `/docs/04-pain-points.md` for buyers who go looking.)
- Use emoji on the marketing surface.
- Promise reproducibility without the manifest delivery to back it up.

## Visual marketing assets (Wave 2 vs Wave 3)

| Asset | Wave 2 | Wave 3 |
|-------|--------|--------|
| Landing | ✅ | iterate |
| OG share card | ✅ (auto from metadata) | custom hero share-image |
| LinkedIn / X header | minimal text mark | branded composition |
| Pitch deck | ✅ (`/docs/10-pitch-deck.md` + HTML) | exported PDF |
| Manifest screenshot library | inline in landing | shareable image bank |
| Demo video | — | 90-second hero loop |

## Metrics

| Metric | Wave 2 baseline | 90-day target |
|--------|-----------------|---------------|
| Landing visits / week | n/a | 1,000 |
| Bench-tier signups / week | 0 | 10 |
| Production-tier signups / week | 0 | 1 |
| Enterprise pipeline (named accounts in conversation) | 0 | 8 |
| Twitter/X follower count | 0 | 1,500 |
| LinkedIn engagements / month | n/a | 3,000 |
| Customer NPS | n/a | 50+ on first 30 customers |
