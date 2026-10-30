# Kestra Hacktober 2026 Submission Checklist

**Project:** Lotline, working name  
**Contribution:** Cold-chain excursion evidence to human lot review  
**Track:** Track 02, Blueprint creation  
**Status:** Implementation draft built; not submitted  

## Submission details

- **Blueprint issue number:** TBD
- **Blueprint issue URL:** TBD
- **Pull request URL:** TBD
- **Social post platform:** TBD
- **Social post URL:** TBD
- **Kestra repository starred:** Not confirmed
- **Merge status:** Not opened
- **Accepted and merged:** No

## Instructions for the coding agent

- Read this file before starting project work. If it is missing, create it at the project root before coding.
- Paul provided a separate explicit implementation start instruction on 2026-10-30. The earlier instruction to hold code work no longer applies.
- Keep this checklist current from project start through acceptance. Re-read it before coding, when testing, before opening a pull request, and during follow-up.
- Leave an item unchecked unless Paul has personally confirmed that it is complete. Do not infer completion from a draft, screenshot of a different action, local test, or generated text.
- Before a Kestra submission, recheck the event page and current Blueprints README. The current repository README says proposal issues are not needed and the PR is the proposal; any event issue-link requirement or maintainer readiness notice still needs to be followed.
- Drafting issue text, a pull request description, or a social post is allowed. Paul must perform or approve external actions and personally review, test, and understand all submitted work.
- Keep no more than two pull requests open at a time.
- Do not treat event registration as track selection. This project is a proposed Track 02 contribution. Track 01 assignment and before/after screenshots are not Track 02 requirements.

## Build notes

- The current Blueprints gallery contains a cold-chain temperature-excursion flow focused on sensor-log checks, Slack notification, and quarantine messaging. Lotline's draft centers on deterministic shipment/container/location/time candidate scope, reasoned exclusions, visible evidence gaps, citation validation, and a structured human pause. A final duplicate/issue check remains for Paul before any Kestra PR.
- Local Kestra execution and live provider behavior have not been verified. Paul must review and run the flow before submission.
- The user's requested push to the Lotline GitHub repository is separate from opening a Kestra contribution PR.

## Before coding

- [x] Hacktober registration confirmed by Paul's registration screenshot. Registration does not select a track.
- [ ] Search the Kestra Blueprints repository for duplicate or overlapping proposals.
- [ ] Select and record the relevant `[Blueprint] … – PR checklist` issue.
- [ ] Verify that the issue is ready for work. If it is marked “not ready”, wait for maintainers to clear the notice and move it to Backlog.
- [ ] Confirm the issue's scope, readiness instructions, and acceptance criteria with Paul.
- [ ] Confirm the final project name and the exact data and AI boundaries with Paul.
- [ ] Star the Kestra GitHub repository, then ask Paul to confirm completion.

## Build and test

- [ ] Implement only the agreed Track 02 blueprint scope.
- [ ] Meet the current Blueprints repository minimums: at least three runnable tasks, at least one flow/control task, at least one trigger, and at least one non-core plugin. Recheck the repository README at implementation time.
- [ ] Put the blueprint's user-facing documentation in the YAML `extend` metadata as required by the repository guidelines.
- [ ] Document prerequisites, each secret name and purpose (never secret values), inputs/defaults/allowed values, outputs, setup, links, and safe-use boundaries.
- [ ] Validate the flow with a clearly labelled synthetic event and test expected success, failure, missing-evidence, and human-review paths.
- [ ] Confirm that no secrets or real credentials are committed.
- [ ] Paul has personally run or reviewed the tests and can explain the submitted flow and AI-assisted changes.
- [ ] Capture optional demo evidence if useful. Before/after screenshots are not required for this Track 02 entry.

## Lotline safety boundary

- V1 is a synthetic-data prototype; no real operational pharma, patient, product, sensor, lot, staff, facility, or customer data belongs in the public demo or committed fixtures.
- External AI processing is off by default and may be enabled only for the synthetic fixture. AI drafts source-linked text only; it does not detect excursions, scope candidate lots, or choose a disposition.
- Deterministic rules identify candidate lots from supplied policy and records. An authorised human makes any real disposition decision.
- No automatic lot release or downstream inventory/QMS action; no GxP, 21 CFR Part 11, EU GMP Annex 11, validation, or compliance claim for the prototype.

## Submit and follow up

- [ ] Open a pull request that directly references the selected blueprint issue, for example `Closes #NN`.
- [ ] Record the pull request URL above.
- [ ] Confirm that no more than two pull requests are open at the same time.
- [ ] Ask for and respond to maintainer review. Update this checklist when changes are requested.
- [ ] Publish at least one post on LinkedIn, X, or Reddit describing Hacktober participation and the project, with `#KestraHacktober`.
- [ ] Record the platform and published post URL above. A draft does not count as a published post.
- [ ] Update the merge status above. Only a merged and accepted contribution counts.
- [ ] Confirm with Paul that the contribution is accepted and the final checklist is accurate.

## Reference links

- [Hacktober 2026 rules](https://kestra.io/hacktober)
- [Kestra Blueprints repository](https://github.com/kestra-io/blueprints)
- [Readiness example, issue #404](https://github.com/kestra-io/blueprints/issues/404), illustrative only. Check the current target issue instead of relying on this example.
- [Kestra GitHub repository](https://github.com/kestra-io/kestra)
