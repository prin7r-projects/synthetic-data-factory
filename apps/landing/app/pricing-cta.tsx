"use client";

/**
 * [FOUNDRY7_PRICING_CTA] Client component that owns the three pricing tiers
 * and the NOWPayments hosted-invoice handoff. Mirrors the chatbot-agency
 * pattern: POST /api/checkout/nowpayments → redirect to invoice_url. Errors
 * are surfaced inline so an operator notices when env vars are missing.
 */

import * as React from "react";
import { Button } from "@/app/components/ui/button";

type PlanCopy = {
  id: "bench" | "production" | "enterprise";
  name: string;
  badge?: string;
  setupUsd: number;
  cadence: string;
  blurb: string;
  tagline: string;
  bullets: string[];
  cta: string;
  emphasis?: boolean;
};

const PLAN_COPY: PlanCopy[] = [
  {
    id: "bench",
    name: "Bench",
    setupUsd: 480,
    cadence: "single dataset run",
    blurb: "One run, one schema, one purpose. For benchmarks and cold-start training sets.",
    tagline: "PROOF · ONE RUN",
    bullets: [
      "Up to 50,000 labeled records",
      "Schema validator + bias-profile linter",
      "Reproducibility manifest (signed)",
      "Single export: JSONL, Parquet, CSV",
      "48-hour delivery, async review"
    ],
    cta: "Start a bench run"
  },
  {
    id: "production",
    name: "Production",
    badge: "Most teams pick this",
    setupUsd: 2400,
    cadence: "monthly credit",
    blurb: "Five runs per month, branched schemas, and a dedicated foundry engineer in your Slack.",
    tagline: "RECURRING · 5 RUNS/MONTH",
    bullets: [
      "5 runs/month, up to 250,000 records each",
      "Branching schemas + edge-case augmentation",
      "Contrast sets, counterfactuals, drift sims",
      "Private S3 / GCS / Azure export",
      "4 hours of foundry-engineer time / month",
      "PII-scrubbed clones of production data"
    ],
    cta: "Take Production",
    emphasis: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    setupUsd: 12000,
    cadence: "quarterly · 90 days",
    blurb: "Managed dataset program with vertical specialists and a regulator-ready audit trail.",
    tagline: "MANAGED · QUARTERLY",
    bullets: [
      "Unlimited schemas across the quarter",
      "Vertical specialists: medical, legal, fintech, robotics",
      "Human-in-the-loop adjudication",
      "SOC-friendly audit log + signed lineage",
      "SLA-backed turnaround (24h critical path)",
      "Named foundry team + on-call review"
    ],
    cta: "Open an enterprise quarter"
  }
];

type CheckoutState =
  | { kind: "idle" }
  | { kind: "loading"; plan: PlanCopy["id"] }
  | { kind: "error"; plan: PlanCopy["id"]; message: string };

export function PricingCta() {
  const [state, setState] = React.useState<CheckoutState>({ kind: "idle" });

  async function handleCheckout(plan: PlanCopy["id"]) {
    setState({ kind: "loading", plan });
    try {
      const response = await fetch("/api/checkout/nowpayments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const data: unknown = await response.json();
      if (!response.ok || typeof data !== "object" || data === null) {
        const message =
          (typeof data === "object" && data && "message" in data && typeof (data as { message: unknown }).message === "string"
            ? (data as { message: string }).message
            : null) ?? `Checkout failed (HTTP ${response.status}).`;
        setState({ kind: "error", plan, message });
        return;
      }
      const url =
        "invoice_url" in data && typeof (data as { invoice_url: unknown }).invoice_url === "string"
          ? (data as { invoice_url: string }).invoice_url
          : null;
      if (!url) {
        setState({ kind: "error", plan, message: "Provider did not return an invoice URL." });
        return;
      }
      window.location.assign(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error";
      setState({ kind: "error", plan, message });
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PLAN_COPY.map((plan) => {
        const isLoading = state.kind === "loading" && state.plan === plan.id;
        const errorMessage = state.kind === "error" && state.plan === plan.id ? state.message : null;
        return (
          <article
            key={plan.id}
            className={
              plan.emphasis
                ? "border-2 border-ember bg-slag p-7 flex flex-col"
                : "border border-sodium/15 bg-slag p-7 flex flex-col"
            }
          >
            <div className="flex items-center justify-between">
              <span className="eyebrow">{plan.tagline}</span>
              {plan.badge ? (
                <span className="font-mono text-[10px] tracking-stencil uppercase text-ember bg-ember/10 px-2 py-1">
                  {plan.badge}
                </span>
              ) : null}
            </div>
            <h3 className="font-display text-3xl font-semibold mt-3">{plan.name}</h3>
            <p className="text-sodium/70 text-[15px] mt-2 leading-snug">{plan.blurb}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold tabular">
                ${plan.setupUsd.toLocaleString()}
              </span>
              <span className="font-mono text-xs text-ash uppercase tracking-stencil">
                {plan.cadence}
              </span>
            </div>

            <ul className="mt-6 space-y-2 text-[14.5px] text-sodium/70 flex-1">
              {plan.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span aria-hidden className="text-ember mt-[2px]">/</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-2">
              <Button
                onClick={() => handleCheckout(plan.id)}
                disabled={state.kind === "loading"}
                variant={plan.emphasis ? "ember" : "default"}
                size="lg"
                aria-label={`Pay with crypto for ${plan.name}`}
              >
                {isLoading ? "Opening invoice…" : `${plan.cta} →`}
              </Button>
              <p className="font-mono text-[11px] tracking-stencil uppercase text-ash">
                Pay in USDT / USDC · NOWPayments hosted invoice
              </p>
              {errorMessage ? (
                <p role="alert" className="text-scarlet text-sm font-mono">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
