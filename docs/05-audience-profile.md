# 05 — Audience profile

## Ideal customer profile (ICP)

| Dimension       | Value |
|-----------------|-------|
| Industry        | AI labs, regulated AI verticals (medical / legal / fintech / robotics), product companies with a non-trivial ML team |
| Stage           | Series-A through pre-IPO; in regulated verticals also enterprise/healthcare networks |
| Team shape      | At minimum 1 dedicated ML/eval engineer; ideally a 2–6 person ML or eval team |
| Geography (Wave 2) | English-speaking — US, UK, EU, IN, SG. Translation packs for DE, FR, NL, IT, ES land in Wave 3. |
| Annual budget for data | $30k–$1M+ |
| Buying power    | IC engineer with discretionary spend up to ~$2,400 (Production tier); director/VP for Enterprise quarterly |

## Persona 1 — Mei (Eval lead, primary)

- **Role**: Eval / post-train lead at a 50–500 person AI lab.
- **Age / background**: 28–40, MS or PhD in ML, prior eval work at a Big-AI lab.
- **Owns**: Benchmark suites, regression dashboards, model-card eval sections.
- **Goals**:
  - A reproducible benchmark her CEO can defend in front of regulators.
  - Catch regressions in CI before customer escalations.
- **Frustrations**:
  - Manual annotation is too slow.
  - Synthetic-data vendors don't ship a manifest she can defend.
  - Public benchmarks are saturated.
- **Channels**: Slack, Notion, GitHub, X/Twitter, NeurIPS/ACL/ICLR, EleutherAI/Apart Research adjacent Discords.
- **Buying motion**: Reads, prototypes, runs Bench tier on a card. If
  satisfied, escalates to Production with VP sign-off.

## Persona 2 — Ravi (ML engineer, secondary)

- **Role**: IC ML engineer or staff/senior eng at a Series-B/C product company.
- **Age / background**: 24–35, BS/MS CS, 3–8 years experience.
- **Owns**: One product surface — recommendations, support automation, search,
  AML monitoring, etc.
- **Goals**:
  - Ship a fine-tune that moves a metric.
  - Predictable training-data spend.
- **Frustrations**:
  - Cold-start data missing.
  - Annotation contractors are flaky.
- **Channels**: Linear, GitHub, Slack, Cursor, Hacker News, podcast feeds (Latent Space, ML Street Talk, MLOps.community).
- **Buying motion**: Fast — Bench tier on a card, scale to Production if results land.

## Persona 3 — Dr. Elena (Applied scientist, regulated vertical)

- **Role**: Applied scientist or research lead at a hospital network, law firm, fintech bank, or robotics lab.
- **Age / background**: 35–55, MD or PhD in domain + ML certification, 10+ years in industry.
- **Owns**: Compliance-sensitive ML programs.
- **Goals**:
  - Ship clinical/legal/financial AI without crossing regulatory red lines.
  - Demo to vendors without exposing real customer data.
- **Frustrations**:
  - Legal blocks every cross-org data flow.
  - Generic synthetic-data tools lack the audit pack.
- **Channels**: LinkedIn, ACM/IEEE journals, vertical conferences (HIMSS, AGRRR, NeurIPS-Med), Notion, email.
- **Buying motion**: Slow — wants a Zoom call, a wire/EUR invoice, an MSA review, and a security questionnaire response. Worth the cycle.

## Anti-personas

- **Hobbyist Kaggle competitor.** Zero willingness to pay; expects the dataset for free. We do not target.
- **Red-teamer looking for adversarial corpora at zero spend.** Edge cases are a use case (Card 02), but we charge for them. If the asker is research-only with no budget, we send them to public datasets.
- **"AI consultant" asking for a generic data dump.** We are schema-driven; if they don't know what they want generated, we can't help yet. Direct them to Notion + a discovery session — Wave 3 may add a guided schema-builder for this segment.

## Customer-acquisition unit economics (Wave 2 plan)

| Tier        | List price        | Target CAC | Target LTV |
|-------------|-------------------|------------|------------|
| Bench       | $480 single run   | $80 (PLG)  | $480 → $2,400 expansion in 30 days for 25% |
| Production  | $2,400/mo         | $400       | $14,400 (6-month median tenure assumption) |
| Enterprise  | $12,000/quarter   | $2,500 (sales) | $48,000+ (multi-quarter) |

These are planning numbers; actuals tracked in Wave 3 once analytics ship.

## Source / signals

- Notion opportunity rank #51 of 144, score 7.276.
- Codex score 76/100 with verdict: "Good AI/tooling market but quality/evaluation burden is real. Clarification: focus on domain-specific benchmark/eval datasets first."
- Strategy: Vertical content factory.
