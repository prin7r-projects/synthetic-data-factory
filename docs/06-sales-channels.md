# 06 — Sales channels

## Channel mix (Wave 2 → Wave 3)

| Channel | Weight (Wave 2) | Weight (Wave 3) | Why this channel fits |
|---------|------|------|-----------------------|
| Twitter / X (research-ML) | 25% | 30% | Mei (Persona 1) is on it daily. Manifest screenshots travel well. |
| Hacker News              | 20% | 15% | Ravi (Persona 2) browses; "Show HN" launch with a free Bench coupon for the first 30 schemas. |
| Reddit (`r/MachineLearning`, `r/LocalLLaMA`, `r/datascience`) | 10% | 5% | Tertiary discovery; long-tail SEO via crossposts. |
| Long-form posts on the site (`/posts/*` once we ship the blog) | 10% | 20% | The flagship piece is "Why your eval set needs a manifest". Pull-through to the landing. |
| LinkedIn (regulated verticals) | 10% | 15% | Elena (Persona 3) lives here. Vertical case studies. |
| Conference / community talks (NeurIPS, ACL, ICLR, MLOps.community, EleutherAI) | 10% | 10% | The calling card. Sponsor a workshop on reproducibility. |
| Direct outbound (sales-led) for Enterprise | 5% | 5% | Hand-built lists in healthcare networks, law firms, fintechs. |
| Partnerships with eval frameworks (Inspect, Promptfoo, Weave, Phoenix) | — | tracked | Co-launch templates: "Eval set + Mintset generator in a pull request." |

## Why each channel fits

### Twitter / X
The audience is the audience. ML/eval Twitter loves a clean technical
screenshot. The hero (schema in / row out) is built for screenshots. We
aim for 1 evergreen thread/week + 2 reply-engagement passes/week from the
founder account. KPI: 3 inbound demo requests/week from X by Wave-3 end.

### Hacker News
A "Show HN: Mintset — synthetic datasets with row-level provenance" launch
hits Ravi's exact frustration. Best done after we have at least 3 case
studies and the pitch deck (`/docs/10-pitch-deck.md`) reviewed. KPI: front
page once → 200+ Bench-tier signups/week for that week, ~10% conversion to
Production within 30 days.

### Reddit
Slow burn. `r/MachineLearning` rewards substance and punishes self-promotion;
we engage on threads that mention "synthetic data" or "eval reproducibility"
without dropping a link. KPI: 2 organic mentions/month by month-3.

### Long-form posts
The mode-of-publication is on-domain Markdown rendered via the `/posts`
route (Wave-3 deliverable). Topics: "Manifests as the product", "What we
learned from generating 7 medical-coding benchmarks", "Row-level
provenance: why dataset-level signing isn't enough". KPI: 1 post/week
landing organic traffic from "synthetic data manifest" / "synthetic data
eval" / "synthetic medical data" queries.

### LinkedIn
Long-form Elena/Ravi posts: 800–1500 words, screenshots from real (anonymized)
runs, named-vertical case studies. Founder posts 2x/week; ops engineer
1x/week. KPI: 1 inbound enterprise lead/week by month-4.

### Conference / community
Workshops > sponsorships. An invited talk at "ML Reproducibility Workshop"
beats a NeurIPS booth for our audience. Goal Wave-3: 2 accepted talks +
1 sponsored eval-tooling workshop.

### Direct outbound (Enterprise)
Hand-built list of 200 named accounts (regulated verticals + AI-mature
product cos). Founder-led for first 50; SDR-led after. Pitch deck shipped
ahead of the call. KPI: 1 booked discovery call/week, 1 closed quarter/month
by month-6.

### Eval-framework partnerships
Reach out to maintainers of Inspect (Anthropic), Promptfoo, Weave (W&B),
Phoenix (Arize), DeepEval. Co-author a `pip install foundry7-eval-template`
that drops a CI-ready synthetic eval set into a repo. KPI: 3 maintainer
collaborations by month-6.

## Channels we deliberately avoid

- **Paid search.** Synthetic-data buyers don't search; they're recommended.
- **Display ads.** Wrong medium for technical buyers.
- **Cold email blasts.** Burns the brand. Outbound is hand-built or it's silence.
- **Telegram/WhatsApp groups for free credit hunters.** Wrong audience.
