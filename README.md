# Lotline

Lotline is a synthetic cold-chain workflow prototype. It turns one fixed temperature event into deterministic candidate-lot scope, a visible evidence register, a source-linked draft, and an explicit human review step.

## Project boundary

- Synthetic data only. The included fixture is illustrative and is not operational pharma, patient, product, sensor, lot, staff, facility, or customer data.
- The supplied policy and records drive deterministic evaluation. Missing evidence remains visible; the flow does not invent readings, interpolate across gaps, determine product safety, or make a disposition.
- The Kestra flow pauses for an explicit human review choice. No WMS, QMS, ERP, inventory, release, quarantine, rejection, recall, or disposal system is connected.
- External AI is off by default and restricted to the named synthetic fixture. It can draft cited wording only; citation IDs are validated against supplied evidence.
- No GxP, 21 CFR Part 11, EU GMP Annex 11, validation, or compliance claim is made.

## Run the web app

Requirements: Node.js 22.18 or newer and npm. This repository includes a local `.env` with simulation defaults and a generated signing key. Kestra credentials are intentionally blank because no instance or API token was supplied. Keep the file local; Git ignores it.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. The default page is the public overview. `/demo` runs the single included fixture and uses a clearly labelled UI-only simulation unless a matching Kestra flow has been configured.

## Deploy to Vercel

The Vercel project root is the repository root; [`vercel.json`](vercel.json) points the Next.js build at `web/.next`. Create and link the project from this directory with `vercel project add lotline` and `vercel link --yes --project lotline`. Add `LOTLINE_DEMO_SIGNING_KEY` as a sensitive Vercel environment variable for Production and Preview, then deploy with `vercel --prod`. Keep the local `.env` out of uploads; `.vercelignore` excludes it.

## Configure Kestra (optional)

Import [`kestra/flows/cold-chain-excursion-lot-review.yaml`](kestra/flows/cold-chain-excursion-lot-review.yaml) into a Kestra instance. See [`kestra/README.md`](kestra/README.md) for plugin requirements, flow setup, inputs, outputs, and safety boundaries. Set the matching connection values in `.env` only after the Kestra instance and API token exist. Configure the same webhook key in the Kestra secret backend and the local `.env`.

The web demo always sends the template-mode fixture. Optional external AI is available only through an explicit synthetic-only Kestra flow request; its key belongs in Kestra Secrets, not the web app `.env`. Do not put real operational data or credentials into the public demo.

## Checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

These checks do not replace running the blueprint on a supported Kestra instance, checking its pause/resume behavior, or Paul’s own review. The project submission checklist records those separate steps.

## Submission status

The code and blueprint are a reviewable draft for the Lotline GitHub repository. They are not a Kestra pull request and are not a maintainer-accepted Hacktober contribution. See [`HACKTOBER_SUBMISSION.md`](HACKTOBER_SUBMISSION.md) before any Kestra submission.
