# Mintset — DESIGN.md

> Canonical design + style guide for `synthetic-data-factory`.
> Owned by Chief of Design. Synced with `apps/landing/tailwind.config.ts`,
> `apps/landing/app/globals.css`, and the live deployment at
> https://synthetic-data-factory.prin7r.com.

---

## 1. Product and audience

**Product.** Mintset generates labeled synthetic datasets for ML and AI teams.
The customer declares a schema (records, types, constraints), a bias profile
(distributions, edge-case densities), and a volume — Mintset returns a
labeled dataset alongside a signed reproducibility manifest (seed, model
versions, lineage hash, constraint pass/fail, bias drift in σ).

**Audience.** Three primary personas:

1. **Eval lead at an AI lab** — building benchmark/eval suites where ground
   truth must be defensible and reproducible. Lives in Slack + Notion +
   pull-request comments. Cares about manifests and audit trails more than
   any other persona on this list.
2. **ML engineer at a Series-B/C product company** — needs cold-start training
   data or edge-case augmentation, doesn't have time to build a generation
   pipeline themselves. Lives in Linear + GitHub + Cursor.
3. **Applied scientist at a regulated vertical** (medical, legal, fintech,
   robotics) — needs privacy-safe clones of production data + adjudicated
   labels with a human-in-the-loop. Will not buy without a regulator-ready
   audit pack.

Anti-personas: hobbyist Kaggle competitors looking for a free dataset, and
red-team researchers who want adversarial corpora at zero spend.

## 2. Visual positioning

Mintset is a *precision foundry*. Not "AI-data purple" — graphite, sodium,
ember. Not "abstract neuron mesh" — schemas you can read. Not "cloud-data
gradient" — hairlines, hazard tape, stamped seals.

The brand reference frame is industrial: sodium-vapor warehouse light,
graphite forging blocks, signal-yellow safety tape, ember-orange glow off a
crucible. The interface is auditable: every claim sits next to a number, a
hash, a pass/fail.

The schema is the hero. Every page treats schema/code as a first-class brand
element: monospace plates, hairline borders, no decorative wrappers.

Forbidden directions: gradients, glassmorphism, neon, neuron art, blockchain
chrome, abstract "data points floating in space" hero compositions.

## 3. ShadCN baseline and local component policy

**Baseline.** ShadCN/ui, Tailwind, Radix primitives. Components are *vendored
in-repo* under `apps/landing/app/components/ui/*` so the team can read and
edit the source. No black-box UI libraries become core styling infrastructure.

**Currently vendored.**
- `Button` (`button.tsx`) — variants: `default`, `ghost`, `ember`, `outline-light`
- `Card` (`card.tsx`) — minimal hairline-bordered surface

**Marketing freedoms.** The landing page may add expressive blocks not present
in baseline ShadCN: schema/code-as-art plates, hazard-tape dividers, stamped
seals, ledger rails. These are documented in `globals.css` under `@layer
components` and treated as project-owned utilities.

**Exceptions.** None as of build 2026-05-08.

## 4. Color tokens

Source of truth: `apps/landing/tailwind.config.ts` and
`apps/landing/app/globals.css` (CSS custom properties). DO NOT hand-edit hex
values outside these two files.

### Surfaces

| Token       | Hex       | Role                                |
|-------------|-----------|-------------------------------------|
| `graphite`  | `#0E1013` | Dark surface (footer, plates, manifest section) |
| `slag`      | `#1A1D22` | Slightly lifted dark surface       |
| `billet`    | `#22262C` | Card-on-dark hover                 |
| `sodium`    | `#FAFAF8` | Page background (sodium-vapor white) |
| `sodium-2`  | `#F0EFEC` | Alt section background             |

### Inks

| Token       | Hex       | Role                                |
|-------------|-----------|-------------------------------------|
| `ink`       | `#0E1013` | Primary text on light              |
| `ink-2`     | `#3A3F47` | Body text on light                 |
| `ash`       | `#7E8A95` | Eyebrow / metadata text            |

### Signals

| Token       | Hex       | Role                                |
|-------------|-----------|-------------------------------------|
| `ember`     | `#E25822` | Primary CTA / heat / signal accent |
| `ember-2`   | `#B7401C` | Pressed state                      |
| `flux`      | `#F2C94C` | Live / caution / metadata accent   |
| `weld`      | `#3FA48A` | Verified / pass                    |
| `scarlet`   | `#C03A3A` | Error / fail                       |

**Contrast.** All ink-on-sodium and sodium-on-graphite combinations clear
WCAG 2.1 AA at body sizes. Ember on sodium clears 3:1 for large text and
non-text UI components; never used for body copy.

## 5. Typography

| Role     | Family             | Weights      | Notes                                           |
|----------|--------------------|--------------|-------------------------------------------------|
| Display  | Inter Display → Inter | 600/700   | Tight tracking (`-0.018em` to `-0.024em`); used for section headings and the hero |
| Body     | Inter              | 400/500/600  | 15–17px on landing                              |
| Mono     | JetBrains Mono     | 400/500/700  | All schema/code blocks, eyebrow rails, metadata, run timing |

Loaded from Google Fonts in `apps/landing/app/layout.tsx`. The font feature
settings `tnum` (tabular numerics) are enabled site-wide so numbers in tables
and pricing align cleanly.

**Font size scale (landing):**

| Token           | Size  | Use                                     |
|-----------------|-------|-----------------------------------------|
| `text-runner`   | 13px  | Eyebrow / stencil tracking              |
| `text-base`     | 16px  | Body                                    |
| `text-[19px]`   | 19px  | FAQ question / footer heading           |
| `text-2xl`–`text-3xl` | 24–30px | Card titles, sub-section heads     |
| `text-[44px]`–`text-[68px]` | 44–68px | Hero H1 (responsive)        |
| `text-masthead` | 56px  | Section H2 desktop                      |
| `text-display`  | 108px | Reserved for display-only contexts (not used in current landing) |

## 6. Spacing, radius, shadows, and borders

- **Spacing.** Tailwind default scale (4px base). Section vertical rhythm:
  `py-20 md:py-28` (80px → 112px). Container padding: `1.5rem` mobile, `2.5rem`
  ≥md.
- **Radius.** `0` everywhere (square edges). The `pill`/`full` radius is reserved
  for status dots and chips only.
- **Shadows.** No shadows except `shadow-masthead` (1px hairline under the sticky
  nav) and `shadow-emberglow` (focused/active CTA glow — used sparingly).
- **Borders.** Hairlines only: `border-graphite/15` (light surfaces),
  `border-sodium/15` (dark surfaces). 1.5–2px borders reserved for the emphasized
  pricing card and the stamped seal.

## 7. Layout system and responsive rules

- **Container max-width:** 1200px (`max-w-prose` in this repo).
- **Grid:** 12-col on `md:` (≥768px), single-col below.
- **Breakpoints:** Tailwind defaults (`sm:640`, `md:768`, `lg:1024`, `xl:1280`).
- **Touch targets:** All interactive elements ≥40px tall on mobile.
- **Hero rule:** On `<md`, the schema-as-art block stacks below the hero copy
  and respects `overflow-x-auto` so the YAML and JSON examples never spill the
  viewport.
- **Sticky nav:** masthead at `top-0`, `bg-sodium/95 backdrop-blur`, hairline border below.

## 8. Component catalog

| Name          | Source                                   | Notes |
|---------------|------------------------------------------|-------|
| `Button`      | `app/components/ui/button.tsx`           | 4 variants × 3 sizes |
| `ButtonAnchor`| same                                     | renders as `<a>` for links |
| `Card`        | `app/components/ui/card.tsx`             | hairline-bordered surface |
| `PricingCta`  | `app/pricing-cta.tsx`                    | client component, owns NOWPayments handoff |
| `SchemaArt`   | inline in `app/page.tsx`                 | hero plate (input/output schema as art) |
| `CodeBlock`   | inline in `app/page.tsx`                 | titled monospace plate |
| `Masthead`    | inline in `app/page.tsx`                 | sticky header |
| `Footer`      | inline in `app/page.tsx`                 | 12-col footer with CTAs |

Custom utilities (declared in `globals.css`):
- `.eyebrow` — small caps tracker line
- `.chip` — bordered metadata pill
- `.plate` — graphite-on-sodium mono surface
- `.heat-tape` — diagonal hazard band
- `.stamp` — rotated stamped-seal corner badge
- `.ledger-rail` — auto-numbered list (uses CSS counters)
- `.dot-live` — pulsing yellow status dot

## 9. Landing page structure

In order down the page (matching `app/page.tsx`):

| # | Section            | Anchor       | Purpose |
|---|--------------------|--------------|---------|
| 00 | Masthead          | (sticky)     | Brand mark, nav, status, primary CTA |
| 01 | Hero              | `#hero`      | Schema-in / dataset-out · code-as-art |
| 02 | Operator marquee  | (none)       | "We forge for [audience]" stencil row |
| 03 | Use cases         | `#use-cases` | Cold-start / edge / eval / clones (4 cards) |
| 04 | Manifest          | `#manifest`  | Bias + reproducibility manifest sample |
| 05 | API quickstart    | `#api`       | curl, Python, Node, webhook code blocks |
| 06 | Run phases        | (none)       | T+0 → T+38m four-phase timeline |
| 07 | Pricing           | `#pricing`   | Bench / Production / Enterprise (NOWPayments crypto CTAs) |
| 08 | Provenance ledger | (none)       | Row-level Merkle proof table example |
| 09 | FAQ               | `#faq`       | 9 honest answers |
| 10 | Footer            | (none)       | Contact, secondary CTAs, copy |

## 10. Imagery and generated asset rules

- **Code-as-art.** The primary hero is *literally* the input YAML schema and
  the output JSON row. No stock photography. No "neural mesh" illustrations.
- **Generated assets.** None used in the v1 landing — schema/code is enough.
  If a future iteration adds illustrations, generate them via
  `prin7r-generate-image` (GPT Image 2) at `/apps/landing/public/generated/`
  with a sibling `<filename>.prompt.txt`.
- **Fallback.** If image generation is unavailable, prefer inline SVG (mark)
  or geometric backgrounds built with Tailwind utilities (`grid-foundry`).
- **Alt text.** Every `<img>` and `<svg>` is either described meaningfully or
  marked decorative with `aria-hidden`. No empty `alt=""` on meaningful imagery.

## 11. Motion and interaction rules

- **Hover.** Buttons: 100ms color transition, no scale, no shadow.
- **Pulse.** `dot-live` pulses on a 1.6s ease loop.
- **Focus.** 2px ember outline at 2px offset on every interactive element.
- **Animation policy.** No parallax, no entrance animations, no tickers. Motion
  is reserved for *status* (live dot, pulsing flux indicator on the schema
  plate). Treat motion like a fire alarm: only when something is actually
  happening.

## 12. Accessibility and quality gates

- WCAG 2.1 AA contrast for all text combinations.
- Tab order: skip-link → masthead nav → hero CTAs → section CTAs → footer.
- Visible focus ring (2px ember).
- All interactive elements have meaningful `aria-label` if their text is iconic.
- `<details>` is used for FAQ (native, screen-reader-friendly).
- No focus traps. No autoplay. No motion that violates `prefers-reduced-motion`
  (the only animation, `dot-live`, is below the WCAG flicker threshold).

Quality gates (must pass before "done"):

- [x] DESIGN.md present at root with all 15 sections
- [x] ShadCN baseline followed; exceptions = none
- [x] Desktop screenshot at `/docs/screenshots/landing-desktop.png` (1440×900)
- [x] Mobile screenshot at `/docs/screenshots/landing-mobile.png` (390×844)
- [x] Both linked in this DESIGN.md (§13) and embedded in README
- [x] No text overlap or overflow at 320px / 768px / 1024px / 1440px
- [x] Keyboard focus visible on every interactive element
- [x] All images have meaningful or `aria-hidden` alt
- [x] No `Lorem ipsum`; no `TODO` strings shipped
- [x] `curl -sI https://synthetic-data-factory.prin7r.com` → HTTP/2 200
- [x] NOWPayments CTA produces a real unpaid hosted invoice (verified)

## 13. Screenshots and verification artifacts

| Viewport | Path                                | Captured from |
|----------|-------------------------------------|---------------|
| 1440×900 desktop | `docs/screenshots/landing-desktop.png` | https://synthetic-data-factory.prin7r.com |
| 390×844 mobile   | `docs/screenshots/landing-mobile.png`  | https://synthetic-data-factory.prin7r.com |

Capture script: `/tmp/prin7r-screenshots/capture.mjs` (Playwright Chromium,
`networkidle`).

## 14. External references and library sources

- ShadCN/ui — https://ui.shadcn.com
- Inter & Inter Display — https://rsms.me/inter/
- JetBrains Mono — https://www.jetbrains.com/mono/
- Refero Styles (DESIGN.md gallery) — https://styles.refero.design/
- Inspiration: precision-instrument catalogues (Leica Camera AG, Sennheiser
  product datasheets, Linotype foundry specimens), industrial signage
  (sodium-vapor warehouse photography, hazard-tape standards).

We deliberately avoid: Vercel / Linear / Stripe-style aesthetics, neon "AI"
brand patterns, abstract "neural net" hero compositions.

## 15. Changelog

- **2026-05-08 v1.0** — initial DESIGN.md. Tokens, type, layout, components,
  and landing structure all locked. Quality gates met for the Wave 2 launch.
