# 07 — Sales strategy

## Motion

Hybrid. **Bench** is product-led growth (PLG): self-serve checkout via
NOWPayments hosted invoice. **Production** is PLG-with-assist: self-serve
checkout but a foundry engineer reaches out within 4 hours of payment to
help kick off the first run. **Enterprise** is sales-led: discovery call,
custom invoice, MSA review, security questionnaire, named foundry team.

## Pricing tiers

| Tier        | Price             | Cadence              | What's in it |
|-------------|-------------------|----------------------|--------------|
| **Bench**   | $480              | Single run           | One dataset run up to 50,000 records. Schema validator, bias-profile linter, reproducibility manifest, single export (JSONL/Parquet/CSV). 48-hour delivery. |
| **Production** | $2,400 setup + $1,900/mo | Monthly credit | 5 runs/month, up to 250,000 records each. Branching schemas, edge-case augmentation, contrast sets, signed manifests, private S3/GCS export. 4 hours of foundry-engineer time per month. |
| **Enterprise** | $12,000+ | Quarterly · 90-day window | Managed dataset program. Unlimited schemas. Vertical specialists (medical, legal, fintech, robotics). Human-in-the-loop adjudication. Regulator-ready audit trail. SLA-backed turnaround. |

Add-ons (not visible on landing, sold post-checkout):

- Vertical pack — medical / legal / fintech / robotics: +$3,000/quarter
- Private compute (single-tenant GPU pool): +$5,000/month
- Dedicated foundry engineer (named, full-time): $14,000/month
- Wire / EUR invoice: free, on request
- Plisio (alt crypto rail): free, on request

## Refund policy

- **Compile failure** (constraint contradiction, schema invalid, env error):
  full credit back to foundry balance, no questions asked.
- **Manifest rejection within 7 days** of run completion: re-run on us once.
  After the second re-run, balance applied to the next run.
- **Production tier** unused-credit rollover: 1 month max; expires at next
  invoice cycle.
- **Enterprise quarter** unused: 30-day grace, then forfeit. Used credits never expire.

## Objection handling

| Objection | Response |
|-----------|----------|
| "Synthetic data isn't real data." | Correct. We don't pretend it is. Mintset is best for cold-start, eval, edge-case augmentation, and privacy-safe clones. The manifest tells you exactly where the dataset can be trusted. |
| "How do I know your model isn't poisoned?" | Manifest includes the model commit hash, the seed, the Merkle root, and an ed25519 signature. You can verify offline with our public key. |
| "We need wire / EUR / GBP." | One email and we cut a manual invoice. Crypto isn't required; it's just the default. |
| "We can't share our schema with a third party." | We sign a mutual NDA before any run; schemas are scoped per-account; we never train downstream models on customer schemas. |
| "We need on-prem." | Wave 3+: a single-tenant GPU pool offering at $5k/month + run charges. Not Wave 2. |
| "How is this different from Tonic / Mostly / Gretel?" | Three things: manifest-as-product, row-level provenance, vertical packs. Read `/docs/04-pain-points.md`. |
| "Your Bench is more expensive than competitors' free trial." | Their free trial doesn't ship a manifest. Run a Bench tier; if the manifest doesn't earn its keep, we refund. |
| "Crypto-only? That's a red flag." | NOWPayments includes a fiat-partner card on-ramp. Or email us for a wire invoice. |
| "Can we self-host?" | Wave 4 — managed deployment of the open-source SDK + a closed-source forge image. Not Wave 2/3. |

## Discounting policy

- **Bench**: never discounted; $480 is already the loss-leader.
- **Production**: 10% off prepaid 6 months; 15% off prepaid 12 months.
- **Enterprise**: case-by-case — typically 20% off list for multi-year, with
  strong logo / case-study clauses.
- **Open-source contributors** (verified): one Bench credit per merged PR
  to `prin7r-projects/synthetic-data-factory`.

## Sales toolkit

- Pitch deck: `/docs/10-pitch-deck.md` (+ rendered HTML)
- Case-study templates: TBD in Wave 3
- Security pack: TBD in Wave 3 (SOC-2 Type 1 in-progress)
- Demo schemas: 5 pre-built (`support_tickets`, `medical_coding`,
  `legal_clauses`, `fintech_aml`, `robotics_traces`) — Wave 3
