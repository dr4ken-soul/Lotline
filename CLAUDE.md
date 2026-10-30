# Lotline — Persistent Agent Context

**Status:** Planning documents approved by Paul on 2026-10-04; implementation is explicitly on hold. No application code or Kestra YAML has been built.  
**Project name:** Lotline (provisional).  
**Primary artifact:** Reusable Kestra Track 02 blueprint for cold-chain excursion → lot review.  
**Companion:** Compact, synthetic-data-only operator demo UI.  
**Last updated:** 2026-10-04.

## What Lotline is

Lotline normalises a temperature event from a webhook or file, evaluates it against an explicitly supplied product policy, deterministically identifies candidate lots from shipment/location/time records, assembles evidence, optionally drafts source-linked narrative, then pauses for a human decision. The V1 Kestra execution records the sample decision and rationale; it does not change inventory or release product.

The public page and `/demo` explain the workflow. The contribution to Kestra’s Blueprints repository—not a commercial SaaS—is the Hacktober Track 02 priority.

## Read order before work

1. `HACKTOBER_SUBMISSION.md` — source of truth for event actions and status.
2. `APP_BLUEPRINT.md` — product scope, market evidence, safety boundary, data/API architecture, roadmap.
3. `FRONTEND_SPEC.md` — exact visual, class, motion, z-index, asset, and interaction contract.
4. `BUILD_GUIDE.md` — build sequence and tests.
5. This file — persistent constraints; never use it as a reason to ignore the first four.

## Mandatory approval gate

- Paul approved the Markdown documents on 2026-10-04, then explicitly instructed: **do not write any code**. Document approval is not implementation authorization.
- **Do not write or build any application code, Kestra YAML, migrations, package files, or generated visual assets unless Paul later gives a separate, explicit start instruction.** If authorization is unclear, ask before implementation.
- The hero video direction is approved, but no asset has been selected. **Do not integrate an animated video until Paul has seen and explicitly approved the actual candidate asset.** Until then, use a neutral graphite placeholder, not an unapproved generated/stock visual.
- Design decisions are recorded in `FRONTEND_SPEC.md`. Do not reopen completed gates unless Paul asks to revise one.
- Do not create a logo or brand symbol. “Lotline” is text-only. Ask Paul before any standalone logo/monogram is proposed.

## Safety, AI, and data boundaries — non-negotiable

- V1 is a **synthetic-data prototype**, not a validated regulated system. No GxP, 21 CFR Part 11, EU GMP Annex 11, “validated”, or “audit-ready” compliance claim.
- No real patient, product, lot, sensor, staff, facility, shipment, customer, or operational data in the public demo or committed fixtures.
- No automatic lot release, quarantine, rejection, recall, disposal, QMS/WMS/ERP write, or any other real downstream action.
- Deterministic logic—not AI—evaluates the configured temperature policy and candidate-lot scope. Missing policy/data/calibration/map means visible `REVIEW_REQUIRED` or `SCOPE_INCOMPLETE`; never infer safety from missing evidence.
- AI only drafts text from an allowlisted evidence pack. It cannot set thresholds, calculate exposure windows, add/remove lots, choose disposition, or execute an action. Every claim must cite an existing evidence ID; unknown citations fail validation.
- AI mode defaults to `template` (no external call). Optional external inference is allowed only with explicit configuration and the synthetic fixture. Do not send operational pharma data to a model. Keep all provider keys and Kestra credentials server-side.
- Treat Kestra execution output in the prototype as demo lineage, not a validated immutable audit record.

## Hacktober 2026 obligations

Read and maintain `HACKTOBER_SUBMISSION.md` from project start. It already exists and records registration as confirmed by Paul’s screenshot; registration does **not** confirm track selection. All other external/human actions stay unchecked until Paul personally confirms them.

Before implementation:

- Search `kestra-io/blueprints` for duplicate or overlapping proposals.
- Select and record the correct `[Blueprint] … – PR checklist` issue.
- Ask Paul to confirm the issue’s scope and acceptance criteria and personally verify readiness. If it has a maintainer “not ready” notice, wait until that notice is removed and it is moved to Backlog.
- Do not rely on issue #404 as the selected issue; it is only a readiness example.
- Star the Kestra repository only after Paul chooses to do it; record completion only after his confirmation.

For the eventual contribution:

- Confirm current repository requirements before coding. The current Blueprints README calls for at least three runnable tasks, at least one flow/control task, at least one trigger, at least one non-core plugin, and complete `extend` metadata with prerequisites, secrets, inputs, outputs, and links.
- Keep no more than two pull requests open at a time.
- Open a PR that directly references the selected issue (e.g. `Closes #NN`); record the URL.
- A social post must be actually published on LinkedIn, X, or Reddit with `#KestraHacktober`; record its real URL. A draft is not complete.
- Only a merged and accepted contribution counts. Keep merge status accurate.
- Paul must personally run/review the tests and understand the submitted code and AI-assisted changes. Never claim human review, external action, or acceptance on his behalf.
- Track 01 assignment and before/after screenshots are not Track 02 requirements.

## Approved product/stack direction

- **Audience:** pharma/life-sciences quality and cold-chain operations, with clinical supply/3PL and regional distributors as adjacent users.
- **Scope:** one reusable Kestra flow plus compact operator demo UI; not a QMS, sensor platform, or hosted service in V1.
- **Backend/orchestration:** Kestra OSS YAML; a small Python Script task for deterministic normalisation/evaluation; webhook trigger and documented file input adapter; optional OpenAI plugin only for synthetic demo narrative; template fallback by default; native Kestra Pause for human review.
- **Frontend:** Next.js App Router + TypeScript + Tailwind CSS v4; `motion/react` for hero scrubbing/small transitions; GSAP ScrollTrigger only for the separate pinned narrative section.
- **Data:** no database/auth in V1. Kestra execution store for local demo runs; browser-session state for UI-only simulation.
- **Hosting/budget:** local Kestra + local Next.js for a live flow; optional personal/non-commercial static preview; target $0/month, hard prototype ceiling $20/month. Do not promise public hosted Kestra inside that budget.
- **Commercial posture:** open-source first; no V1 pricing, billing, payment provider, or paid tier. A hosted product is a post-validation option only.
- **Jurisdiction:** jurisdiction-neutral prototype; regulatory-readiness roadmap only. Do not choose a governing jurisdiction or claim compliance without Paul’s direction and qualified review.

## Frontend implementation rules (after separate explicit start authorization only)

- Follow `FRONTEND_SPEC.md` exactly: Dark editorial; Newsreader / IBM Plex Sans / IBM Plex Mono; graphite-and-amber OKLCH; text-only wordmark; D1 full-screen typographic navigation; asymmetric scroll-scrubbed hero; approved section order; isolated snap chapter; separate GSAP-pinned sequence.
- Use semantic colour variables and the named z-index scale. Do not introduce arbitrary z-index values, hardcoded brand marks, generic decorative grids, fake statistics, or remote screenshot assets.
- Use inline SVG icons only. All status is conveyed by text/icon as well as colour. Every input has a visible label; every route has a skip link; focus is visible and managed.
- Scroll reveals must replay each time. No CSS keyframes for scroll reveal; no `viewport={{ once: true }}`. If Motion is used, use `viewport={{ once: false, amount: 0.1 }}`. Respect `prefers-reduced-motion` and preserve content visibility.
- Keep the operator demo visually calm and static. Never load video/GSAP marketing bundles on `/demo` unnecessarily.
- Never present an unapproved video/poster. A matching blank graphite surface is the interim state.

## Implementation sequence (only after separate explicit authorization)

1. Obtain Paul’s separate explicit start instruction. Document approval alone does not authorize code; current instruction is to write no code.
2. Re-read `HACKTOBER_SUBMISSION.md` and confirm issue readiness with Paul.
2. Implement and test the minimal Kestra flow first: adapters → schema checks → deterministic excursion/lot candidate scope → evidence → optional draft → human pause/resume → recorded sample output.
3. Keep optional AI off by default and keep the no-key template path runnable.
4. Build `/demo` with the single synthetic fixture and explicit connected-vs-simulation state.
5. Build the public page from the frontend spec. Obtain and get approval for the real hero video before integrating it.
6. Run flow, UI, accessibility, responsive, security, motion-replay, and no-secret checks; get Paul’s personal review.
7. Update `HACKTOBER_SUBMISSION.md`, open only an issue-linked PR, and record external status only after confirmation.

## Current status

- Paul approved the documents on 2026-10-04, but explicitly instructed that no code be written. Implementation remains on hold pending a separate start instruction.
- `HACKTOBER_SUBMISSION.md` exists; registration is the only confirmed external checklist item.
- No Kestra issue has been selected or readiness-confirmed.
- No hero video, poster, logo, or other visual asset has been selected.
- No application, Kestra YAML, SQL, API route, `.env.example`, or package files have been created.
