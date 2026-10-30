# Lotline — Build Guide

**Status:** Implementation draft in progress under Paul's separate explicit start instruction on 2026-10-30. The selected hero video has not been approved, so the build uses the specified blank graphite placeholder. Personal review, local Kestra execution, and external submission steps remain separate gates.

---

## 1. Before writing code

1. Read `HACKTOBER_SUBMISSION.md` first; it is the source of truth for submission status.
2. Paul's separate explicit start instruction was received on 2026-10-30. Document approval alone was not treated as implementation authorization.
3. Review the current Kestra Blueprints contribution guide. It now says proposal issues are not needed and that the PR is the proposal. The local submission checklist still requires Paul to confirm any applicable issue/scope/readiness instruction before a Kestra PR; that external submission gate remains unconfirmed.
4. Search for overlapping proposals and record the result in `HACKTOBER_SUBMISSION.md`; do not claim uniqueness based only on a name search.
5. Recheck the current Hacktober event page and Blueprints repository contribution guidelines before a PR. Registration is not track selection. Track 01-only screenshot requirements do not apply to this Track 02 plan.
6. Preserve the synthetic-only data boundary, default template mode, deterministic candidate scope, and lack of downstream inventory action.
7. Do not choose a production jurisdiction, compliance claim, hosted-product price, payment provider, or real-data plan in code.
8. Start no more than two PRs at a time. Require an issue-linked PR if the current event or maintainers require it, and Paul's own review/test/understanding before submission.

**Why this gate matters:** the Kestra contribution is the core deliverable. UI polish, marketing video, or a hosted feature must never delay an issue-ready blueprint PR.

---

## 2. Builder prerequisites and budget

- Use a supported Node.js LTS (22.18+ for the built-in TypeScript test runner), TypeScript, Python 3, Git, and Docker version current at implementation time; verify versions against the current Next.js and Kestra documentation before installing.
- Run Kestra locally/self-hosted for the live flow. The UI-only simulation must remain available and must clearly say that no Kestra execution was created.
- Use synthetic fixture data only. No customer API keys, sensor credentials, real data, or production service accounts.
- Target recurring spend: **$0/month** for local work. Hard prototype ceiling: **$20/month**, excluding the builder’s hardware/electricity. Optional external AI is disabled by default and billed separately if deliberately enabled.
- A free static preview may use Vercel Hobby only for personal/non-commercial use, subject to current provider limits. A future paid/commercial deployment requires a new hosting, security, and budget decision; do not imply that public Kestra hosting is included in $20/month.
- Do not create a `.env.example`, package file, SQL migration, test fixture, Kestra YAML, or code file until the documentation approval gate has passed.

---

## 3. Planned repository layout

The final project may use a monorepo to keep the blueprint and demo together, but the Kestra YAML must remain independently reusable and easy to copy into the official Blueprints repository.

```text
lotline/
├── HACKTOBER_SUBMISSION.md
├── APP_BLUEPRINT.md
├── FRONTEND_SPEC.md
├── CLAUDE.md
├── BUILD_GUIDE.md
├── README.md
├── kestra/
│   ├── flows/
│   └── README.md
├── web/
│   ├── app/
│   │   ├── page.tsx                 # public page
│   │   ├── demo/page.tsx            # operator demo
│   │   └── api/demo/                 # server-only Kestra adapter routes
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── demo/
│   │   └── ui/
│   ├── data/demo/                    # clearly labelled synthetic fixture only
│   └── lib/                          # schema validation, Kestra proxy, safe output mapping
└── tests/                            # domain and blueprint structure checks
```

This tree is planning, not permission to build. Do not add user-specific paths such as Paul’s Windows `Braid` directory to scripts; that path is not accessible in this workspace. Keep work in the shared project root until Paul copies it locally.

---

## 4. Phase A — Build the reusable Kestra blueprint first

### A1. Confirm contract and adapters

Use the canonical event contract in `APP_BLUEPRINT.md`. Keep the supported adapters deliberately narrow:

- **Webhook:** authenticated Kestra webhook trigger; receive a JSON body; retain source IDs and timestamps.
- **File:** documented JSON or CSV file/flow input; define required headers, delimiter, unit, timestamp format, and timezone; produce exactly the same canonical output as webhook.
- Do not implement S3, vendor SaaS, cloud buckets, or a connector catalogue in V1 unless the selected issue explicitly requires one and Paul approves the scope.

### A2. Flow task sequence

1. Trigger/input adapter.
2. Validate and normalise event; capture schema/source metadata.
3. Evaluate readings against the explicitly supplied product policy.
4. Build candidate lot scope from shipment/container/location/time joins; add a reason code and evidence reference for every candidate/exclusion.
5. Create an evidence completeness/unknowns summary.
6. Branch: default deterministic template draft; optional external model path only for synthetic demo data and only when explicitly enabled.
7. Validate generated citations against the supplied evidence-ID allowlist.
8. Pause for human review using Kestra’s structured resume inputs; collect disposition and rationale.
9. Record the resumed decision in final execution outputs. Do not connect a warehouse, QMS, ERP, release, quarantine, reject, recall, or disposal action.

Use current Kestra docs to verify exact plugin and property names immediately before authoring YAML. Candidate task types are `io.kestra.plugin.core.trigger.Webhook`, `io.kestra.plugin.scripts.python.Script`, optional `io.kestra.plugin.openai.ChatCompletion`, flow control, and `io.kestra.plugin.core.flow.Pause`; versions/fields must be checked against current docs.

### A3. Repository metadata and documentation

Follow the official Kestra Blueprints README, not a copied example. Confirm current tags and readiness criteria. The flow’s `extend` metadata must explain:

- human-friendly title and purpose;
- prerequisites/services;
- every secret name and purpose, never values;
- each input, type, default, and allowed values;
- outputs and example output paths;
- setup and run steps;
- warnings/safety boundary;
- links to used plugins and source formats;
- a `metaDescription` at or below 160 characters;
- current `ee` and `demo` values as applicable.

At least three runnable tasks, one flow/control task, one trigger, and one non-core plugin are required by the current repository contribution guidance. Validate against the current `README.md` and selected issue rather than relying only on this plan.

### A4. Test plan

**Input/normalisation tests**

- Valid webhook JSON and valid file fixture yield the same canonical event.
- Unsupported schema version, malformed JSON/CSV, missing timestamp, bad unit, missing event ID, and missing shipment/container key fail with an actionable message.
- Duplicate, out-of-order, irregularly sampled, and missing readings remain visible and do not create fabricated measurements.

**Deterministic evaluation tests**

- Fully in-range event.
- Warm and cold excursion under explicit policy.
- Reading exactly equal to the boundary remains within range.
- Fahrenheit-to-Celsius normalisation preserves original value/unit and is tested if enabled.
- Event begins/ends outside the policy effective period.
- Missing policy, missing source, or incomplete readings yields review-required, never “safe”.
- Candidate lot matches on documented shipment/container/location/time rules; excluded lot has a reason; missing inventory link yields incomplete scope.
- No interpolation across data gaps in V1.

**AI and human-gate tests**

- `template` mode runs with no provider secret.
- Optional provider branch is skipped unless explicitly enabled on the synthetic fixture.
- Model timeout/error falls back to a labelled template.
- Unknown/fabricated evidence citation is rejected.
- Model cannot change policy fields, candidate lot IDs, or disposition.
- Execution remains paused until an explicit structured human resume input is supplied.
- A human sample choice/rationale appears in final outputs; no external inventory action is invoked.

**Submission tests**

- At least 3 runnable tasks, flow/control task, trigger, and non-core plugin.
- YAML parses and runs on the current supported Kestra version.
- Flow works with no AI key and documents the optional secret.
- No committed credentials or real data.
- `extend` text matches the actual inputs/outputs and stays under metadata length limits.

---

## 5. Phase B — Build the compact `/demo` UI

### B1. Connection contract

- Browser calls same-origin relative routes only, such as `/api/demo/run`; it never calls `localhost`, Kestra, or a provider directly.
- Next.js server route holds Kestra base URL/API credential/webhook key and returns an allowlisted state/output object.
- Trigger the synthetic fixture only. The public route must not accept arbitrary JSON/file uploads.
- If the Kestra server is unreachable/unconfigured, offer an explicitly labelled **UI-only simulation**. Do not invent a Kestra execution ID or show “Connected”.
- Use a short-lived signed demo token or equivalent session-bound mechanism for polling/resume. Rate-limit run/resume requests. Do not expose Kestra API details or stack traces.

### B2. Screen behavior

Build from `FRONTEND_SPEC.md` exactly:

1. Show persistent `SYNTHETIC DATA ONLY` banner and current Kestra/simulation status.
2. Allow selection of the sole event fixture and “Send sample event to Kestra”.
3. Show a progress stage list, readings, policy, candidate lots and scope reasons.
4. Show a source-linked draft. Default mode is deterministic template; only label it AI-generated when the external model was actually used.
5. When the Kestra execution reaches `PAUSED`, show the human review fields and record the synthetic choice/rationale.
6. Show the run/execution record. Clearly label reviewer identity as simulated when not returned by Kestra.
7. Provide reset/retry, validation errors, Kestra unavailable, model failure, missing lot mapping, and missing calibration states.

### B3. No database/auth in V1

Do not add a database, authentication provider, customer account, payment flow, persistent event history, analytics, or real user-upload feature. Use Kestra execution state for a connected local run and browser-session memory for UI-only simulation. Any transition to hosted/real data requires another project decision and a security/regulatory plan.

---

## 6. Phase C — Build the public page

Only after the blueprint is runnable and the operator route is safe:

1. Read `FRONTEND_SPEC.md` in full before writing section code.
2. Build the approved order: hero → problem → isolated snap chapter → evidence canvas → human review → separate pinned Kestra run → CTA → footer.
3. Keep the D1 full-screen typographic nav, text-only wordmark, Newsreader/IBM Plex Sans/IBM Plex Mono fonts, semantic OKLCH palette, exact z-index scale, and safety copy.
4. The hero background is scroll-scrubbed, non-looping video with poster fallback. **Do not source, generate, or integrate a candidate without showing the actual video to Paul and getting explicit approval first.** An unapproved blank graphite placeholder is the only allowed interim state.
5. Keep the snap region and GSAP-pinned sequence separate; pinning is disabled for mobile/reduced-motion.
6. Do not invent metrics, customer logos, product quotes, compliance badges, regulatory claims, or unsupported performance results.

---

## 7. Environment and secret inventory

Do not create `.env.example` before approval. If environment files are approved later, document each key and keep secret values out of version control.

| Variable | Purpose | Exposure |
|---|---|---|
| `LOTLINE_KESTRA_BASE_URL` | Kestra API base URL for server-side adapter | Server only; may identify infrastructure |
| `LOTLINE_KESTRA_API_TOKEN` | Poll/resume access where required | Server secret only |
| `LOTLINE_KESTRA_WEBHOOK_KEY` | Webhook trigger authentication | Server/Kestra secret only |
| `LOTLINE_KESTRA_TENANT` | Kestra tenant for the API and webhook | Server only; non-secret |
| `LOTLINE_KESTRA_NAMESPACE` | Namespace containing the Lotline flow | Server only; non-secret |
| `LOTLINE_KESTRA_FLOW_ID` | Flow ID used by the web adapter | Server only; non-secret |
| `LOTLINE_DEMO_SIGNING_KEY` | Sign short-lived Kestra demo-run tokens | Server secret only |
| `LOTLINE_AI_API_KEY` | Optional provider key for the synthetic-only model branch | Kestra secret only; not part of the web app `.env` |

Never prefix Kestra/API/model keys with `NEXT_PUBLIC_`. Do not print request bodies, provider tokens, or complete environment objects to logs.

---

## 8. Phase D — Quality, security, and handoff review

### Functional checks

- Run the Kestra blueprint with the synthetic fixture and verify trigger → tasks → pause → resume → final output.
- Run the flow with no AI secret; verify template fallback.
- Test malformed input and missing-evidence branches; confirm no false “clear” state.
- Test connected mode and disconnected/UI-simulation mode; no fake Kestra status.
- Verify the demo cannot submit arbitrary operational payloads.

### Frontend checks

- Test at 320px, 640px, 768px, 1024px, and 1440px widths.
- Keyboard only: skip link, full-screen nav, focus trap/return, snap panel controls, form labels, error focus, decision submission.
- Screen-reader labels for chart, status, run steps, citation buttons, radio controls, and modal.
- Verify 4.5:1 normal-text and 3:1 large-text contrast; no status by colour alone.
- Scroll down → up past each reveal → down again; confirm repeatable reveals. Confirm no `once:true` in Motion and no one-shot CSS keyframes for scroll reveals.
- Verify reduced-motion setting disables scrubbing/pinning while all content remains available.
- Confirm `/demo` does not load marketing video or GSAP unnecessarily.
- Check network requests: no external analytics, no model call in default mode, no secrets in the browser.

### Final code/security checks

- Type-check, lint, test, and run a production build using the scripts created after approval.
- Validate Kestra YAML against the current supported version and run it locally.
- Search for hardcoded secrets, real data, logs containing payloads, and unintended external requests.
- Confirm the public page and demo disclaimers match `APP_BLUEPRINT.md`.
- Obtain Paul’s personal review; explain all generated or AI-assisted changes and ensure he can run and describe the tests.

---

## 9. Hacktober workflow and PR

`HACKTOBER_SUBMISSION.md` already exists and must be read/updated from the start. Keep unconfirmed items unchecked. Registration is confirmed by Paul’s screenshot only; it does not set the track or complete GitHub actions.

1. Confirm the issue is not a duplicate and is in the right `[Blueprint]` checklist format.
2. Confirm readiness with Paul. If “not ready”, stop until maintainers clear it and return it to Backlog.
3. Build only the selected issue scope; do not let landing-page polish expand the PR.
4. Before opening the PR, verify no more than two PRs are open.
5. Link the issue explicitly in the PR description (for example, `Closes #NN`) and record the URL.
6. Paul personally reviews/runs tests and confirms understanding.
7. Publish the social post on LinkedIn, X, or Reddit only after the contribution work exists; include `#KestraHacktober`, then record the actual URL.
8. Update maintainer-review/merge state as it changes. Only mark accepted/merged when confirmed.
9. Ask Paul to confirm that the external-action checklist is accurate before declaring completion.

Before/after screenshots are not required for Track 02 unless the current event rules change; check the official page at submission time.

---

## 10. Part-time schedule and stop conditions

Use no more than about four hours per week; keep the Hacktober PR ahead of the website.

| Week | Timebox | Goal |
|---:|---:|---|
| 1 | ≤4h | Ready issue confirmed; event contract, adapters, validation, deterministic scope, runnable flow skeleton. |
| 2 | ≤4h | Human pause/resume, template/optional AI branch, failure cases, repo metadata, local flow tests, issue-linked PR draft/opening. |
| 3 | ≤4h | Synthetic operator demo, server-side Kestra proxy, connected-vs-simulation states, accessibility smoke test. |
| 4 | ≤4h | Public marketing page and scroll narrative after video review; responsive/performance/security checks; user review. |

**Stop and ask Paul before proceeding if:** the issue is not ready; scope expands to real data; anyone requests an automated disposition/release; a compliance claim is proposed; an AI provider would receive operational data; a video/logo/brand symbol needs approval; hosted pricing or jurisdiction is being selected; or the requested change contradicts an approved design gate.

---

## 11. Current references

- [Kestra Hacktober 2026](https://kestra.io/hacktober)
- [Kestra Blueprints contribution guidelines](https://github.com/kestra-io/blueprints/blob/main/README.md)
- [Webhook trigger](https://kestra.io/plugins/core/trigger/io.kestra.plugin.core.trigger.webhook)
- [Python Script task](https://kestra.io/plugins/tasks/io.kestra.plugin.scripts.python.script)
- [OpenAI plugin](https://kestra.io/plugins/plugin-openai)
- [Pause task](https://kestra.io/plugins/core/flow/io.kestra.plugin.core.flow.pause)
- [WHO TRS 961 Annex 9](https://www.who.int/docs/default-source/medicines/norms-and-standards/guidelines/distribution/trs961-annex9-modelguidanceforstoragetransport.pdf?sfvrsn=b80e925f_2)
- [21 CFR 211.192](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-J/section-211.192)
