# 01 — Brand identity

> SynthTable — synthetic data, declared.

## Brand pyramid

- **Essence (1 word):** Precision.
- **Personality (3 traits):** Auditable. Industrious. Unsentimental.
- **Values (3):** Provenance over plausibility. Receipts over rhetoric. Specialists over swiss-army knives.
- **Attributes (5):** Reproducible. Vertical. Schema-first. Signed. Conservative-by-default.

## Positioning statement

For **ML engineers, eval leads, and applied scientists** who **need labeled
data with a defensible audit trail**, **SynthTable** is a **synthetic data
factory** that **delivers schema-driven datasets with row-level provenance
and a signed reproducibility manifest** — unlike **generic synthetic-data
platforms** because **we treat the manifest as the product, not the
afterthought, and we ship vertical specialists instead of a one-model fits
all generator**.

## Audience personas

### Primary — Eval lead at an AI lab

- **Profile:** 28–40, eval/post-train team at a frontier or scale-up AI lab.
  Reports to a head of research or VP of AI safety. Owns benchmark suites and
  regression dashboards.
- **Goals:** Ship a benchmark a regulator will respect. Catch regressions
  before they reach customers. Keep the eval set reproducible across major
  model retrains.
- **Frustrations:** "Manual annotation is too slow." "Existing synthetic data
  vendors don't ship a manifest I can defend in an audit." "Public benchmarks
  are saturated; we need bespoke."
- **Channels:** Slack (work + community), Notion, GitHub PRs, X/Twitter ML
  feed, EleutherAI/Apart-Research adjacent Discords, conferences (NeurIPS,
  ACL, ICLR).

### Secondary — ML engineer at a Series-B/C product company

- **Profile:** 24–35, IC ML engineer or staff/senior eng. Owns one product
  surface (recommendations, support automation, search). 2-person eval team,
  no dedicated data team.
- **Goals:** Ship fine-tunes that actually move metrics. Don't let bad eval
  blow up post-deploy. Keep training-data spend predictable.
- **Frustrations:** Cold-start data is missing. Edge cases hit prod before
  hitting tests. Crowdsourced annotation is expensive and noisy.
- **Channels:** Linear, GitHub, Slack, Cursor, Discord, podcast feeds.

## Voice & tone

**Do's**
1. Sound like an industrial-instrument catalogue: confident, neutral, exact.
2. Use numbers and hashes when stakes appear. ("0.014σ drift", "0x8c4f9aa1").
3. Acknowledge the limits of synthetic data; don't oversell.

**Don'ts**
1. No "AI magic". No "intelligent" synonyms. No purple prose.
2. No comparisons to public competitors by name in headline copy (nuanced
   takes belong in `/docs/04-pain-points.md`, not the hero).
3. No emoji on the marketing surface (the system prompt forbids it anyway).

**Sample sentence.** "A 50,000-row dataset, signed, with 8/8 constraints
passing and 0.014σ bias drift, ready in 38 minutes."

## Visual system

### Palette

| Role        | Token          | Hex       |
|-------------|----------------|-----------|
| Primary surface (light) | `sodium`     | `#F5F2EA` |
| Alt surface (light)     | `sodium-2`   | `#EDE8DB` |
| Primary surface (dark)  | `graphite`   | `#0E1013` |
| Alt surface (dark)      | `slag`       | `#1A1D22` |
| Body text (light bg)    | `ink-2`      | `#3A3F47` |
| Metadata / eyebrow      | `ash`        | `#7E8A95` |
| Primary action          | `ember`      | `#E25822` |
| Action pressed          | `ember-2`    | `#B7401C` |
| Live / caution          | `flux`       | `#F2C94C` |
| Verified / pass         | `weld`       | `#3FA48A` |
| Error / fail            | `scarlet`    | `#C03A3A` |

### Typography

- **Display:** Inter Display (fallback: Inter), 600/700.
- **Body:** Inter, 400/500/600.
- **Mono:** JetBrains Mono, 400/500/700.

Mono is treated as a *primary* brand element — schemas are the visible
artifact of the factory, so they live in monospace plates everywhere.

### Logo concept

A wordmark `SynthTable` where the `/` is rendered in `ember`. The "7" is a
nod to the `prin7r` parent brand. No standalone monogram — the wordmark
*is* the mark. Inline SVG mark used for favicon: a stack of three plates
(records) with one plate ember-tinted (the row being forged).

```svg
<svg viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0E1013"/>
  <path d="M6 8h20v3H6zM6 14.5h14v3H6zM6 21h20v3H6z" fill="#F5F2EA"/>
  <rect x="22" y="14.5" width="4" height="3" fill="#E25822"/>
</svg>
```

### Spacing / radius / motion

- Base 4px; section vertical rhythm `py-20 md:py-28`.
- Radius `0` everywhere except status dots (`rounded-full`).
- Motion only for *status* (live dot pulse, "compiling" flux indicator).
  No entrance animations, no parallax.

## Forbidden directions

- "AI data purple" gradients.
- Abstract neuron-mesh hero illustrations.
- Cloud-data gradient stock backgrounds.
- Stripe / Vercel / Linear-style aesthetics.
- Glassmorphism, neon, blockchain chrome.
- Lorem ipsum or `TODO` strings shipped.

## See also

- DESIGN.md — full token + component spec
- 02-architecture.md — system that the brand fronts
- 08-marketing-strategy.md — voice applied to channel mix
