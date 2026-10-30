# Kestra blueprint

The reusable flow is [cold-chain-excursion-lot-review.yaml](flows/cold-chain-excursion-lot-review.yaml). It is a Track 02 blueprint draft for review. It is not an accepted Kestra contribution.

## Scope

- Synthetic events only. The included web UI sends only `web/data/demo/excursion-01.json`.
- Deterministic policy evaluation and shipment/container, location, and observed-time candidate scope.
- Missing evidence and sampling gaps remain explicit. No values are interpolated.
- The default draft is a deterministic template. External AI is optional, disabled by default, limited to the exact included synthetic fixture, and citation-validated.
- Kestra pauses for a structured review choice and rationale. No downstream inventory, QMS, WMS, ERP, release, quarantine, rejection, recall, or disposal action is called.

## Prerequisites

- Kestra with the Core, Python Script 1.9.10, and OpenAI plugins available.
- A Docker-capable worker for the Python 3.13 task runner.
- Kestra secrets `LOTLINE_KESTRA_WEBHOOK_KEY` (webhook URL key) and, only if external synthetic drafting is tested, `LOTLINE_AI_API_KEY`.
- The web app's `LOTLINE_KESTRA_BASE_URL`, `LOTLINE_KESTRA_TENANT`, `LOTLINE_KESTRA_NAMESPACE`, `LOTLINE_KESTRA_FLOW_ID`, `LOTLINE_KESTRA_WEBHOOK_KEY`, and API token must refer to the same instance and flow.

## Run

1. Import the YAML into namespace `lotline.demo` and store the webhook key in Kestra Secrets.
2. For a manual run, provide the fixture as `event_json` or `event_file`; do not provide both.
3. For a webhook run, POST the canonical synthetic JSON body to the trigger URL. Set `aiMode` to `external_synthetic` only when deliberately testing that optional path with the named fixture.
4. Inspect `evaluate_event` and confirm the execution pauses at `await_human_review`.
5. Resume with one allowed `decision` and a `rationale`; read final output `review_result`.

The external model path has not been exercised against a live provider in this build. Local Kestra execution also remains unverified when no Kestra instance is configured.

## Canonical event contract

See [APP_BLUEPRINT.md](../APP_BLUEPRINT.md) and the single synthetic fixture in the web app. Required fields include `schemaVersion`, `eventId`, `receivedAt`, `sensorId`, at least one shipment or container key, readings with timezone-bearing timestamps and explicit units, and a supplied product policy. `locationId` and `inventorySnapshot` are needed for complete candidate scope. Calibration evidence is deliberately missing in the included fixture.

## Input, output, and boundaries

Flow inputs, plugin links, secrets, output paths, model fallback, and the safety boundary are documented in the YAML `extend` metadata. The only final decision is a recorded synthetic resume value; there is no operational disposition integration.
