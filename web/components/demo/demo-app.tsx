"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Evaluation, Disposition } from "@/lib/domain";
import { describeDisposition } from "@/lib/domain";
import { TemperatureTrace } from "@/components/shared/temperature-trace";

type Mode = "kestra" | "simulation";
type KestraState = "CREATED" | "QUEUED" | "RUNNING" | "PAUSED" | "SUCCESS" | "WARNING" | "FAILED" | "CANCELLED" | "UNKNOWN";
type Run = {
  mode: Mode;
  state: string;
  sessionId?: string;
  executionId?: string;
  sessionToken?: string;
  message: string;
};

const stageLabels = ["Event received", "Policy evaluated", "Lot scope checked", "Evidence assembled", "Human review"];
const terminalStates = new Set(["SUCCESS", "WARNING", "FAILED", "CANCELLED"]);

async function readError(response: Response): Promise<string> {
  const body = await response.json().catch(() => ({}));
  return body?.error?.message ?? body?.error ?? "The sample could not be completed. Try again.";
}

export function DemoApp({ evaluation }: { evaluation: Evaluation }) {
  const [connection, setConnection] = useState<"checking" | "kestra" | "simulation">("checking");
  const [run, setRun] = useState<Run | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [decision, setDecision] = useState<Disposition | "">("");
  const [rationale, setRationale] = useState("");
  const [decisionRecorded, setDecisionRecorded] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const connected = connection === "kestra";
  const state = run?.state ?? "READY";
  const paused = run?.mode === "kestra" ? state === "PAUSED" : run?.mode === "simulation" && state === "REVIEW_REQUIRED";
  const stageIndex = !run ? 0 : state === "CREATED" || state === "QUEUED" ? 1 : state === "RUNNING" ? 3 : state === "PAUSED" || state === "REVIEW_REQUIRED" ? 4 : terminalStates.has(state) || state === "DECISION_RECORDED" ? 5 : 2;

  const refreshHealth = useCallback(async () => {
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      const data = await response.json();
      setConnection(data.kestraReachable ? "kestra" : "simulation");
    } catch {
      setConnection("simulation");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void refreshHealth(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshHealth]);

  useEffect(() => {
    if (!run || run.mode !== "kestra" || !run.executionId || !run.sessionToken || terminalStates.has(state) || state === "PAUSED") return;
    let alive = true;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/demo/runs/${encodeURIComponent(run.executionId!)}`, {
          cache: "no-store",
          headers: { "x-lotline-demo-token": run.sessionToken! },
        });
        if (!response.ok) throw new Error(await readError(response));
        const data = await response.json();
        if (alive) setRun((current) => current ? { ...current, state: (data.run?.state ?? "UNKNOWN") as KestraState } : current);
      } catch (cause) {
        if (alive) setError(cause instanceof Error ? cause.message : "Kestra status could not be read.");
      }
    }, 1_200);
    return () => { alive = false; window.clearTimeout(timer); };
  }, [run, state]);

  useEffect(() => {
    if (!run || !["simulation"].includes(run.mode) || !["RUNNING", "REVIEW_REQUIRED"].includes(state)) return;
    const timer = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1_000);
    return () => window.clearInterval(timer);
  }, [run, state]);

  async function startRun() {
    setBusy(true); setError(""); setDecision(""); setRationale(""); setDecisionRecorded(false); setElapsed(0);
    try {
      const response = await fetch("/api/demo/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixtureId: "excursion-01", aiMode: "template" }),
      });
      if (!response.ok) throw new Error(await readError(response));
      const data = await response.json();
      if (data.mode === "simulation") {
        setRun({ mode: "simulation", state: "RUNNING", sessionId: data.sessionId, message: data.message });
        window.setTimeout(() => setRun((current) => current?.mode === "simulation" && current.sessionId === data.sessionId ? { ...current, state: "REVIEW_REQUIRED" } : current), 1_800);
      } else {
        setRun({ mode: "kestra", state: data.state, executionId: data.executionId, sessionToken: data.sessionToken, message: data.message });
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The sample run could not be started.");
    } finally {
      setBusy(false);
      void refreshHealth();
    }
  }

  async function submitDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!run || !decision || rationale.trim().length < 8) return;
    setBusy(true); setError("");
    if (run.mode === "simulation") {
      setRun({ ...run, state: "DECISION_RECORDED", message: "This sample choice stayed in this browser session. No Kestra execution or inventory action was created." });
      setDecisionRecorded(true);
      setBusy(false);
      return;
    }
    try {
      const response = await fetch(`/api/demo/runs/${encodeURIComponent(run.executionId!)}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-lotline-demo-token": run.sessionToken! },
        body: JSON.stringify({ decision, rationale: rationale.trim() }),
      });
      if (!response.ok) throw new Error(await readError(response));
      const data = await response.json();
      setDecisionRecorded(Boolean(data.decisionRecorded));
      setRun({ ...run, state: "DECISION_RECORDED", message: data.message });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The sample decision was not recorded.");
    } finally {
      setBusy(false);
    }
  }

  function resetRun() {
    setRun(null); setError(""); setDecision(""); setRationale(""); setDecisionRecorded(false); setElapsed(0);
    void refreshHealth();
  }

  return (
    <main id="main-content" className="demo-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="demo-topbar">
        <Link className="wordmark" href="/" aria-label="Lotline home">lotline<span>.</span></Link>
        <span className="demo-topbar-label">SYNTHETIC OPERATOR DEMO</span>
        <Link href="/" className="demo-back-link">Back to overview <span aria-hidden="true">↗</span></Link>
      </header>
      <div className="demo-banner" role="note"><span className="banner-dot" /> SYNTHETIC DATA ONLY <span className="banner-divider">/</span> No operational records, inventory actions, or real disposition decisions.</div>

      <section className="demo-intro public-container" aria-labelledby="demo-title">
        <p className="section-eyebrow">Sample event / {syntheticId(evaluation.eventId)}</p>
        <h1 id="demo-title" className="display-face">Review the signal.<br /><em>Keep the decision human.</em></h1>
        <p className="section-copy">Run one fixed cold-chain fixture through the deterministic scope rules, inspect its source references, then record a simulated review choice.</p>
      </section>

      <section className="demo-workspace public-container" aria-label="Synthetic lot review workspace">
        <aside className="demo-rail" aria-label="Run progress">
          <div className="demo-rail-heading"><span className="mono-face">RUN SEQUENCE</span><span className={`connection-pill ${connected ? "is-live" : ""}`}><span />{connection === "checking" ? "CHECKING" : connected ? "KESTRA" : "SIMULATION"}</span></div>
          <ol className="stage-list">
            {stageLabels.map((label, index) => <li key={label} className={index < stageIndex ? "is-done" : index === stageIndex ? "is-current" : ""}><span className="stage-marker" aria-hidden="true">{index < stageIndex ? "✓" : String(index + 1).padStart(2, "0")}</span><span>{label}</span></li>)}
          </ol>
          <div className="run-rail-bottom">
            <span className="mono-face">EVENT ID</span><strong>{evaluation.eventId}</strong>
            <span className="mono-face">SOURCE</span><strong>Fixture / {evaluation.sourceAdapter}</strong>
          </div>
        </aside>

        <div className="demo-main-column">
          <section className="demo-card run-card" aria-labelledby="run-heading">
            <div className="card-heading-row"><div><p className="mono-face card-kicker">01 / SAMPLE INPUT</p><h2 id="run-heading">Cold-chain excursion</h2></div><span className="fixture-chip">FIXTURE 01</span></div>
            <div className="fixture-summary">
              <div><span>Shipment</span><strong>SHP-DEMO-13</strong></div><div><span>Container</span><strong>CTN-DEMO-01</strong></div><div><span>Sensor</span><strong>SENSOR-DEMO-04</strong></div><div><span>Readings</span><strong>4 observations</strong></div>
            </div>
            <div className="run-action-row">
              <button className="primary-button" type="button" onClick={startRun} disabled={busy || Boolean(run)}>{busy ? "Starting sample…" : run ? "Sample running" : "Send sample event"}<span aria-hidden="true">↗</span></button>
              <p>{connected ? "Connected to the configured Kestra flow." : "Kestra is unavailable; this run will be clearly labelled UI-only simulation."}</p>
            </div>
            {run && <div className="run-receipt" role="status"><span className="receipt-indicator" /><div><strong>{run.mode === "kestra" ? "Kestra execution" : "UI-only simulation"} · {run.state.replaceAll("_", " ")}</strong><p>{run.message}</p></div></div>}
            <p className="fixture-preview-note">The cards below are a deterministic preview of this fixed fixture. Kestra execution status is reported separately above.</p>
            {error && <div className="demo-error" role="alert"><strong>Action needs attention</strong><p>{error}</p><button type="button" className="text-link" onClick={() => setError("")}>Dismiss</button></div>}
          </section>

          <section className="demo-card" aria-labelledby="signal-heading">
            <div className="card-heading-row"><div><p className="mono-face card-kicker">02 / SIGNAL & POLICY</p><h2 id="signal-heading">Observed temperatures</h2></div><span className="state-chip">{evaluation.assessment.replaceAll("_", " ")}</span></div>
            <div className="trace-policy-row"><TemperatureTrace /><div className="policy-card"><span className="mono-face">SUPPLIED POLICY</span><strong>2.0–8.0°C</strong><span>Policy {evaluation.policy.policyId} · v{evaluation.policy.version}</span><span>Maximum sampling gap: {evaluation.policy.maxSampleGapMinutes} min</span></div></div>
            <div className="reading-strip" aria-label="Source readings">{evaluation.readings.map((reading) => <div key={reading.readingId} className={`${reading.outOfRange ? "reading-out" : ""} ${!reading.policyApplicable ? "reading-unassessed" : ""}`}><span>{reading.observedAt.slice(11, 16)} UTC</span><strong>{reading.normalizedCelsius.toFixed(1)}°C</strong><small>{!reading.policyApplicable ? "OUTSIDE POLICY · " : ""}{reading.readingId}</small></div>)}</div>
            {evaluation.warnings.length > 0 && <div className="inline-note"><span aria-hidden="true">!</span><p>{evaluation.warnings.join(" ")}</p></div>}
          </section>

          <section className="demo-card" aria-labelledby="scope-heading">
            <div className="card-heading-row"><div><p className="mono-face card-kicker">03 / CANDIDATE SCOPE</p><h2 id="scope-heading">Shipment-linked lots</h2></div><span className="state-chip">{evaluation.state.replaceAll("_", " ")}</span></div>
            <p className="scope-explainer">Candidate scope uses the supplied shipment or container, location, and overlapping event time. A candidate is not a release, hold, or disposition.</p>
            <div className="lot-table" role="table" aria-label="Candidate lot scope"><div className="lot-row lot-header" role="row"><span role="columnheader">LOT RECORD</span><span role="columnheader">SCOPE</span><span role="columnheader">WHY</span></div>{evaluation.candidateLots.map((lot) => <div className="lot-row" role="row" key={lot.lotId}><strong role="cell">{lot.lotId}</strong><span className={lot.scope === "CANDIDATE" ? "lot-candidate" : "lot-excluded"} role="cell">{lot.scope}</span><span role="cell">{lot.reason}</span></div>)}</div>
          </section>

          <section className="demo-card" aria-labelledby="evidence-heading">
            <div className="card-heading-row"><div><p className="mono-face card-kicker">04 / EVIDENCE REGISTER</p><h2 id="evidence-heading">What is present—and missing</h2></div><span className={`state-chip ${evaluation.coverage === "INCOMPLETE" ? "state-warning" : ""}`}>{evaluation.coverage}</span></div>
            <div className="evidence-list">{evaluation.evidence.map((item, index) => <div className="evidence-item" id={evidenceAnchor(item.id)} tabIndex={-1} key={`${item.id}:${index}`}><span className={item.status === "PRESENT" ? "evidence-check" : "evidence-missing"} aria-label={item.status}>{item.status === "PRESENT" ? "✓" : "!"}</span><div><strong>{item.label}</strong><p>{item.detail}</p></div><span className="evidence-ref">{item.sourceRef ?? "NO SOURCE REF"}</span></div>)}</div>
            {evaluation.unknowns.length > 0 && <div className="unknowns-panel"><strong>Open unknowns for review</strong><ul>{evaluation.unknowns.map((item) => <li key={item}>{item}</li>)}</ul></div>}
          </section>

          <section className="demo-card draft-card" aria-labelledby="draft-heading">
            <div className="card-heading-row"><div><p className="mono-face card-kicker">05 / REVIEW DRAFT</p><h2 id="draft-heading">Source-linked summary</h2></div><span className="template-label">DETERMINISTIC TEMPLATE</span></div>
            <blockquote>{evaluation.draft.text}</blockquote>
            <div className="citation-row" aria-label="Cited evidence">{evaluation.draft.citations.map((citation) => <button type="button" key={citation} aria-label={`View cited evidence ${citation}`} onClick={() => focusEvidence(citation)}>{citation}</button>)}</div>
            <p className="draft-boundary">Draft for review only. It does not choose a disposition or determine product safety.</p>
          </section>

          {paused && run && <section className="demo-card review-card" aria-labelledby="review-heading">
            <div className="card-heading-row"><div><p className="mono-face card-kicker">06 / HUMAN REVIEW</p><h2 id="review-heading">Record a sample choice</h2></div><span className="review-required-chip">REVIEW REQUIRED</span></div>
            <p className="scope-explainer">The choice is illustrative and remains in this demo. No inventory system is connected.</p>
            <form onSubmit={submitDecision}>
              <fieldset disabled={busy || decisionRecorded}><legend>Sample disposition</legend><div className="decision-options">{(["hold", "escalate", "simulated_release"] as const).map((option) => <label key={option}><input type="radio" name="decision" value={option} checked={decision === option} onChange={() => setDecision(option)} required /><span>{describeDisposition(option)}</span></label>)}</div></fieldset>
              <label className="rationale-label" htmlFor="review-rationale">Reviewer rationale <span>SIMULATED REVIEWER</span></label>
              <textarea id="review-rationale" value={rationale} onChange={(event) => setRationale(event.target.value)} minLength={8} maxLength={1_000} required placeholder="Explain what you would review next. Keep this sample rationale synthetic." />
              <div className="review-submit-row"><span>{rationale.trim().length}/1,000 characters · {run.mode === "simulation" ? `${elapsed}s in browser session` : "Kestra execution must be paused"}</span><button className="primary-button" type="submit" disabled={!decision || rationale.trim().length < 8 || busy || decisionRecorded}>{busy ? "Recording…" : decisionRecorded ? "Choice recorded" : "Record sample choice"}</button></div>
            </form>
          </section>}

          {decisionRecorded && <section className="decision-receipt" role="status"><span className="receipt-indicator"/><div><strong>Sample choice recorded: {decision ? describeDisposition(decision) : "—"}</strong><p>Reviewer identity is simulated. No real disposition or downstream action has occurred.</p><p className="receipt-rationale">“{rationale.trim()}”</p></div></section>}

          <div className="demo-footer-actions"><button type="button" className="secondary-button" onClick={resetRun} disabled={busy}>Reset sample</button><span>Every run uses the same built-in event fixture.</span></div>
        </div>
      </section>
      <footer className="demo-footnote"><div className="public-container"><p>Lotline is a prototype for workflow exploration. It makes no GxP, 21 CFR Part 11, EU GMP Annex 11, validation, or compliance claim.</p><Link href="/">Return to Lotline overview <span aria-hidden="true">↗</span></Link></div></footer>
    </main>
  );
}

function syntheticId(value: string) {
  return value.replace("EVT-", "");
}

function evidenceAnchor(value: string) {
  return `evidence-${value.replace(/[^A-Za-z0-9_-]/g, "-")}`;
}

function focusEvidence(value: string) {
  const target = document.getElementById(evidenceAnchor(value));
  target?.scrollIntoView({ block: "center" });
  target?.focus({ preventScroll: true });
}
