# Lotline — App Blueprint

**Status:** Planning documents approved by Paul on 2026-10-04; implementation has not started and remains on hold.  
**Name:** Lotline (provisional)  
**Project type:** Kestra Track 02 reusable blueprint + compact operator demo UI  
**Primary use case:** Cold-chain excursion → evidence-linked lot review  
**Plan date:** 2026-10-04  
**Builder profile:** Advanced solo builder; under 5 hours/week; target $0–$20/month during prototype.  
**Commercial posture:** Open-source entry now; possible hosted offering later. No V1 pricing or hosted-service commitment.

> **Important:** Lotline V1 is a synthetic-data prototype and a reusable workflow blueprint. It is not validated for GxP use, does not claim 21 CFR Part 11 or EU GMP Annex 11 compliance, is not a QMS, does not make product-quality decisions, and does not release product. This plan is not legal or regulatory advice.

---

## 1. Product summary

Lotline accepts a temperature-excursion event through a documented file or webhook adapter, normalises it into a small canonical contract, evaluates it against an explicitly supplied product policy, identifies **candidate** lots through deterministic shipment/location/time links, assembles an evidence pack, optionally drafts a source-linked narrative, and pauses for a human decision. The workflow records that sample decision and its rationale in the Kestra execution; no downstream inventory status change is connected.

The initial deliverable is the Kestra blueprint. The compact `/demo` UI makes the workflow understandable: select a synthetic event, send it to Kestra (or clearly labelled local simulation), inspect readings/policy/lot candidates, review an AI-or-template draft and its sources, enter a human decision, then inspect the run record.

### Product promise

- **Plug in at the boundary:** JSON webhook and JSON/CSV file adapters map to the same documented event contract.
- **Keep scope deterministic:** policy thresholds and lot-candidate scoping are rules-based, traceable, and fail visibly when evidence is incomplete.
- **Use AI narrowly:** AI may draft narrative from already-computed evidence. It cannot determine the excursion, select lots, decide disposition, or trigger an inventory action.
- **Keep the human gate explicit:** the Kestra flow pauses for a structured decision and rationale. A public prototype only records a simulated choice.
- **Make the blueprint reusable:** a Kestra flow with clear inputs, outputs, prerequisites, secrets, warnings, and a synthetic fixture—not a generic marketing demo or a one-off app integration.

### The strongest differentiated direction (hypothesis to validate)

Lotline is not a logger, sensor network, or full eQMS. The wedge is an open, Kestra-native orchestration pattern that can sit between existing sensor/event sources and a quality review process: `event → policy evaluation → candidate lot scope → source-linked draft → human pause → recorded outcome`. The value hypothesis is reduced evidence assembly and more legible handoffs, not automated quality judgement. ELPRO already describes configurable release workflows, so Lotline must not claim that “workflow around cold-chain data” is unique; the specific source-agnostic, inspectable Kestra blueprint and narrow event-to-review path are the testable differentiation.

---

## 2. User, buyer, and jobs-to-be-done

| Segment | Primary user | Likely buyer/sponsor | Current job |
|---|---|---|---|
| Small/mid-size pharma or biotech with temperature-sensitive products | QA/quality systems specialist, warehouse or distribution operator | Head of Quality, operations director | Assemble a temperature trace, applicable product policy, shipment/lot links, missing evidence, and a review record without rebuilding the whole QMS. |
| Clinical-trial supply and specialty 3PL teams | Cold-chain operations lead, quality coordinator | Supply-chain/quality lead | Route excursion evidence across shipping, receiving, and sponsor/QA handoffs; retain a clear record of what data was used. |
| Vaccine, biologics, and regional pharmaceutical distributors | QA pharmacist/qualified person, cold-room or logistics operator | Distribution/quality leadership or program owner | Isolate a suspected exposure, identify candidate stock, and send a review-ready evidence pack to the person authorised to decide. |

**Who pays if a hosted product is eventually justified:** likely the organisation, sponsored by Quality or Operations—not the individual operator. The open-source Kestra flow is the entry point; any future managed hosting/support must first prove that customers want a workflow layer alongside their existing logger and QMS products.

**Discovery assumption to test:** the pain is the handoff and evidence-assembly gap between a sensor/logging platform, lot/shipment records, and quality review—not lack of temperature monitoring. Confirm the gap with interviews and workflow walkthroughs before expanding product scope.

---

## 3. Market validation and competition

### 3.1 Problem evidence and market context

- WHO TRS 961 Annex 9 defines a temperature excursion as exposure outside the prescribed storage/transport range; the product manufacturer determines relevant ranges from stability data. The guidance describes quarantine pending a decision by the quality-control department or qualified person, while noting that local legislation takes precedence. Lotline uses this as workflow context, not a claim of compliance. [WHO TRS 961 Annex 9](https://www.who.int/docs/default-source/medicines/norms-and-standards/guidelines/distribution/trs961-annex9-modelguidanceforstoragetransport.pdf?sfvrsn=b80e925f_2)
- In the United States, 21 CFR 211.192 requires quality-control review/approval of production and control records before batch release, and investigation of unexplained discrepancies or specification failures, including related batches/products as applicable. Lotline does not satisfy this rule; it is a reference point for why a traceable review process matters. [eCFR §211.192](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-J/section-211.192)
- GS1 EPCIS 2.0 supports interoperable event information, including sensor data and status/location/movement context. A later adapter could map a Lotline event to EPCIS; V1 should not claim EPCIS conformance without tests. [GS1 EPCIS 2.0 overview](https://www.gs1.org/docs/epcis/epcis_2-0_launch.pdf)
- One secondary market report estimates global cold-chain tracking and monitoring at USD 8.52B in 2025, with pharmaceuticals/healthcare at about 22% of application share. Multiplying gives roughly USD 1.87B as a **broad category ceiling**, not Lotline’s addressable software market. Another publisher reports a different overall market figure, so estimates should be treated as directional, not audited market facts. [Fortune Business Insights market report](https://www.fortunebusinessinsights.com/cold-chain-tracking-and-monitoring-market-109688) · [The Business Research Company report](https://www.thebusinessresearchcompany.com/report/cold-chain-tracking-and-monitoring-global-market-report)

### 3.2 TAM, SAM, and SOM — intentionally conservative

| Measure | Working estimate | Reasoning and limits |
|---|---:|---|
| **TAM context** | **~USD 1.87B** | 22% × USD 8.52B 2025 global cold-chain tracking/monitoring estimate. This is only an adjacent-category ceiling. It includes hardware and monitoring spend that Lotline does not sell; it is not Lotline revenue potential. The source is secondary. |
| **SAM (Lotline-specific)** | **Not responsibly dollarised yet** | Public material does not reliably count organisations with the exact “existing monitor + lot records + manual QA evidence handoff” workflow, and the user explicitly rejected invented V1 pricing. Model after interviews as `qualified organisations × validated annual willingness-to-pay`. Until then, define the serviceable wedge as English-speaking pharma/biotech, clinical supply, and cold-chain distribution teams already using Kestra or willing to run a self-hosted workflow. |
| **Year-1 SOM (founder-capacity target)** | **10 design partners / 25 workflow interviews; 0 paid customers assumed** | This is a validation target, not a market-share forecast. V1 is open-source and has no priced hosted plan. A hosted SOM should only be set after the first 10 structured interviews and evidence of a repeated paid need. |

**Discovery plan:** speak with at least 10 QA/operations users across the three segments; ask them to map one recent (redacted or synthetic) excursion flow from sensor event to disposition record. Do not collect real operational data in the public prototype. Record time spent, handoffs, missing fields, and whether a Kestra workflow is acceptable alongside their existing QMS.

### 3.3 Competitive/alternative landscape

These are adjacent alternatives, not proof that Lotline has no direct competitor. Pricing and product packaging can change; verify vendor pages before making a sales comparison. Customer-review themes are self-reported and not representative. No high-confidence, attributable X/Twitter review signal was located for this desk scan, so none is used as evidence.

| Product / alternative | Category and public pricing evidence | User-review signal / weakness to validate | Lotline implication |
|---|---|---|---|
| **Tive** | Real-time shipment visibility and sensors. Tive announced a Tive Tag price starting at **USD 5/tag** in a July 2023 vendor release; this is hardware, not a platform or total deployment price. The platform price was not publicly confirmed in this scan; G2’s detailed pricing view is gated. [Tive release](https://www.tive.com/press-release/tive-tag-the-most-cost-effective-temperature-logger-in-the-world-now-available-for-5) · [G2 Tive reviews/pricing](https://www.g2.com/products/tive/reviews) | G2’s review summary praises ease-of-use and live visibility; users mention battery life, connection/update delays, reporting, and integration/customisation opportunities. These are review themes, not universal defects. | Excellent at sensing/tracking; Lotline should consume existing data rather than compete for logger spend. |
| **ELPRO / liberoMANAGER** | Pharma cold-chain logger and software ecosystem. ELPRO describes USB/Bluetooth/IoT logger support, customer-specific workflows and release processes, and usage-based/rental models for real-time loggers. Exact current SaaS rates were not publicly stated on the official page. [ELPRO product update](https://www.elpro.com/en/news/liberomanager-software-enhanced-with-real-time-functionalities) | No sufficiently broad independent review corpus was found for a dependable weakness claim. Do not invent one. ELPRO’s published configurable workflow/release features are a direct caution against claiming “nobody does disposition workflows.” | Treat as a serious adjacent competitor; validate whether customers need a cross-vendor Kestra integration and workflow layer beyond their monitor vendor’s ecosystem. |
| **Sensitech TempTale / ColdStream** | Temperature loggers and data management. Product material describes recorded readings, alarm profiles, PDF reports, and ColdStream/desktop options; current public platform pricing was not confirmed. [Sensitech pharma monitoring overview](https://www.sensitech.com/en/blog/blog-articles/blog-pharma-cold-chain-monitoring.html) · [TempTale Ultra Fit product brief](https://www.shareddocs.com/hvac/docs/2000/Public/04/temptale-ultra-fit.pdf) | A reliable independent review corpus/weakness signal was not found in this scan. Do not infer customer dissatisfaction from its product category. | Position as an input/data source, not as something Lotline replaces. First adapter should be format-agnostic rather than vendor-specific until a pilot selects a source. |
| **MasterControl Quality Excellence (Qx)** | Broad life-sciences eQMS/QMS; the vendor uses named-user licensing and packages from pre-configured options to custom enterprise scope; pricing is quote-based. [Official pricing](https://www.mastercontrol.com/pricing/) | G2 feedback praises breadth and documentation but also mentions complex initial setup/training; some G2 reviewers describe an outdated UI or an audit trail that takes several layers to reach. Reddit comments independently report configuration/inflexibility complaints, but those are anecdotes. [G2 reviews](https://www.g2.com/products/mastercontrol-quality-management-system/reviews) · [Reddit r/biotech QMS discussion](https://www.reddit.com/r/biotech/comments/1cai5zb/favorite_qms/) | Do not compete as a full QMS. Make a small, transparent workflow that can hand evidence toward a quality system later. |
| **Qualio** | Life-sciences eQMS. Named plans: Foundation (5 included edit users; unlimited basic users), Growth (10 included edit users; unlimited basic users), and Scale (custom pricing/implementation). All require a tailored annual quote; an implementation fee applies. [Official pricing](https://www.qualio.com/pricing) | G2 users praise the intuitive interface, while some mention limits in editor formatting/customisation, reporting flexibility, or integrations. These are review themes, not universal shortcomings. [G2 Qualio reviews](https://www.g2.com/products/qualio/reviews) | A polished UX is table stakes. Lotline’s hypothesis is a narrow workflow adapter, not replacement document control or CAPA. |

**Gap hypothesis:** no claim that no competing system can connect excursion readings to a review. The experiment is whether users value a small, open-source, source-agnostic Kestra blueprint that shows evidence and uncertainty explicitly and hands off a review packet without buying a new logger or replacing their QMS. Compare against spreadsheets/email and existing logger/QMS workflows in interviews.

### 3.4 Public pricing observation

- Many life-sciences QMS vendors use custom quotes and implementation fees; published dollar price may be unavailable. Do not cite old third-party price roundups as current vendor prices.
- Tive’s USD 5/tag figure is a dated hardware point, not a subscription comparator.
- There is **no Lotline hosted price** in V1. No Free/Pro/Enterprise dollar tier, paid trial, or pricing page should be invented before validation.

---

## 4. V1 scope and acceptance criteria

The Kestra blueprint is the Hacktober Track 02 deliverable. The marketing page is explanatory; it must not delay the core blueprint contribution. The demo is synthetic and compact. Four core product capabilities plus the UI are enough.

### Feature 1 — File/webhook ingestion and normalisation

**User story:** As a workflow owner, I want to receive a cold-chain event as a webhook or file and map it to one canonical event shape so that vendor/source differences are isolated at the adapter boundary.

**Acceptance criteria:**
- Webhook input is authenticated with a Kestra secret key; file input accepts a labelled JSON/CSV fixture through a documented Kestra input path.
- Both adapters produce the same canonical fields and retain source identity/timestamps.
- Invalid JSON/CSV, invalid units, absent timestamps, duplicate/out-of-order readings, and unknown schema versions fail or flag visibly with a cause and safe next step.
- No sample contains a real company, patient, product, logger, lot, or user identity.

**Complexity:** Medium.

### Feature 2 — Deterministic excursion evaluation and candidate-lot scope

**User story:** As a QA reviewer, I want the event evaluated against an explicit product policy and linked inventory snapshot so that candidate lots and missing data are visible before I review.

**Acceptance criteria:**
- Policy includes an ID/version, effective window, temperature unit, lower/upper bounds, and source reference. The engine does not silently default production users to 2–8°C; that range is only the synthetic fixture.
- A reading is out of range only when it is below the configured lower bound or above the upper bound; boundary equality stays within range. Store source readings and normalised units.
- Exposure windows are computed from observed timestamps. Do not interpolate over missing/gapped readings unless a future validated policy explicitly defines it.
- Candidate lots are matched through explicit shipment/container/location/time links and each candidate has a reason code/source reference. The result is a candidate scope, not a definitive “affected lot” or disposition.
- Missing lot map, policy, calibration reference, or sampling coverage produces `REVIEW_REQUIRED`/`SCOPE_INCOMPLETE`; never return “safe to release” from missing data.

**Complexity:** Medium–High.

### Feature 3 — Evidence pack and optional AI narrative draft

**User story:** As a reviewer, I want a concise draft with links to the event, policy, and lot evidence so that I can review facts and unknowns without treating model text as a decision.

**Acceptance criteria:**
- Deterministic evidence pack is generated regardless of AI configuration.
- Default mode is `template`; the template is visibly labelled as deterministic and not misrepresented as model-generated.
- Optional external model mode is disabled by default and permitted only for the synthetic fixture in the public demo. No real operational data is sent externally.
- Model output is structured as draft text, evidence IDs, assumptions, and unknowns. Reject any citation not in the supplied allowlist. If the model fails/returns unsupported claims, use the template and keep the event review available.
- AI never calculates thresholds, event duration, lot scope, disposition, or downstream actions.

**Complexity:** Medium.

### Feature 4 — Human review pause and recorded outcome

**User story:** As an authorised quality person, I want the workflow to pause for a structured disposition and rationale so that the eventual decision is explicit and attributable rather than inferred from an alert.

**Acceptance criteria:**
- The Kestra flow pauses after preparing the evidence pack. Structured resume inputs collect a disposition choice and rationale.
- The execution records the reviewer identity/time available from Kestra and the submitted values; V1 connects no inventory release, destruction, or QMS action.
- The standalone demo labels all reviewer identities/decisions as simulated. `Record simulated release` has a persistent “no inventory system changes” notice.
- The run cannot progress to a disposition-record step without a human resume input; no timeout resumes to a release state.

**Complexity:** Medium.

### Feature 5 — Compact operator demo and public explainer

**User story:** As a first-time user, I want to run one synthetic event and inspect every stage so that I can understand and evaluate the blueprint without importing operational data.

**Acceptance criteria:**
- `/demo` selects the single labelled fixture, sends it to Kestra when configured, and clearly switches to UI-only simulation when not configured.
- The operator can inspect readings/policy, candidate lots, source-linked draft, human review, and final run record.
- Kestra tokens/webhook secrets/model keys stay server-side. No real-data upload, account system, database, analytics, or payment flow in V1.
- `/` follows `FRONTEND_SPEC.md`; unapproved hero video remains a plain placeholder and is not integrated.

**Complexity:** Medium–High; implement after the blueprint path is demonstrated.

### Explicitly out of scope for V1

- Any production pharma deployment, validation, compliance claim, or regulated record retention.
- Auto-quarantine, release, reject, recall, disposal, or any other inventory/QMS action.
- Real operational data, patient data, sensitive staff data, real credentials, or customer-identifiable lots in the public demo.
- Multi-tenant hosting, billing, SSO, role provisioning, enterprise audit controls, database persistence, or customer-managed key management.
- Broad connector catalogue, proprietary sensor-specific integration, predictive stability models, or automatic product quality prediction.
- A second AI provider implementation until the first provider/fallback boundary is tested.

**The reason to pay later, if validated:** managed hosting, connector operations, support, and organisation-level governance—not access to an AI release decision. No paid feature is committed or priced now.

---

## 5. Kestra blueprint design

### 5.1 Flow contract

- **Blueprint ID (proposed):** `cold-chain-excursion-lot-review` (must match the eventual YAML filename and target repository conventions).
- **Namespace:** author/team namespace defined for the contribution; do not assume a production namespace.
- **User-facing purpose:** “Normalise a cold-chain event, identify out-of-range readings and candidate lots from explicit records, assemble a source-linked review packet, then pause for human disposition input.”
- **Trigger:** Kestra webhook trigger with a secret key (required Track 02 trigger) and a documented manual/file input path for offline test fixtures.
- **At least 3 runnable tasks:** webhook/file ingestion; schema validation and normalisation; deterministic policy evaluation; candidate-lot matching; optional AI draft branch; human pause; final output. Include at least one Kestra control-flow task and at least one non-core plugin. Candidate implementation uses the official Python Script task for deterministic processing and an optional OpenAI ChatCompletion plugin for synthetic-only AI, with a template fallback. Confirm plugin/version requirements against current Kestra docs before authoring YAML.
- **Human gate:** Kestra `Pause` task with structured resume inputs. No default release branch, API call, inventory write, or automatic timeout release.

### 5.2 Adapter boundaries

| Adapter | Input boundary | Normalised output |
|---|---|---|
| Webhook | Authenticated JSON body. Reject unsupported content type and malformed payload. Keep webhook key in Kestra Secrets; never embed a production key in example YAML. | `ColdChainEvent` plus source metadata, preserving event/sensor IDs and original reading timestamps. |
| File | A JSON or CSV file supplied through Kestra’s documented file/flow-input mechanism. The parser is explicit about delimiter, required headers, unit, and timezone. | Same `ColdChainEvent`; file name/digest/source metadata retained where safe. |

A new adapter must map to the same schema and tests. V1 is not an implicit universal integration; the two supported sample boundaries are deliberately small.

### 5.3 Canonical data contract (planning schema)

| Object / field | Type | Required | Meaning / validation |
|---|---|---:|---|
| `schemaVersion` | string | Yes | Version of the Lotline event contract. Reject unsupported versions with an actionable error. |
| `eventId` | string | Yes | Source/stable event identifier or a generated synthetic ID. |
| `sourceAdapter` | enum: `webhook`, `file` | Yes | Ingress source, preserved in the output. |
| `receivedAt` | UTC timestamp | Yes | Time the workflow received the payload; distinct from sensor observation time. |
| `sensorId` | string | Yes | Source sensor identifier; synthetic in demo. |
| `shipmentId` / `containerId` | string | At least one | Join key to transport/inventory records. Do not guess if missing. |
| `locationId` | string | Recommended | Facility/location context, with a source reference. |
| `readings[]` | array of records | Yes | Each record has `observedAt` UTC, numeric `value`, unit, and source reading ID/sequence. Preserve original values. |
| `productPolicy` | record/reference | Yes | Policy ID/version, effective period, lower/upper bound, unit, source and optional product-family key. No implicit production default. |
| `inventorySnapshot[]` | array of records | For scoping | Synthetic or approved lot records with lot ID, shipment/container key, location, relevant time range, and source reference. |
| `calibrationReference` | record/reference | Optional input; required for “complete evidence” status | Source/date/status if supplied. Absence is visible, not silently treated as valid. |
| `provenance[]` | array of references | Yes | IDs for each reading, policy, shipment/inventory record, and file/API source used in the result. |

### 5.4 Workflow sequence and outputs

1. **Receive:** webhook trigger or manual file input. Check the secret/content type where applicable.
2. **Validate/normalise:** schema version, timestamp, unit, required event fields, duplicate/order/data-gap flags. Keep source IDs.
3. **Evaluate:** compare each reading with the supplied lower/upper bound and create explicit excursion windows. Missing or irregular data remains a visible limitation.
4. **Scope candidates:** deterministic match against shipment/container, location, and time records. Emit candidate lots and per-lot match reasons. Do not call them definitively affected without sufficient evidence.
5. **Assemble evidence:** event trace, policy version, source references, coverage/missing-data list, candidate lot set, and rule version.
6. **Draft:** template mode by default; optional external AI on whitelisted synthetic fixture only. Validate cited IDs and output shape. AI failure falls back to template.
7. **Pause:** collect structured human disposition and rationale in Kestra’s native pause/resume flow. Unknown/incomplete evidence remains review-required.
8. **Record:** append the chosen sample disposition, rationale, reviewer/time available from Kestra, and execution ID to the final execution output. No external side effect.

**Outputs:** validation state; normalised event; excursion intervals; policy/source IDs; candidate lot list with reason codes; evidence completeness/unknowns; draft and allowed citation IDs; human decision and rationale if resumed; Kestra execution ID/state. Document each output path in the eventual YAML `extend` description and test examples.

### 5.5 Kestra contribution acceptance checklist

Before coding, search for an overlapping blueprint and select a real `[Blueprint] … – PR checklist` issue. Recheck the current issue’s readiness status: if it has a maintainer’s “not ready” notice, wait until cleared and moved to Backlog. Then confirm the issue scope and acceptance criteria with Paul.

The current Kestra Blueprints README states that a contribution should have at least three runnable tasks, at least one flow/control task, at least one trigger, and at least one non-core plugin. It requires complete `extend` metadata and documents prerequisites, secrets, inputs, outputs, and links. The exact plugin versions, tags, YAML format, and current issue requirements must be verified at implementation time. [Official Blueprints README](https://github.com/kestra-io/blueprints/blob/main/README.md)

---

## 6. AI and safety architecture

### Modes

| Mode | Default | External processing | V1 behavior |
|---|---:|---|---|
| `template` | **Yes** | None | Deterministic source-linked draft from verified workflow outputs. Works without an LLM key and is clearly labelled “Template fallback”. |
| `external_synthetic` | No | Explicitly enabled; synthetic fixture only | Optional Kestra OpenAI task using a Kestra secret. Never accepts public arbitrary event data. Usage must be spend-capped by the operator. |
| `self_hosted` | Future option | Local/private endpoint, if later validated | Documented extension point only; do not advertise as implemented until tested. |

### Hard safety rules

- A configured product range and deterministic code govern threshold detection. A model cannot change the range or calculate the event window.
- Candidate lot scope comes only from deterministic joins to supplied shipment/inventory data. The model cannot add, remove, rank, or label lots.
- Every material statement in an AI draft must cite a supplied evidence ID. Citation validator rejects unknown IDs; unsupported statements are removed or the template fallback is used.
- Output separates **known facts**, **assumptions**, and **unknown/missing evidence**.
- The output is never labelled a disposition or release recommendation. It may suggest a human review action such as “request quality/stability assessment” without asserting product safety.
- External model use is off by default. The public UI sends only the synthetic fixture and only when an operator explicitly enables it. No model key reaches the browser.
- No model output controls a status change, connector, or inventory operation.

---

## 7. Technology and architecture decision

| Layer | V1 choice | Why this choice / boundary |
|---|---|---|
| Workflow | Kestra OSS flow YAML | It is the Track 02 artifact and supplies triggers, task lineage, execution state, pause/resume, and reusable workflow metadata. |
| Deterministic task logic | Python Script plugin in the Kestra flow | Small readable validation/scope logic; task isolation; a supported Kestra task type. Keep the evaluator pure and test its boundary cases. |
| Optional AI | Kestra OpenAI ChatCompletion plugin in an explicit optional branch; template fallback otherwise | Keeps secrets server-side in Kestra. External processing is disabled unless explicitly configured; no API key is required to run the default blueprint. |
| Frontend | Next.js App Router, TypeScript, Tailwind CSS v4 | One project can hold public page and `/demo`; route handlers provide a server-side Kestra proxy so keys never reach browser code. Vite would be leaner for a pure static site but needs a separate API service for this workflow. |
| Motion | `motion/react` for hero scroll-scrub and small transitions; GSAP ScrollTrigger only for the separate pinned process section | Avoid multiple scroll systems per section; respects the approved motion design. `/demo` does not load public-page animation bundles. |
| Persistence | None in the UI; Kestra execution store for local demo runs; session-only state for UI-only simulation | No database/auth needed for a synthetic single-event demo; avoid storing operational data. |
| Auth | No app account in V1 | Demo is fixture-only. Kestra webhook/API credentials remain server-side; a future hosted product needs a fresh auth/tenant/security decision. |
| Hosting | Local Next.js + self-hosted Kestra for full workflow; optional Vercel Hobby static demo for personal/non-commercial preview | Keeps the prototype within the $0–$20/month budget. Public hosted Kestra is explicitly not promised. Vercel lists Hobby at $0 for a personal project and Pro at $20/month, with usage limits/credits; verify current terms before commercial use. [Vercel pricing](https://vercel.com/pricing) |
| Database | None in V1 | Future hosted schemas are conceptual only; do not store real events until data governance, tenancy, retention, and validation are selected. |
| Analytics/error tracking | None by default | No third-party payload collection in a safety-sensitive demo. Later, aggregate only non-event UI diagnostics, scrub all payloads, and obtain privacy approval. |
| Payments | None | Open-source blueprint and demo only; no hosted product or V1 pricing. |

### Cost envelope

The rows below are **planning floors for the demo**, not a production hosting quote. Monthly active users alone do not determine Kestra compute cost; event volume, execution duration, retention, and concurrency do.

| Demo audience scale | Prototype plan | Estimated Lotline service spend | Limitation |
|---:|---|---:|---|
| 0 | Local Next.js + local Kestra, synthetic fixtures, `template` AI | $0/month | Developer hardware/electricity excluded. |
| 100 demo sessions | Static/non-commercial public page on Vercel Hobby; full Kestra run is local or shown as UI-only simulation | $0/month while within current Hobby limits | Not an always-on shared Kestra service; no external AI. Vercel Hobby is for personal/non-commercial use. |
| 1,000 demo sessions | Same static/offline demo; monitor Vercel request/transfer limits | $0 floor; usage/limits must be rechecked | Does not include public Kestra compute, long-run storage, or support. |
| 10,000 demo sessions | Static content may need paid hosting; Vercel Pro currently lists $20/month plus variable usage | $20/month baseline before any additional usage | A public Kestra service is not included and can exceed the budget. Do not claim a $20 all-in hosted product at this scale. |

**AI API costs:** $0 in default template mode; usage-based and outside the budget when deliberately enabled. Set a hard provider spend limit and keep the external mode disabled on public deployments until configured. A local model’s compute/electricity is also outside this table.

---

## 8. Data model and retention

### V1 data storage

- No Postgres/Supabase/Firebase database, account table, customer event store, or persistent lot records.
- Demo fixture lives as clearly synthetic project data; Kestra execution outputs hold the local test run; UI-only simulation lives only in the current browser session.
- Do not log full payloads beyond the synthetic fixture. Do not add analytics or persistent operational-data upload.

### Future hosted model (planning only; not V1 implementation)

| Entity | Key fields | Relationships/indexes | Access and retention concept |
|---|---|---|---|
| `organisations` | `id`, `name`, `created_at`, `region` | Primary key `id`; no regulated-use claim. | Tenant root; region choice only after legal/data residency decision. |
| `memberships` | `id`, `organisation_id`, `user_id`, `role`, `created_at`, `disabled_at` | Unique `(organisation_id,user_id)`; index by organisation and user. | Organisation-scoped roles. A future QA approver role requires identity proofing and access review. |
| `source_connections` | `id`, `organisation_id`, `adapter_type`, `secret_reference`, `status`, `created_at` | Index `(organisation_id,status)`. Secret value stored in a secret manager, never in table/client. | Connection metadata only; no credential plaintext. |
| `policies` | `id`, `organisation_id`, `policy_key`, `version`, `unit`, `lower_bound`, `upper_bound`, `valid_from`, `valid_to`, `source_ref`, `status` | Unique `(organisation_id,policy_key,version)`; effective-date index. | Changes need controlled approval/versioning in a future validated system. |
| `events` | `id`, `organisation_id`, `source_event_id`, `source_adapter`, `received_at`, `shipment_id`, `container_id`, `sensor_id`, `policy_id`, `policy_version`, `coverage_state` | Index `(organisation_id,received_at)`, `(organisation_id,shipment_id)`. | Real event storage is blocked until purpose, jurisdiction, retention, and validation controls are approved. |
| `readings` | `id`, `event_id`, `observed_at`, `source_value`, `source_unit`, `normalised_value`, `reading_ref` | Index `(event_id,observed_at)`; FK to event. | Preserve source value and provenance; never overwrite. |
| `lot_candidates` | `id`, `event_id`, `lot_ref`, `shipment_ref`, `scope_status`, `reason_codes`, `evidence_refs` | Index `(event_id,scope_status)`; unique `(event_id,lot_ref)`. | Candidate scope only; no warehouse write in V1. |
| `drafts` | `id`, `event_id`, `mode`, `text`, `citations`, `assumptions`, `unknowns`, `provider_ref` | Index `(event_id,created_at)`. | External prompt/response retention policy must be agreed before hosted use. |
| `review_decisions` | `id`, `event_id`, `reviewer_id`, `decision`, `rationale`, `created_at`, `execution_id` | Index `(event_id,created_at)`. | Real decisions require validated identity, audit/retention controls, and change-control assessment; no V1 production use. |
| `audit_events` | `id`, `organisation_id`, `event_id`, `actor_id`, `action`, `before_ref`, `after_ref`, `occurred_at`, `source` | Append-only design; index `(organisation_id,occurred_at)` and `(event_id,occurred_at)`. | “Append-only” is a future design goal, not a current compliance claim. |

**Future access controls:** every hosted table row would include `organisation_id`; server-side authorization and database row-level security must enforce tenant membership. No user can read another organisation’s events. No migration or SQL is written before document approval and a separate hosted-product decision.

---

## 9. API architecture (planned; not implemented)

All routes are server-side Next.js route handlers. They accept only the demo fixture in V1, call Kestra with server-held credentials when configured, and return an allowlisted response. No browser call to Kestra `localhost`, no key in a public environment variable, no real event body in logs.

| Method / path | Access | Request | Response | Rate / safety |
|---|---|---|---|---|
| `GET /api/health` | Public | None | `{ status, kestraConnected, demoMode }` with no hostnames/secret details | 60/min/IP; no environment dump. |
| `POST /api/demo/run` | Public fixture-only | `{ fixtureId: "excursion-01", aiMode?: "template" }` | `{ runId, state, mode }` | 3/min/IP and 15/hour/IP; accept no arbitrary event body; `template` default. |
| `GET /api/demo/runs/{runId}` | Signed short-lived demo session | Opaque run ID | `{ state, stage, allowlistedOutputs }` | 30/min/run token; validate ownership/session signature; redact Kestra internals. |
| `POST /api/demo/runs/{runId}/decision` | Signed short-lived demo session | `{ decision: "hold"|"escalate"|"simulated_release", rationale }` | `{ state, decisionRecorded, runId }` | 3 attempts/run; required rationale; connected mode resumes only the matching paused synthetic execution; UI-only mode stays in session. |

**Error shape:** stable `code`, human-readable `message`, safe `nextAction`, and `requestId`; never include secret values or full stack traces in the browser. Map Kestra unavailable, invalid state, malformed fixture, and rate-limit errors distinctly. A future real-data API requires a separate auth/authorization, tenant isolation, privacy, audit, and validation design.

---

## 10. User journey and screen inventory

### Public route `/`

1. Hero introduces the problem and opens the sample demo or workflow narrative.
2. Problem statement explains why an alarm alone does not resolve lot scope or disposition.
3. Snap chapter teaches intake → deterministic scope → source-linked review.
4. Evidence canvas shows a labelled synthetic reading trace, policy, candidate lots, and missing evidence.
5. Human-review panel distinguishes AI draft from the human decision.
6. Pinned Kestra sequence explains trigger, rules, optional draft, pause/resume, and record.
7. Final CTA opens `/demo`.

### Operator route `/demo`

1. Select the sole synthetic fixture.
2. Send it to a connected Kestra webhook or run the explicitly labelled UI-only simulation.
3. Inspect event readings and product policy.
4. Inspect candidate lot rows and per-lot match reasons.
5. Inspect source-linked AI/template draft and citations.
6. If the Kestra run is paused, select a simulated disposition and enter rationale.
7. Inspect execution state and final sample record; reset to run again.

### Empty/loading/failure states

No-results state explains that only the synthetic fixture is available. Loading state shows the current flow stage. Failed validation states identify the field and a safe fix. Incomplete evidence remains visible and never creates a false “clear” or “release” state. If Kestra is unavailable, the user may select the UI-only simulation and the interface repeats that no Kestra execution was created.

---

## 11. Security, privacy, and regulatory roadmap

### Prototype safety boundary

- Synthetic data only; no patient, real product, real batch/lot, employee, vendor, route, or facility data.
- No automatic quarantine/release/reject/recall/disposal; no QMS/WMS/ERP writes.
- No assumption that a 2–8°C range applies to a real product. The range is supplied by the synthetic fixture only.
- External AI disabled by default; allow only the synthetic fixture when explicitly enabled. Keep credentials server-side and set a spend cap.
- Treat execution logs as demo lineage, not as a regulated immutable audit trail.
- Do not claim “GxP-compliant”, “Part 11-compliant”, “Annex 11-compliant”, “validated”, or “audit-ready” for the prototype.

### Future regulatory-readiness roadmap (jurisdiction-neutral)

1. **Intended-use discovery:** choose jurisdiction(s), product classes, users, deployment model, and whether the software influences a regulated quality decision. Consult qualified QA/regulatory/legal professionals.
2. **Requirements and risk analysis:** system boundaries, hazard analysis, data integrity, identity/roles, audit events, electronic records/signatures, retention, backup/restore, supplier controls, model/AI assessment, and human-factors review.
3. **Data governance:** approved data flows, residency, encryption, retention/deletion, vendor/subprocessor review, least privilege, incident response, change control, and model opt-out controls.
4. **Validated implementation plan:** define requirements, test evidence, release/change controls, traceability, environment separation, access reviews, and validation/assurance activities appropriate to the selected jurisdiction and intended use. Do not assume one named validation methodology fits every customer.
5. **Controlled pilot:** connect only to a test/sandbox source; have the customer’s authorised quality function approve procedure, product policy, and human review. No production release action until separately authorised and validated.
6. **Interoperability:** evaluate EPCIS 2.0 mappings and vendor formats through conformance tests; define the source of truth for lot/location relationships. Do not imply standards conformance without evidence.

---

## 12. Monetisation and business model

- **V1:** free/open-source Kestra blueprint and synthetic demo. No paid tier, no subscription, no payments, no trial, and no V1 price.
- **Later options to test:** managed hosting/support, connector operations, or organisation-level governance if users request them. Do not make open-source self-hosting dependent on a proprietary AI service.
- **Revenue sensitivity, not a forecast:** let `P` be a monthly per-organisation price validated in interviews. MRR scenarios are `10P`, `50P`, `200P`, and `1,000P`; corresponding ARR is `120P`, `600P`, `2,400P`, and `12,000P`. `P` is deliberately undefined; these are arithmetic scenarios, not pricing recommendations.
- **Payment provider:** none in V1. Revisit Stripe vs Lemon Squeezy only after choosing legal entity/target jurisdictions, confirming seller-country eligibility, and comparing fees/tax handling. No payment code or account is planned now.
- **Trial/conversion:** no hosted trial until there is a hosted product. The open-source flow is the free entry; measure successful runs and review conversations rather than a fabricated SaaS conversion rate.

---

## 13. Launch, distribution, and feedback

### First 100 qualified users (research-and-adoption target, not paying customers)

- **25 Kestra workflow builders:** publish the blueprint with a clear issue-linked contribution; ask the Kestra community for flow-reuse feedback and plugin/metadata corrections.
- **25 pharma/biotech QA or quality-systems practitioners:** targeted LinkedIn outreach with a short synthetic walkthrough and five interview questions; ask about their current handoff, not for operational records.
- **25 cold-chain/clinical-supply/3PL operations users:** direct discovery through professional communities and vendor-neutral conversations; test the file/webhook adapter model.
- **25 workflow consultants/open-source adopters:** share the runnable sample in GitHub Discussions/Reddit/Indie Hackers where permitted; request reproducibility and usability feedback.

**Channel plan:**
- **GitHub/Kestra community:** blueprint README and Kestra `extend` metadata are the canonical technical entry; link to a sample fixture and documented safety boundary.
- **LinkedIn:** one short project-introduction post and one post after the flow is actually runnable; explain the problem and human boundary, not compliance claims.
- **X:** short progress thread or demo clip after a working synthetic run exists; do not schedule claims in advance.
- **Reddit:** answer relevant cold-chain/quality/software questions with a disclosed open-source link and a useful workflow diagram; no repetitive self-promotion.
- **Indie Hackers:** share the build constraints and open-source route; ask for product discovery advice.
- **Product Hunt:** defer until an actual hosted offering or polished standalone utility exists; a single Kestra blueprint is not a reason to invent a SaaS launch.

**Built-in sharing loop:** future users can share the GitHub blueprint and synthetic run narrative. Do not enable export/share of real event or lot details in V1. If referral mechanics are later justified, measure `K = invitations per active organisation × invite-to-activation conversion`; baseline is unknown, do not build referral UI until interviews demonstrate demand.

### Launch checklist (V1)

- [ ] Issue-linked blueprint PR is open and under the two-open-PR cap; only claim acceptance after maintainer merge/acceptance.
- [ ] Kestra flow can be run with sample fixture and without an external model key.
- [ ] File and webhook paths have documented inputs; malformed and missing-data cases tested.
- [ ] Public UI contains synthetic-data/prototype disclaimer and no external analytics.
- [ ] Privacy statement for the demo describes no real-data upload and no persistence; publish before collecting feedback forms.
- [ ] SEO basics for public route: title/description, Open Graph preview from an approved asset, sitemap/robots decisions. Do not invent a product logo/OG image.
- [ ] No transactional email, payment, customer account, or analytics provider in V1.
- [ ] Any future Sentry/PostHog/Mixpanel integration requires event-body scrubbing and a separate privacy review; disabled by default.

---

## 14. Part-time build sequence (≤4 hours/week)

The Track 02 blueprint comes first; the public marketing animation never blocks the issue-linked contribution. This four-week plan is an estimate, not a delivery promise. If the Hacktober issue deadline is near, submit the reviewed blueprint before expanding the public page.

| Week | Focus | Ship/test outcome |
|---:|---|---|
| 1 (≤4h) | Confirm a ready backlog issue with Paul; check for duplicates; implement only the normalised event contract, webhook/file boundaries, policy evaluation, and candidate scope in the flow. | Minimal runnable Kestra flow against synthetic fixture; no AI key required; no scope or regulatory claims. |
| 2 (≤4h) | Add missing-data branches, optional AI/template draft, structured pause/resume, output metadata, and test cases. Draft issue-linked PR. | Flow meets current repo minimums; Paul personally runs/reviews it; update `HACKTOBER_SUBMISSION.md`. |
| 3 (≤4h) | Build compact `/demo` with fixture-only run, explicit Kestra-connected/simulation state, evidence/candidate views, human decision, and run record. | Keyboard/responsive smoke test; server-side-only secrets; verify no real-data upload. |
| 4 (≤4h) | Build the public page from `FRONTEND_SPEC.md`, after the video asset is previewed/approved; test snap/pinned separation, accessibility, performance, and motion replay. | Landing page and demo routes pass the specified review; if the asset is not approved, retain the neutral placeholder and do not use a generated clip. |

---

## 15. Planned project structure (documentation only)

This is a proposed tree; no application source, YAML, migrations, environment template, or package files have been created yet.

```text
lotline/
├── HACKTOBER_SUBMISSION.md
├── APP_BLUEPRINT.md
├── FRONTEND_SPEC.md
├── CLAUDE.md
├── BUILD_GUIDE.md
├── web/                         # Next.js public page + synthetic demo, after doc approval
│   ├── app/
│   ├── components/
│   ├── data/demo/               # synthetic fixture only
│   └── lib/
└── kestra/
    ├── blueprints/              # issue-linked YAML after approval
    ├── fixtures/                # synthetic JSON/CSV
    └── README.md                # prerequisites, secrets, inputs, outputs
```

---

## 16. Principal risks and mitigations

| Risk | Mitigation |
|---|---|
| Incomplete/misaligned lot-to-shipment data creates false scope | Emit reason codes, completeness status, and unknowns; no automatic disposition; test missing-link cases. |
| AI invents a fact or citation | Default template; explicit evidence allowlist; citation validation; optional AI failure falls back; AI cannot control rules or actions. |
| Sensitive operational data leaves customer environment | Synthetic-only public demo; outbound AI off by default; no production claims; future data-processing controls before real deployments. |
| Demo is mistaken for a validated system | Persistent prototype/synthetic disclaimer, no compliance logos or claims, no “audit-ready” label, no production connector. |
| Overbuilding UI consumes Hacktober time | Kestra blueprint and issue-linked PR first; site and video are secondary. |
| Market gap is overstated | Treat differentiation as a hypothesis; include ELPRO and QMS alternatives; interview users and report uncertainty. |
| Hosted service exceeds $0–$20 budget | No public Kestra hosting or database in V1; template AI; re-estimate before a hosted pilot. |

---

## 17. Research and implementation references

**Product/regulatory context**
- [WHO TRS 961 Annex 9 — model guidance for storage and transport of time- and temperature-sensitive pharmaceutical products](https://www.who.int/docs/default-source/medicines/norms-and-standards/guidelines/distribution/trs961-annex9-modelguidanceforstoragetransport.pdf?sfvrsn=b80e925f_2)
- [eCFR 21 CFR 211.192 — Production record review](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-J/section-211.192)
- [GS1 EPCIS/CBV 2.0 overview](https://www.gs1.org/docs/epcis/epcis_2-0_launch.pdf)

**Kestra**
- [Kestra Blueprints repository and contribution guidance](https://github.com/kestra-io/blueprints/blob/main/README.md)
- [Kestra webhook trigger](https://kestra.io/plugins/core/trigger/io.kestra.plugin.core.trigger.webhook)
- [Kestra Python Script task](https://kestra.io/plugins/tasks/io.kestra.plugin.scripts.python.script)
- [Kestra OpenAI plugin](https://kestra.io/plugins/plugin-openai)
- [Kestra Pause task](https://kestra.io/plugins/core/flow/io.kestra.plugin.core.flow.pause)

**Market/alternatives**
- [Fortune Business Insights cold-chain tracking market (secondary estimate)](https://www.fortunebusinessinsights.com/cold-chain-tracking-and-monitoring-market-109688)
- [The Business Research Company cold-chain tracking report (secondary estimate)](https://www.thebusinessresearchcompany.com/report/cold-chain-tracking-and-monitoring-global-market-report)
- [Tive Tag price announcement (hardware price, July 2023)](https://www.tive.com/press-release/tive-tag-the-most-cost-effective-temperature-logger-in-the-world-now-available-for-5)
- [Tive customer reviews on G2](https://www.g2.com/products/tive/reviews)
- [ELPRO liberoMANAGER update](https://www.elpro.com/en/news/liberomanager-software-enhanced-with-real-time-functionalities)
- [Sensitech pharma monitoring overview](https://www.sensitech.com/en/blog/blog-articles/blog-pharma-cold-chain-monitoring.html)
- [Sensitech TempTale product brief](https://www.shareddocs.com/hvac/docs/2000/Public/04/temptale-ultra-fit.pdf)
- [MasterControl official pricing](https://www.mastercontrol.com/pricing/) · [MasterControl G2 reviews](https://www.g2.com/products/mastercontrol-quality-management-system/reviews)
- [Qualio official pricing](https://www.qualio.com/pricing) · [Qualio G2 reviews](https://www.g2.com/products/qualio/reviews)
- [Reddit r/biotech QMS discussion](https://www.reddit.com/r/biotech/comments/1cai5zb/favorite_qms/)
- [Vercel pricing](https://vercel.com/pricing)

---

## 18. Decisions still open

- Final project name (Lotline remains provisional).
- Kestra target issue number, URL, readiness, and exact acceptance criteria.
- Final choice and approval of the hero video/poster asset.
- Which optional external model, if any, is used for the synthetic-only AI branch and its spend cap.
- Any future hosted-product jurisdiction, retention, authentication, pricing, payment provider, or validation approach.

Paul approved the documents on 2026-10-04 but explicitly instructed that no code be written. Document approval is not implementation authorization; wait for a separate start instruction. The open decisions above remain blockers to the corresponding implementation or external action.
