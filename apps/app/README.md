# Foundry/7 — App (Wave-3 scaffold)

The Wave 2 deliverable for `synthetic-data-factory` is the marketing
landing under `apps/landing/` plus the NOWPayments hosted-invoice path.

This `apps/app/` directory is intentionally a placeholder. In Wave 3 it will
be filled with the customer dashboard:

- **Schema editor** (Monaco-backed YAML/JSON with live constraint linting)
- **Run console** (real-time WS of compile → forge → adjudicate → stamp)
- **Manifest viewer** (signed lineage browser, row-level proof inspector)
- **Bias drift dashboard** (σ vs declared profile, per slice)
- **API key + webhooks management** (rotate keys, replay webhooks)
- **Billing** (NOWPayments crypto invoices + Plisio backup, hooked to the
  forward-compat env vars in `/.env.example`)

The recommended stack — chosen to align with the wider Prin7r monorepo — is
Wasp's `wasp-lang/open-saas` template forked into this directory, then
re-themed to the Foundry/7 token set declared in `apps/landing/tailwind.config.ts`.

For Wave 2, the IPN webhook at `apps/landing/app/api/webhooks/nowpayments/`
already verifies HMAC-SHA512 signatures and logs `verified=true` events to
journalctl on the deploy host. When this dashboard ships, that handler will
become a database write into the `runs` and `payments` tables instead of a
log line.
