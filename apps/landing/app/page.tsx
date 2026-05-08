import * as React from "react";
import { ButtonAnchor } from "@/app/components/ui/button";
import { PricingCta } from "@/app/pricing-cta";

/**
 * [FOUNDRY7_LANDING] Single long-scroll landing for synthetic-data-factory.
 *
 * Sections, in order:
 *   00 — Masthead (brand mark + nav + status)
 *   01 — Hero: schema declaration → generated row preview (code-as-art)
 *   02 — Operator marquee (we generate FOR ___)
 *   03 — Four use cases (cold-start / edge-case / eval / privacy clones)
 *   04 — Bias and reproducibility manifest
 *   05 — API quickstart (curl + python + node tabs as static blocks)
 *   06 — How a run executes (4 phases)
 *   07 — Pricing — Bench / Production / Enterprise (NOWPayments crypto CTAs)
 *   08 — Provenance and audit drawer
 *   09 — FAQ
 *   10 — Footer
 */

export default function HomePage() {
  return (
    <main className="bg-graphite text-sodium">
      <Masthead />
      <Hero />
      <OperatorMarquee />
      <UseCases />
      <Manifest />
      <ApiQuickstart />
      <RunPhases />
      <section
        id="pricing"
        className="border-t border-sodium/12 py-20 md:py-28"
      >
        <div className="container max-w-prose">
          <header className="grid md:grid-cols-12 gap-6 items-end mb-12">
            <div className="md:col-span-7">
              <span className="eyebrow">07 · Pricing</span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 leading-tight tracking-tightest">
                Three credit shapes. One foundry.
              </h2>
            </div>
            <p className="md:col-span-5 text-sodium/70 text-[16px] leading-snug">
              Buy a single bench run, a monthly production credit, or a quarterly managed
              program. Pay in USDT or USDC — the invoice is hosted by NOWPayments and the
              fiat partner card on-ramp is enabled.
            </p>
          </header>
          <PricingCta />
          <p className="font-mono text-[11px] tracking-stencil uppercase text-ash mt-8 text-center">
            Need an invoice in EUR / GBP / wire? Email{" "}
            <a href="mailto:foundry@synthetic-data-factory.prin7r.com" className="underline decoration-ember underline-offset-4">
              foundry@synthetic-data-factory.prin7r.com
            </a>
          </p>
        </div>
      </section>
      <Provenance />
      <Faq />
      <Footer />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* 00 — Masthead                                                       */
/* ------------------------------------------------------------------ */

function Masthead() {
  return (
    <header
      className="sticky top-0 z-30 bg-graphite/85 backdrop-blur border-b border-sodium/10 shadow-masthead"
      aria-label="SynthTable site header"
    >
      <div className="container max-w-prose flex items-center justify-between h-14">
        <a href="#hero" className="flex items-center gap-2.5 group">
          <span aria-hidden className="font-mono text-[12px] tracking-stencil uppercase text-ash">
            St
          </span>
          <span className="font-display text-[19px] font-semibold tracking-tightest">
            SynthTable
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-[14px]">
          <a href="#use-cases" className="hover:text-ember transition-colors">
            What we generate
          </a>
          <a href="#manifest" className="hover:text-ember transition-colors">
            Manifest
          </a>
          <a href="#api" className="hover:text-ember transition-colors">
            API
          </a>
          <a href="#pricing" className="hover:text-ember transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-ember transition-colors">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] tracking-stencil uppercase text-sodium/70">
            <span className="dot-live" aria-hidden></span>
            <span>SYNTHTABLE ONLINE</span>
          </span>
          <ButtonAnchor href="#pricing" size="sm" variant="default">
            Start a run
          </ButtonAnchor>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 01 — Hero — schema in / row out                                    */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-sodium/10"
      aria-label="Hero"
    >
      <div className="absolute inset-0 grid-foundry pointer-events-none" aria-hidden></div>
      <div className="container max-w-prose relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          {/* Left: copy */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="chip border-sodium/25 text-sodium">
                <span className="dot-live" aria-hidden></span>
                <span>FOUNDRY/7 · BUILD&nbsp;0507·26</span>
              </span>
              <span className="font-mono text-[11px] tracking-stencil uppercase text-ash">
                v1.0 · prin7r.com
              </span>
            </div>
            <h1 className="font-display font-semibold leading-[0.96] tracking-tightest text-[44px] sm:text-[56px] md:text-[68px]">
              Schema in.
              <br />
              <span className="text-ember">Dataset out.</span>
            </h1>
            <p className="mt-7 text-[18px] leading-snug text-sodium/70 max-w-[44ch]">
              On-demand synthetic data for ML teams. Declare the schema, the constraints,
              and the bias profile you want. Receive a labeled dataset with provenance,
              audit log, and a reproducibility manifest you can hand to a regulator.
            </p>

            <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-2 text-[14px] text-sodium/70">
              <li className="flex items-baseline gap-2">
                <span className="text-ember font-mono text-xs">01</span>
                <span>Cold-start training sets</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-ember font-mono text-xs">02</span>
                <span>Edge-case augmentation</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-ember font-mono text-xs">03</span>
                <span>Eval benchmarks &amp; contrast sets</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-ember font-mono text-xs">04</span>
                <span>Privacy-safe production clones</span>
              </li>
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonAnchor href="#pricing" size="lg" variant="ember">
                Start a bench run · $480
              </ButtonAnchor>
              <ButtonAnchor href="#api" size="lg" variant="ghost">
                Read the API quickstart
              </ButtonAnchor>
            </div>

            <p className="mt-5 font-mono text-[11px] tracking-stencil uppercase text-ash">
              Pay in USDT / USDC · NOWPayments hosted invoice · 48-hour first dataset
            </p>
          </div>

          {/* Right: schema-as-art */}
          <div className="md:col-span-6">
            <SchemaArt />
          </div>
        </div>
      </div>
    </section>
  );
}

function SchemaArt() {
  return (
    <div className="relative">
      {/* Stamped seal */}
      <div className="absolute -top-3 -left-3 z-10">
        <span className="stamp">VERIFIED · MANIFEST 0x8c4f</span>
      </div>

      {/* Schema declaration plate */}
      <figure className="plate p-5 md:p-6 grid-foundry-dark">
        <figcaption className="flex items-center justify-between mb-4">
          <span className="font-mono text-[11px] tracking-stencil uppercase text-sodium/60">
            Input · schema.foundry.yml
          </span>
          <span className="font-mono text-[11px] tracking-stencil uppercase text-flux">
            <span className="inline-block w-1.5 h-1.5 bg-flux rounded-full mr-1.5 animate-pulse align-middle" aria-hidden></span>
            COMPILING
          </span>
        </figcaption>
        <pre
          className="font-mono text-[12.5px] leading-[1.55] text-sodium overflow-x-auto"
          aria-label="Schema declaration example"
        >
{`dataset: support_tickets_emea
domain: customer_support
locale: [en-GB, de-DE, fr-FR, nl-NL]
volume: 50_000

schema:
  ticket_id:    uuid
  channel:      enum[email, chat, voice_transcript]
  product_sku:  ref(./skus.csv, weighted)
  intent:       enum[refund, defect, billing, how_to, escalation]
  message:      text(min=24, max=420, lang=$locale, register=mixed)
  sentiment:    float(-1..1, dist=skew_neg)
  escalated:    bool(p=0.18 if intent in [defect, escalation])

bias_profile:
  age_distribution:    uniform(22, 71)
  income_distribution: lognormal(mu=10.6, sigma=0.42)
  edge_cases:
    - sarcasm_density:        0.06
    - codeswitching_density:  0.04
    - non_native_grammar:     0.11

constraints:
  - escalated == true => sentiment < -0.3
  - if locale == "de-DE": message.formal_register >= 0.7
  - product_sku ∈ skus.csv  # foreign key

reproducibility:
  seed: 0x4f5c
  manifest: signed
  emit:    [jsonl, parquet]
`}
        </pre>
      </figure>

      {/* Arrow / heat band */}
      <div className="my-3 flex items-center gap-3" aria-hidden>
        <div className="flex-1 h-2 bg-tape-orange opacity-90"></div>
        <span className="font-mono text-[11px] tracking-stencil uppercase text-sodium/70">
          GENERATING · 50,000 rows · seed 0x4f5c
        </span>
        <div className="flex-1 h-2 bg-tape-orange opacity-90"></div>
      </div>

      {/* Output sample row */}
      <figure className="border border-sodium/15 bg-slag p-5 md:p-6 relative">
        <figcaption className="flex items-center justify-between mb-3">
          <span className="font-mono text-[11px] tracking-stencil uppercase text-ash">
            Output · row 14,492 / 50,000 · jsonl
          </span>
          <span className="font-mono text-[11px] tracking-stencil uppercase text-weld">
            ✓ MANIFEST: 0x8c4f9aa1
          </span>
        </figcaption>
        <pre className="font-mono text-[12.5px] leading-[1.6] text-sodium overflow-x-auto">
{`{
  "ticket_id":   "0c9e2a4b-7e54-4f2a-9e01-2b8a4...",
  "channel":     "voice_transcript",
  "product_sku": "AX-740-BLK",
  "intent":      "escalation",
  "message":     "Hi, das ist jetzt das dritte Mal — der
                  Knopf hängt komplett. Ich brauche
                  einen Vorgesetzten, sofort.",
  "sentiment":    -0.78,
  "escalated":    true,

  "_provenance": {
    "lineage":   "sha256:8c4f…",
    "model":     "foundry-text-3.1 + foundry-policy-1",
    "seed":      "0x4f5c",
    "row_proof": "0x4a31d2ef…"
  }
}`}
        </pre>
      </figure>

      {/* Output meta strip */}
      <div className="mt-3 grid grid-cols-3 gap-3 font-mono text-[11px] tracking-stencil uppercase">
        <div className="border border-sodium/12 bg-slag px-3 py-2">
          <div className="text-ash">RECORDS</div>
          <div className="text-sodium text-base mt-0.5 tabular">50,000</div>
        </div>
        <div className="border border-sodium/12 bg-slag px-3 py-2">
          <div className="text-ash">CONSTRAINTS PASSED</div>
          <div className="text-weld text-base mt-0.5 tabular">3 / 3 ✓</div>
        </div>
        <div className="border border-sodium/12 bg-slag px-3 py-2">
          <div className="text-ash">BIAS DRIFT</div>
          <div className="text-sodium text-base mt-0.5 tabular">0.014 σ</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Operator marquee                                              */
/* ------------------------------------------------------------------ */

function OperatorMarquee() {
  const lines = [
    "WE FORGE FOR",
    "ML TEAMS",
    "EVAL LEADS",
    "APPLIED SCIENTISTS",
    "RED-TEAMERS",
    "SAFETY ENGINEERS",
    "DATA PRODUCT MANAGERS",
    "ROBOTICS LABS",
    "FINTECH RISK DESKS",
    "MEDICAL AI",
    "LEGAL AI",
    "EDU AI"
  ];
  return (
    <section className="bg-slag text-sodium border-y border-sodium/10 py-3 overflow-hidden">
      <div className="container max-w-[1400px] flex flex-wrap items-center gap-x-8 gap-y-1 font-mono text-[11px] tracking-stencil uppercase">
        {lines.map((l, i) => (
          <span key={l} className={i === 0 ? "text-ember" : "text-sodium/70"}>
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Use cases                                                      */
/* ------------------------------------------------------------------ */

function UseCases() {
  const cases = [
    {
      tag: "01 · COLD-START",
      title: "Boot a model when you have zero real data.",
      body:
        "You have a product idea but no users yet — and no data to fine-tune on. We generate the first 100k examples that look like the world your model will see, with intent and tone distributions you control.",
      bullets: [
        "First-touch fine-tunes",
        "Pre-launch benchmark dummies",
        "Cold-start RLHF prompts"
      ]
    },
    {
      tag: "02 · EDGE-CASE AUGMENTATION",
      title: "Find the failure modes before production does.",
      body:
        "You already have data, but it's smooth. We synthesize the long tail: code-switching, sarcasm, OCR noise, adversarial typos, near-OOD inputs. Boost your eval set so the next regression is caught in CI.",
      bullets: [
        "Adversarial contrast sets",
        "Counterfactuals (one-attribute flips)",
        "OOD perturbations with manifest"
      ]
    },
    {
      tag: "03 · EVAL BENCHMARKS",
      title: "Build the benchmark that proves your claim.",
      body:
        "Your model is shipped — now prove it. We forge labeled benchmark sets aligned to a rubric you supply: ground truth, gold labels, calibration buckets, plus a reproducibility manifest auditors will accept.",
      bullets: [
        "Domain-specific gold sets",
        "Bias / fairness slices",
        "Versioned scorers + rubric"
      ]
    },
    {
      tag: "04 · PRIVACY-SAFE CLONES",
      title: "Replace production data when legal won't let you ship it.",
      body:
        "We take a real schema and synthesize a statistically faithful clone — same joint distributions, same correlations, zero PII. Train, demo, or share with a vendor without DPA review purgatory.",
      bullets: [
        "k-anonymous + l-diverse outputs",
        "PII scrubber + signed attestation",
        "GDPR / HIPAA artefact pack"
      ]
    }
  ];

  return (
    <section
      id="use-cases"
      className="py-20 md:py-28 border-b border-sodium/10 grid-foundry"
    >
      <div className="container max-w-prose">
        <header className="grid md:grid-cols-12 gap-6 items-end mb-12">
          <div className="md:col-span-8">
            <span className="eyebrow">03 · What we generate</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 leading-tight tracking-tightest">
              Four shapes of dataset, one foundry floor.
            </h2>
          </div>
          <p className="md:col-span-4 text-sodium/70 text-[15.5px] leading-snug">
            Every SynthTable run starts as a schema and ends as a signed dataset. The
            shape changes; the rigor doesn&apos;t.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {cases.map((c) => (
            <article
              key={c.tag}
              className="border border-sodium/15 bg-slag p-7 flex flex-col"
            >
              <span className="font-mono text-[11px] tracking-stencil uppercase text-ember">
                {c.tag}
              </span>
              <h3 className="font-display text-2xl md:text-[28px] font-semibold mt-3 leading-tight tracking-tightest">
                {c.title}
              </h3>
              <p className="mt-3 text-[15px] text-sodium/70 leading-snug">{c.body}</p>
              <ul className="mt-5 space-y-1.5 text-[14px] text-sodium font-mono">
                {c.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden className="text-ember">▮</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 — Manifest section (bias + reproducibility)                     */
/* ------------------------------------------------------------------ */

function Manifest() {
  return (
    <section
      id="manifest"
      className="py-20 md:py-28 bg-slag text-sodium border-b border-sodium/15 relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-foundry-dark pointer-events-none" aria-hidden></div>
      <div className="container max-w-prose relative">
        <header className="grid md:grid-cols-12 gap-6 items-end mb-14">
          <div className="md:col-span-7">
            <span className="font-mono text-[12px] tracking-stencil uppercase text-flux">
              04 · The manifest
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 leading-tight tracking-tightest">
              Every dataset arrives with its receipt.
            </h2>
          </div>
          <p className="md:col-span-5 text-sodium/75 text-[15.5px] leading-snug">
            Synthetic data without a manifest is gossip. SynthTable ships every run with a
            signed reproducibility receipt — schema, seed, model versions, bias profile,
            constraints, and a row-level provenance hash chain.
          </p>
        </header>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Manifest sample */}
          <pre
            className="md:col-span-7 font-mono text-[12.5px] leading-[1.6] text-sodium border border-sodium/15 bg-billet p-6 overflow-x-auto"
            aria-label="Reproducibility manifest example"
          >
{`# manifest.toml — signed by foundry/7
[run]
id              = "run_2026-05-08_0c9e"
schema_hash     = "sha256:e1d3…f4a2"
seed            = "0x4f5c"
records_emitted = 50_000
started_at      = "2026-05-08T11:02:14Z"
finished_at     = "2026-05-08T11:38:46Z"
duration_s      = 2192

[models]
text          = "foundry-text-3.1@4f9c"
policy        = "foundry-policy-1@1.0.4"
labeler       = "claude-3.5-sonnet (read-only adjudication)"
human_loop    = "panel_emea_v3 (3 reviewers)"

[bias_profile]
hash    = "sha256:bb04…7c91"
input   = "./bias_profile.yml"
checked = ["age", "gender", "locale", "register"]

[constraints]
declared = 8
passed   = 8
failed   = 0
report   = "./constraints.html"

[provenance]
lineage      = "merkle"
chain_root   = "0x8c4f9aa1…"
row_proofs   = "row_proofs.parquet"
signature    = "ed25519:foundry-7-prod"

[license]
output_terms = "client_owned, non-exclusive transfer"`}
          </pre>

          {/* Notable rails */}
          <div className="md:col-span-5 space-y-5">
            <div className="border border-sodium/15 p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-stencil uppercase text-flux">
                  REPRODUCIBLE
                </span>
                <span className="font-mono text-[11px] text-sodium/60">SEED + LINEAGE</span>
              </div>
              <p className="mt-2 text-[14.5px] text-sodium/80 leading-snug">
                Re-run a dataset bit-for-bit from the manifest. Auditors love it. Your
                MLOps team loves it more.
              </p>
            </div>
            <div className="border border-sodium/15 p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-stencil uppercase text-flux">
                  BIAS-AUDITED
                </span>
                <span className="font-mono text-[11px] text-sodium/60">DECLARATIVE PROFILE</span>
              </div>
              <p className="mt-2 text-[14.5px] text-sodium/80 leading-snug">
                You declare the distribution. We measure deviation. The manifest reports
                drift in σ — not vibes.
              </p>
            </div>
            <div className="border border-sodium/15 p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-stencil uppercase text-flux">
                  ROW-LEVEL PROVENANCE
                </span>
                <span className="font-mono text-[11px] text-sodium/60">MERKLE CHAIN</span>
              </div>
              <p className="mt-2 text-[14.5px] text-sodium/80 leading-snug">
                Every record carries a proof linking back to the seed. Drop a row, prove a
                row, kill a row — without re-running the dataset.
              </p>
            </div>
            <div className="border border-ember/60 bg-ember/5 p-5">
              <div className="font-mono text-[11px] tracking-stencil uppercase text-ember">
                CLIENT-OWNED OUTPUT
              </div>
              <p className="mt-2 text-[14.5px] text-sodium/85 leading-snug">
                Datasets are yours. We don&apos;t train downstream foundation models on
                your domain. Read it in section 09 of the FAQ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 05 — API Quickstart                                                 */
/* ------------------------------------------------------------------ */

function ApiQuickstart() {
  return (
    <section
      id="api"
      className="py-20 md:py-28 border-b border-sodium/10"
    >
      <div className="container max-w-prose">
        <header className="grid md:grid-cols-12 gap-6 items-end mb-12">
          <div className="md:col-span-7">
            <span className="eyebrow">05 · API quickstart</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 leading-tight tracking-tightest">
              POST a schema. GET a dataset.
            </h2>
          </div>
          <p className="md:col-span-5 text-sodium/70 text-[15.5px] leading-snug">
            REST API + Python and Node clients. Idempotent runs, streaming progress,
            signed download URLs that expire. Sandbox key ships free with every account.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-5">
          <CodeBlock
            label="curl · create a run"
            language="shell"
            code={`curl https://api.synthtable.com/v1/runs \\
  -H "Authorization: Bearer $SYNTHTABLE_API_KEY" \\
  -H "Content-Type: application/yaml" \\
  --data-binary @schema.foundry.yml

# → 202 Accepted
# {
#   "run_id":  "run_2026-05-08_0c9e",
#   "status":  "compiling",
#   "stream":  "wss://api.../v1/runs/run_…/stream",
#   "manifest":"https://.../runs/run_…/manifest.toml"
# }`}
          />
          <CodeBlock
            label="python · poll & download"
            language="python"
            code={`from synthtable import SynthTable

f = SynthTable(api_key=os.environ["SYNTHTABLE_API_KEY"])
run = f.runs.create_from_file("schema.foundry.yml")

for event in run.stream():
    print(event.phase, event.records, event.bias_drift)

dataset = run.wait_for_completion()
dataset.download("./out/", format="parquet")
print(dataset.manifest.chain_root)`}
          />
          <CodeBlock
            label="node · ergonomic SDK"
            language="ts"
            code={`import { SynthTable } from "@synthtable/sdk";

const f = new SynthTable({ apiKey: process.env.SYNTHTABLE_API_KEY });
const run = await f.runs.create({ schemaPath: "./schema.foundry.yml" });

for await (const ev of run.stream()) {
  console.log(ev.phase, ev.records, ev.constraints.passed);
}

const ds = await run.complete();
await ds.download({ to: "./out", format: "jsonl" });`}
          />
          <CodeBlock
            label="webhook · run completed"
            language="json"
            code={`POST https://you.example.com/foundry7

{
  "event": "run.completed",
  "run_id": "run_2026-05-08_0c9e",
  "records": 50000,
  "constraints": { "passed": 8, "failed": 0 },
  "bias_drift_sigma": 0.014,
  "manifest_url": "https://.../manifest.toml",
  "download_urls": {
    "jsonl":   "https://.../signed?...",
    "parquet": "https://.../signed?..."
  },
  "signature": "ed25519:6a4c…"
}`}
          />
        </div>
      </div>
    </section>
  );
}

function CodeBlock({
  label,
  language,
  code
}: {
  label: string;
  language: string;
  code: string;
}) {
  return (
    <figure className="plate p-0">
      <figcaption className="flex items-center justify-between px-5 py-3 border-b border-sodium/10">
        <span className="font-mono text-[11px] tracking-stencil uppercase text-sodium/65">
          {label}
        </span>
        <span className="font-mono text-[11px] tracking-stencil uppercase text-flux">
          {language}
        </span>
      </figcaption>
      <pre className="font-mono text-[12.5px] leading-[1.6] text-sodium px-5 py-5 overflow-x-auto">
        {code}
      </pre>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 06 — Run phases                                                     */
/* ------------------------------------------------------------------ */

function RunPhases() {
  const phases = [
    {
      tag: "T+0",
      title: "Compile",
      body:
        "Parse schema, lint bias profile, resolve $refs and FK joins. Reject contradictory constraints before a single token is generated."
    },
    {
      tag: "T+8m",
      title: "Forge",
      body:
        "Run the generator at the volume you asked for, with seed and model versions pinned. Stream progress over WS or SSE, including running bias drift."
    },
    {
      tag: "T+34m",
      title: "Adjudicate",
      body:
        "Sample 0.5–2% of records into a labeler-of-judgement loop. Re-run the failed rows. Optionally route into a human panel for the high-stakes verticals."
    },
    {
      tag: "T+38m",
      title: "Stamp",
      body:
        "Assemble the manifest, sign the lineage, mint signed download URLs, and emit `run.completed` to your webhook."
    }
  ];
  return (
    <section className="py-20 md:py-28 border-b border-sodium/10 bg-slag">
      <div className="container max-w-prose">
        <header className="mb-10">
          <span className="eyebrow">06 · Inside a run</span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 leading-tight tracking-tightest max-w-[24ch]">
            From schema to signed dataset in four phases.
          </h2>
        </header>
        <ol className="grid md:grid-cols-4 gap-0 border border-sodium/15 bg-billet">
          {phases.map((p, i) => (
            <li
              key={p.tag}
              className={
                "p-6 flex flex-col" +
                (i < phases.length - 1 ? " md:border-r border-sodium/12" : "") +
                (i > 0 ? " border-t md:border-t-0 border-sodium/12" : "")
              }
            >
              <span className="font-mono text-[11px] tracking-stencil uppercase text-ember">
                {p.tag}
              </span>
              <h3 className="font-display text-xl font-semibold mt-2 leading-tight tracking-tightest">
                {p.title}
              </h3>
              <p className="mt-2 text-[14.5px] text-sodium/70 leading-snug">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 08 — Provenance ledger                                             */
/* ------------------------------------------------------------------ */

function Provenance() {
  return (
    <section className="py-20 md:py-28 border-b border-sodium/10">
      <div className="container max-w-prose grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-5">
          <span className="eyebrow">08 · Provenance ledger</span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 leading-tight tracking-tightest">
            Every row, every reason.
          </h2>
          <p className="mt-5 text-[16px] text-sodium/70 leading-snug">
            SynthTable keeps a per-row Merkle proof linking each record to its seed,
            schema version, and adjudication. When a customer or regulator says
            &quot;why was this record in your training data?&quot; you have an answer
            with a hash on it.
          </p>
        </div>
        <div className="md:col-span-7">
          <div className="border border-sodium/15 overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-2.5 text-[11px] font-mono tracking-stencil uppercase text-ash bg-slag border-b border-sodium/12">
              <span className="col-span-2">ROW</span>
              <span className="col-span-3">RUN</span>
              <span className="col-span-3">CHAIN ROOT</span>
              <span className="col-span-3">CONSTRAINT</span>
              <span className="col-span-1 text-right">VERIFY</span>
            </div>
            {[
              ["14,492", "run_2026-05-08_0c9e", "0x8c4f…aa1", "✓ all 8", "VIEW"],
              ["14,493", "run_2026-05-08_0c9e", "0x8c4f…aa1", "✓ all 8", "VIEW"],
              ["14,494", "run_2026-05-08_0c9e", "0x8c4f…aa1", "✓ all 8", "VIEW"],
              ["14,495", "run_2026-05-08_0c9e", "0x8c4f…aa1", "↺ re-rolled (sentiment)", "VIEW"],
              ["14,496", "run_2026-05-08_0c9e", "0x8c4f…aa1", "✓ all 8", "VIEW"],
              ["14,497", "run_2026-05-08_0c9e", "0x8c4f…aa1", "✓ all 8", "VIEW"]
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-12 items-center px-4 py-2.5 text-[13.5px] font-mono border-b border-sodium/10 last:border-b-0 hover:bg-billet/50"
              >
                <span className="col-span-2 tabular text-sodium">{row[0]}</span>
                <span className="col-span-3 text-sodium/70">{row[1]}</span>
                <span className="col-span-3 text-sodium/70">{row[2]}</span>
                <span
                  className={
                    "col-span-3 " +
                    (row[3].startsWith("↺") ? "text-flux" : "text-weld")
                  }
                >
                  {row[3]}
                </span>
                <span className="col-span-1 text-right text-ember underline decoration-ember/40 underline-offset-2 cursor-pointer">
                  {row[4]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 09 — FAQ                                                            */
/* ------------------------------------------------------------------ */

function Faq() {
  const items = [
    {
      q: "Are the datasets actually useful for training?",
      a:
        "Yes — within the bounds you declare. SynthTable is best for cold-start, eval, edge-case augmentation, and privacy-safe clones. We are honest about limits: synthetic data is not a substitute for representative real-world data when subtle distribution shifts matter. The manifest tells you exactly where the dataset can be trusted."
    },
    {
      q: "What model do you generate from?",
      a:
        "A pinned ensemble: a domain-specialized text generator (foundry-text-3.1), a constraint-aware policy network (foundry-policy-1), and an adjudication labeler. The exact versions are recorded in every run's manifest. Vertical packs swap in domain specialists for medical, legal, fintech, and robotics."
    },
    {
      q: "Do you train on my schema or my data?",
      a:
        "No. Schemas you submit, samples you upload, and any production clones we generate are scoped to your account. We do not fold customer schemas back into the foundation models. Output is client-owned with a non-exclusive transfer; the license terms ship in the manifest."
    },
    {
      q: "How do you handle PII when I upload a real schema or sample?",
      a:
        "PII is scrubbed at the door. We run a tagger over your input, strip what's tagged, and only forward statistical summaries to the generator. The signed attestation in the run's manifest documents what was scrubbed and when. Enterprise plans add SOC-friendly retention windows."
    },
    {
      q: "Can I bring my own evaluator?",
      a:
        "Yes. Drop a Python or JS scorer into the run and we'll execute it inside the foundry sandbox. The manifest reports your scorer's results next to ours so audits hold up."
    },
    {
      q: "How fast?",
      a:
        "Bench tier: 48 hours for the first run. Production tier: typical 50k-row run lands in 30–45 minutes; 250k in 2–3 hours. Enterprise has SLA-backed turnarounds for critical-path runs."
    },
    {
      q: "Crypto-only payment? What about wires and cards?",
      a:
        "The hosted invoice is run by NOWPayments, which accepts USDT/USDC and a fiat-partner card on-ramp. Need EUR/GBP/USD wire or a Stripe-style card path? Email foundry@synthetic-data-factory.prin7r.com and we'll cut a custom invoice."
    },
    {
      q: "Refunds and abandoned runs?",
      a:
        "If a run fails to compile (constraint contradiction, schema invalid, etc.) we credit the full amount back to your foundry balance. If a run completes but you reject the manifest within 7 days, we re-run on us. Full terms in §07 of /docs/07-sales-strategy.md."
    },
    {
      q: "How is this different from Tonic / Mostly / Gretel / etc.?",
      a:
        "SynthTable is opinionated about three things: (1) reproducibility manifests as a first-class artifact, (2) row-level provenance instead of dataset-level provenance, and (3) vertical specialists rather than one model for everything. We are smaller, narrower, and more auditable. Read /docs/04-pain-points.md for the head-to-head."
    }
  ];
  return (
    <section id="faq" className="py-20 md:py-28 border-b border-sodium/10 bg-slag">
      <div className="container max-w-prose">
        <header className="mb-10">
          <span className="eyebrow">09 · Frequently asked</span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 leading-tight tracking-tightest">
            Honest answers, no hand-waving.
          </h2>
        </header>
        <div className="border border-sodium/15 bg-billet">
          {items.map((it, i) => (
            <details
              key={it.q}
              className={
                "group px-6 py-5 border-sodium/10" +
                (i < items.length - 1 ? " border-b" : "")
              }
            >
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                <span className="font-display text-[19px] font-semibold leading-snug tracking-tightest">
                  {it.q}
                </span>
                <span
                  className="font-mono text-ember text-2xl leading-none transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[15.5px] leading-relaxed text-sodium/70 max-w-[68ch]">
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 10 — Footer                                                         */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-slag text-sodium pt-16 pb-10 border-t border-sodium/10">
      <div className="container max-w-prose grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-semibold tracking-tightest">
              SynthTable
            </span>
            <span className="chip border-sodium/20 text-sodium/70">
              <span className="dot-live" aria-hidden></span>
              SYNTHTABLE ONLINE
            </span>
          </div>
          <p className="mt-5 text-[15px] leading-snug text-sodium/70 max-w-[40ch]">
            On-demand synthetic data with provenance. A Prin7r company.
            Designed in Bangkok. Forged on bare metal.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonAnchor href="#pricing" size="default" variant="ember">
              Start a run →
            </ButtonAnchor>
            <ButtonAnchor href="#api" size="default" variant="outline-light">
              Read the API
            </ButtonAnchor>
          </div>
        </div>

        <nav className="md:col-span-2 text-[14px]" aria-label="Product">
          <h4 className="font-mono text-[11px] tracking-stencil uppercase text-flux mb-3">
            Product
          </h4>
          <ul className="space-y-2 text-sodium/75">
            <li><a href="#use-cases" className="hover:text-ember">Use cases</a></li>
            <li><a href="#manifest" className="hover:text-ember">Manifest</a></li>
            <li><a href="#api" className="hover:text-ember">API</a></li>
            <li><a href="#pricing" className="hover:text-ember">Pricing</a></li>
            <li><a href="#faq" className="hover:text-ember">FAQ</a></li>
          </ul>
        </nav>
        <nav className="md:col-span-2 text-[14px]" aria-label="Resources">
          <h4 className="font-mono text-[11px] tracking-stencil uppercase text-flux mb-3">
            Resources
          </h4>
          <ul className="space-y-2 text-sodium/75">
            <li>
              <a
                href="https://github.com/prin7r-projects/synthetic-data-factory/blob/main/docs/01-brand-identity.md"
                className="hover:text-ember"
              >
                Brand identity
              </a>
            </li>
            <li>
              <a
                href="https://github.com/prin7r-projects/synthetic-data-factory/blob/main/docs/02-architecture.md"
                className="hover:text-ember"
              >
                Architecture
              </a>
            </li>
            <li>
              <a
                href="https://github.com/prin7r-projects/synthetic-data-factory/blob/main/docs/04-pain-points.md"
                className="hover:text-ember"
              >
                Why SynthTable
              </a>
            </li>
            <li>
              <a
                href="https://github.com/prin7r-projects/synthetic-data-factory/blob/main/docs/10-pitch-deck.md"
                className="hover:text-ember"
              >
                Pitch deck
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3 text-[14px]">
          <h4 className="font-mono text-[11px] tracking-stencil uppercase text-flux mb-3">
            Talk to us
          </h4>
          <ul className="space-y-2 text-sodium/75">
            <li>
              <a
                href="mailto:foundry@synthetic-data-factory.prin7r.com"
                className="hover:text-ember"
              >
                foundry@synthetic-data-factory.prin7r.com
              </a>
            </li>
            <li>
              <a
                href="https://github.com/prin7r-projects/synthetic-data-factory"
                className="hover:text-ember"
              >
                github.com/prin7r-projects/synthetic-data-factory
              </a>
            </li>
            <li className="text-sodium/45">
              Mon–Fri · 09:00–18:00 GMT+7
            </li>
          </ul>
        </div>
      </div>

      <div className="container max-w-prose mt-14 pt-6 border-t border-sodium/15 flex flex-wrap items-center justify-between gap-4 text-[12px] font-mono tracking-stencil uppercase text-sodium/55">
        <span>© 2026 Prin7r — SynthTable. MIT-licensed source.</span>
        <span>BUILD · 2026·05·08 · v1.0</span>
      </div>
    </footer>
  );
}
