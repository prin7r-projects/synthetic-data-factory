# 03 — User journeys

Three primary journeys. Each is written as a sequential narrative + the page
or surface the user touches at each step.

## Journey A — "I need a benchmark by Friday" (Eval lead)

**Persona:** Mei, eval lead at a 100-person AI startup. CEO wants a defensible
medical-coding benchmark for the board meeting on Friday. It is Tuesday.

| Step | Where | What happens |
|------|-------|--------------|
| 1 | Twitter / X | Mei sees a Mintset thread on benchmark reproducibility (a manifest screenshot, not a logo) and clicks through. |
| 2 | `synthetic-data-factory.prin7r.com#hero` | Hero shows a real schema → real row. She reads the constraints block ("escalated == true => sentiment < -0.3"). She thinks: "they actually understand this." |
| 3 | `#manifest` | Sees the signed-manifest sample with `chain_root` and σ-drift. Slack-shares the screenshot. |
| 4 | `#api` | Reads curl + Python. Decides she can prototype tonight. |
| 5 | `#pricing` | Picks **Production** ($2,400). Clicks "Take Production →". |
| 6 | NOWPayments invoice | Pays in USDT (her startup keeps a treasury wallet). Returns to `?status=paid`. |
| 7 | Email | Mintset-engineer pings her in Slack within 4 hours; they paste a draft schema for medical-coding. |
| 8 | Wed AM | First 50k-row run lands. Manifest in hand. |
| 9 | Thursday | Mei iterates schema once (constraints tweaked). Second run lands in 38 min. |
| 10 | Friday | Board meeting: Mei shows the benchmark *plus* the manifest. CEO approves the eval pipeline as the new internal standard. |

## Journey B — "Cold start on a brand-new product" (ML engineer)

**Persona:** Ravi, IC ML engineer at a B2B fintech (Series-B). Building an
AML transaction-monitoring assistant. Has zero internal training data because
the product hasn't shipped yet.

| Step | Where | What happens |
|------|-------|--------------|
| 1 | Hacker News / `r/MachineLearning` | Sees a comment recommending Mintset over a competitor. Clicks. |
| 2 | `synthetic-data-factory.prin7r.com#use-cases` | "Cold-start" card resonates. Reads bullet 1 ("First-touch fine-tunes") and bullet 3 ("Cold-start RLHF prompts"). |
| 3 | `#api` | Reads Python SDK. Pastes the snippet into a Cursor scratchpad. |
| 4 | `#pricing` | Bench tier ($480) is right-sized for "see if this works". Clicks "Start a bench run →". |
| 5 | NOWPayments | Pays via card on-ramp. |
| 6 | Email | Receives a sandbox API key + a 3-step Python tutorial PDF. |
| 7 | Day 2 | Submits schema (40 fields, AML-flavored), kicks off run. 30k rows, 38 minutes. |
| 8 | Day 3 | Fine-tunes a Qwen-3-mini on the synthetic set. Hits a baseline. |
| 9 | Day 7 | Returns for a Production credit ($2,400) to scale to 250k rows + edge-case augmentation. |

## Journey C — "Privacy-safe clone for a regulated demo" (Applied scientist)

**Persona:** Dr. Elena, applied scientist at a hospital network in the EU.
Wants to demo a clinical-coding model to a vendor — but legal will not let
real patient data cross the table.

| Step | Where | What happens |
|------|-------|--------------|
| 1 | LinkedIn | Reads a Mintset post on HIPAA-style synthetic clones. |
| 2 | `synthetic-data-factory.prin7r.com#use-cases` | Card 04 ("Privacy-safe clones") is exactly her need. |
| 3 | `#manifest` | Spots the "client-owned output" panel. Reads the FAQ (Q3 "Do you train on my schema?") — answer is no. |
| 4 | `#pricing` | Selects **Enterprise quarter** ($12,000) — needs human-in-the-loop adjudication and a regulator-ready audit pack. |
| 5 | `mailto:foundry@…` | Emails for a wire/EUR invoice — she does not pay in crypto. |
| 6 | Mintset ops | Cuts a manual EUR invoice; Plisio fallback offered if she changes her mind. |
| 7 | Day 5 | Schema iteration: 4 calls with foundry team. Compliance officer signs off. |
| 8 | Day 12 | First clone lands (250k records). Manifest includes the SOC-friendly attestation pack. |
| 9 | Day 15 | Demo to vendor. Vendor signs a follow-on contract. Elena renews the quarter. |

## Cross-journey notes

- All three personas hit the **manifest** section before the **pricing** section.
  Journey A and B convert from the same landing page; Journey C prefers email + invoice.
- Crypto is not optional for A and B but is *blocking* for C — keep the
  `mailto:` escape route prominent in the pricing footnote.
- Channel mix: A discovers via Twitter/X, B via Hacker News, C via LinkedIn.
  All three roads need to lead to the same hero.
