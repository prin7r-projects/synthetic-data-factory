# 09 — Go-to-market — 90-day plan

A weekly milestone calendar from launch (Wave 2 ship — 2026-05-08) through
day 90.

## Phase 1 — Foundation (Weeks 1–4)

The first month is *not* about volume. It's about hand-built trust.

| Week | Milestone | Owner |
|------|-----------|-------|
| W1 | Wave 2 ship live: landing + NOWPayments + DESIGN.md + 10 docs + screenshots committed | Build agent + Chief of Design |
| W1 | First Bench-tier paid invoice (founder buys one to test the pipeline end-to-end) | Founder |
| W2 | Outbound batch 1: hand-emailed intros to 30 named eval leads. Code `PRIN7R-FOUNDRY-50` for free Bench. | Founder |
| W2 | Twitter/X founder account: 5 posts including a manifest screenshot from W1's first run. | Founder |
| W3 | Outbound batch 2: 30 more named accounts (regulated verticals — hospital networks, fintechs). | Founder |
| W3 | First long-form post drafted: "Manifests as the product." | Founder |
| W4 | Long-form post published; crosspost LinkedIn + HN (no front-page push yet — earn it). | Founder |
| W4 | First *external* paying Bench-tier customer. | Inbound |

**KPI gates W1–4.**
- 5 paying Bench customers (3 inbound, 2 from outbound discount code).
- 250 Twitter followers.
- 1 published long-form post.
- 100% of paid runs delivered with a manifest.

## Phase 2 — Validate (Weeks 5–8)

Switch from hand-built to repeatable.

| Week | Milestone | Owner |
|------|-----------|-------|
| W5 | First paying Production customer. | Inbound |
| W5 | Founder sales call template + pitch-deck rehearsal recorded. | Founder |
| W6 | Outbound batch 3: 50 named accounts using results from W4 inbound conversion. | Founder |
| W6 | Second long-form post: "Why your eval set needs a manifest." | Founder |
| W7 | First refund issued (intentional — proves the policy works). | Founder |
| W7 | Eval-framework partnership conversation opened (Promptfoo or Inspect). | Founder |
| W8 | "Show HN: Mintset" launch (only if W7 customer count ≥10). | Founder |
| W8 | First customer testimonial captured (text + permission). | Founder |

**KPI gates W5–8.**
- 12 paying Bench customers cumulative.
- 3 paying Production customers cumulative.
- 1 active Enterprise conversation.
- 500 Twitter followers; 100 LinkedIn followers.
- 1 HN front-page post (or accepted-failure: capture lessons and try again at W12).

## Phase 3 — Repeat (Weeks 9–12)

Optimize the funnel.

| Week | Milestone | Owner |
|------|-----------|-------|
| W9  | First case study published (named customer if permission, anonymized otherwise). | Marketing draft + Founder review |
| W10 | Eval-template repo released — `pip install foundry7-eval-template`. | Engineering |
| W10 | First conference proposal submitted (NeurIPS Reproducibility Workshop or ML Collective). | Founder |
| W11 | First Enterprise quarter signed. | Founder + Ops |
| W11 | Wave 3 scoping kickoff: dashboard (`apps/app/`), API (`api.synthetic-data-factory.prin7r.com`), forge worker pool. | Engineering |
| W12 | Public quarterly retro post: numbers shipped, lessons learned, next 90-day plan. | Founder |
| W12 | Plisio backup payment rail wired (in case NOWPayments has a regional gap). | Engineering |

**KPI gates W9–12.**
- 25 paying Bench customers cumulative.
- 6 paying Production customers cumulative.
- 1 signed Enterprise quarter.
- 1 conference proposal submitted.
- $32,000+ in cumulative revenue.

## Day-1 launch checklist

Done as part of Wave 2 (2026-05-08):

- [x] Landing live at `https://synthetic-data-factory.prin7r.com`
- [x] HTTP/2 200 + valid Let's Encrypt cert
- [x] NOWPayments hosted invoice path live (verified end-to-end)
- [x] IPN webhook verifies HMAC-SHA512 and returns 200 on a verified payload
- [x] DESIGN.md at root, 15 sections
- [x] All 10 `/docs/*.md` published
- [x] Pitch deck Markdown + standalone HTML
- [x] Desktop + mobile screenshots committed and embedded
- [x] Notion opportunity updated: Source URL, Status Notes, Stage promoted to Qualified

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| NOWPayments fiat partner unavailable in a region | Plisio rail wired in W12; manual EUR/USD wire invoice always offered. |
| GPU cost spike at first Production volume | Wave 3 capacity plan locks Hetzner GPU host with reserved instances; cap free tier at 50k records. |
| Generic competitor copies "manifest as a product" framing | The audit pack + row-level Merkle is the real moat; framing is just how we say it. |
| First HN launch flops | Treat as evergreen; reattempt at W12 with 3 customer logos. |
| Eval-framework partner says no | Two parallel conversations; if both fall through, ship the eval template solo and apply for funding via Anthropic Build / OpenAI Startup Fund. |
