"use client";

import Link from "next/link";
import { MotionConfig, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { AnimatedTrace } from "@/components/landing/animated-trace";
import { KestraSequence } from "@/components/landing/kestra-sequence";
import { PublicNavigation } from "@/components/landing/public-navigation";
import { Reveal } from "@/components/landing/reveal";

const chapters = ["Intake", "Scope", "Review"];

function ChapterRail({ active, goTo }: { active: number; goTo: (index: number) => void }) {
  return <div className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex">
    {chapters.map((chapter, index) => <button key={chapter} type="button" onClick={() => goTo(index)} aria-label={`Go to chapter ${String(index + 1).padStart(2, "0")}: ${chapter}`} aria-current={active === index ? "true" : undefined} className="flex size-9 items-center justify-center rounded-full border border-[var(--border-default)] font-mono text-[0.65rem] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] aria-[current=true]:border-[var(--accent)] aria-[current=true]:text-[var(--accent)]">
      {String(index + 1).padStart(2, "0")}
    </button>)}
  </div>;
}

export function PublicPage() {
  const heroRef = useRef<HTMLElement>(null);
  const snapRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });
  const heroCopyOpacity = useTransform(scrollYProgress, [0, 0.28, 0.38, 0.43], [1, 1, 0, 0]);
  const heroCopyY = useTransform(scrollYProgress, [0.28, 0.38], [0, -24]);
  const milestoneTwoOpacity = useTransform(scrollYProgress, [0.4, 0.47, 0.6, 0.68], [0, 1, 1, 0]);
  const milestoneTwoY = useTransform(scrollYProgress, [0.4, 0.47, 0.6, 0.68], [16, 0, 0, -10]);
  const milestoneThreeOpacity = useTransform(scrollYProgress, [0.7, 0.77, 0.9, 0.96], [0, 1, 1, 1]);
  const milestoneThreeY = useTransform(scrollYProgress, [0.7, 0.77, 0.9, 0.96], [16, 0, 0, 0]);

  const goToChapter = (index: number) => {
    const panel = snapRef.current?.querySelector<HTMLElement>(`[data-chapter="${index}"]`);
    panel?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    panel?.focus({ preventScroll: true });
  };

  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <PublicNavigation />
    <main id="main-content" className="public-shell">
      <section ref={heroRef} className="hero-stage" aria-labelledby="hero-title">
        <div className="hero-sticky">
          <div className="hero-placeholder" aria-hidden="true" />
          <div className="hero-tint" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-[8dvh] z-10 mx-auto grid w-full max-w-[90rem] grid-cols-1 items-end gap-8 px-4 sm:px-6 md:px-8 lg:grid-cols-12 lg:px-12 xl:px-16">
            <motion.div
              className="hero-copy lg:col-span-8 xl:col-span-7"
              style={reduceMotion ? undefined : { opacity: heroCopyOpacity, y: heroCopyY }}
            >
              <motion.div
                className="flex max-w-[64rem] flex-col items-start"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="inline-flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-primary)]">
                  <i className="size-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />COLD-CHAIN SIGNAL / LOT REVIEW
                </span>
                <motion.h1
                  id="hero-title"
                  className="display-face mt-5 max-w-[11ch] text-[clamp(3.4rem,8.4vw,8.8rem)] font-normal leading-[0.86] tracking-[-0.055em] text-balance"
                  initial={reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.78, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >Turn excursions into lot decisions.</motion.h1>
                <motion.p
                  className="mt-5 max-w-[56ch] text-base leading-[1.6] text-[var(--text-primary)]/85 text-pretty md:mt-6 md:text-lg"
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.58, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >Lotline turns temperature events into a clear, evidence-linked review path, while an authorised person keeps the final call.</motion.p>
                <motion.div
                  className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-8"
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.58, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link className="primary-button" href="/demo?fixture=excursion-01">Run sample event <span aria-hidden="true">↗</span></Link>
                  <a className="secondary-button" href="#workflow">See the workflow <span aria-hidden="true">↓</span></a>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          <motion.div aria-hidden="true" className="hero-scroll-milestone absolute right-4 top-[25dvh] z-10 hidden max-w-[18rem] md:block lg:right-[10vw]" style={reduceMotion ? undefined : { opacity: milestoneTwoOpacity, y: milestoneTwoY }}>
            <p className="section-eyebrow">Exposure window</p><h2 className="display-face mt-3 text-3xl leading-[0.98] tracking-[-0.035em] md:text-4xl">Readings become a bounded event.</h2><p className="mt-3 max-w-[32ch] text-sm leading-6 text-[var(--text-primary)]/80">The configured range and observed timestamps stay visible.</p>
          </motion.div>
          <motion.div aria-hidden="true" className="hero-scroll-milestone absolute bottom-[12dvh] left-4 z-10 hidden max-w-[42rem] md:left-8 md:block lg:left-[10vw]" style={reduceMotion ? undefined : { opacity: milestoneThreeOpacity, y: milestoneThreeY }}>
            <p className="section-eyebrow">Review, not release</p><h2 className="display-face mt-3 text-4xl leading-[0.92] tracking-[-0.045em] text-balance md:text-6xl">Evidence first. Human decision last.</h2>
          </motion.div>
          <div className="absolute bottom-5 right-4 z-10 hidden items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--text-primary)]/75 md:flex md:bottom-8 md:right-8 lg:right-12">Scroll to trace the event <span className="h-px w-10 bg-[var(--accent)]" /></div>
          <div className="absolute right-4 top-24 z-10 max-w-[12rem] border-l border-[var(--accent-quiet)] pl-3 font-mono text-[0.58rem] uppercase leading-5 tracking-[0.1em] text-[var(--text-muted)] md:hidden">Graphite placeholder · hero video pending review</div>
        </div>
      </section>

      <section id="problem" className="relative z-10 flex min-h-[72dvh] items-center bg-[var(--bg-primary)] py-24 md:min-h-[78dvh] md:py-32">
        <div className="public-container grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7"><span className="section-eyebrow">The handoff</span><h2 className="display-face mt-5 max-w-[12ch] text-4xl font-normal leading-[0.96] tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl lg:text-7xl">An alarm starts a review. It does not finish one.</h2></Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9"><p className="max-w-[46ch] text-base leading-[1.7] text-[var(--text-secondary)] text-pretty md:text-lg">A temperature trace does not, by itself, identify every lot in scope, resolve missing evidence, or authorise disposition.</p></Reveal>
          <div className="reveal-target reveal-group col-span-full mt-4 grid grid-cols-1 border-t border-[var(--border-default)] sm:grid-cols-3" data-reveal="shown">
            {["Which exposure window?", "Which lots are candidates?", "What evidence is still missing?"].map((question, index) => <div key={question} style={{ "--reveal-index": index } as CSSProperties} className="flex min-h-16 items-center gap-4 border-b border-[var(--border-subtle)] py-4 sm:px-4 md:min-h-20"><span className="font-mono text-xs text-[var(--accent)]">0{index + 1}</span><span className="text-sm md:text-base">{question}</span></div>)}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-[var(--bg-secondary)] py-14 md:py-20" aria-labelledby="chapters-title">
        <div className="public-container">
          <div className="mb-8 grid grid-cols-1 gap-5 md:mb-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7"><span className="section-eyebrow">A review path</span><h2 id="chapters-title" className="display-face mt-4 max-w-[12ch] text-4xl font-normal leading-[0.96] tracking-[-0.04em] sm:text-5xl md:text-6xl">A small workflow with clear boundaries.</h2></div>
            <p className="hidden text-right font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--text-muted)] md:col-span-4 md:col-start-9 md:block">03 parts / one review path</p>
          </div>
          <div ref={snapRef} className="snap-viewport relative rounded-[1rem] border border-[var(--border-default)] bg-[var(--bg-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]" tabIndex={0} aria-label="Lotline workflow chapters" onScroll={(event) => {
            const viewport = event.currentTarget;
            const panels = [...viewport.querySelectorAll<HTMLElement>("[data-chapter]")];
            const closest = panels.reduce((best, panel, index) => Math.abs(panel.getBoundingClientRect().top - viewport.getBoundingClientRect().top) < Math.abs(panels[best].getBoundingClientRect().top - viewport.getBoundingClientRect().top) ? index : best, 0);
            setActiveChapter(closest);
          }}>
            <ChapterRail active={activeChapter} goTo={goToChapter} />
            <article data-chapter="0" tabIndex={-1} className="snap-panel relative grid grid-cols-1 content-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-12 md:gap-10 md:px-12">
              <div className="md:col-span-5"><p className="mono-face text-xs tracking-[0.12em] text-[var(--accent)]">01 / INTAKE</p><h3 className="display-face mt-4 max-w-[12ch] text-4xl font-normal leading-[0.94] tracking-[-0.04em] text-balance md:text-6xl">Keep the source shape. Normalise the meaning.</h3><p className="mt-4 max-w-[44ch] text-sm leading-7 text-[var(--text-secondary)]">A documented JSON or CSV file and an authenticated webhook map to the same event contract. Source IDs and observation times stay attached.</p></div>
              <div className="flex items-center justify-center md:col-span-6 md:col-start-7"><svg viewBox="0 0 520 180" className="h-32 w-full text-[var(--accent)] md:h-40" role="img" aria-label="File and webhook sources join one normalised event"><path d="M 40 45 H 180 Q 220 45 245 90 M 40 135 H 180 Q 220 135 245 90 H 475" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="245" cy="90" r="5" fill="currentColor" /><text x="40" y="30" fill="var(--text-secondary)" fontFamily="var(--font-mono-family)" fontSize="12">FILE</text><text x="40" y="168" fill="var(--text-secondary)" fontFamily="var(--font-mono-family)" fontSize="12">WEBHOOK</text><text x="290" y="78" fill="var(--text-primary)" fontFamily="var(--font-mono-family)" fontSize="12">NORMALISED EVENT</text></svg></div>
            </article>
            <article data-chapter="1" tabIndex={-1} className="snap-panel relative grid grid-cols-1 content-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-12 md:gap-10 md:px-12">
              <div className="md:col-span-5"><p className="mono-face text-xs tracking-[0.12em] text-[var(--accent)]">02 / SCOPE</p><h3 className="display-face mt-4 max-w-[12ch] text-4xl font-normal leading-[0.94] tracking-[-0.04em] text-balance md:text-6xl">Let rules identify candidate lots.</h3><p className="mt-4 max-w-[44ch] text-sm leading-7 text-[var(--text-secondary)]">Product policy, timestamps, shipment/location links, and data completeness determine scope—not a model.</p></div>
              <div className="divide-y divide-[var(--border-subtle)] md:col-span-6 md:col-start-7">
                {[{ id: "POL-02", text: "Explicit product range and effective period" }, { id: "INV-13", text: "Shipment, container, location, and time joins" }, { id: "CAL-04", text: "Missing calibration stays visible" }].map((row) => <div key={row.id} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-4"><span className="font-mono text-xs text-[var(--accent)]">{row.id}</span><span className="text-sm text-[var(--text-secondary)]">{row.text}</span></div>)}
              </div>
            </article>
            <article data-chapter="2" tabIndex={-1} className="snap-panel relative grid grid-cols-1 content-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-12 md:gap-10 md:px-12">
              <div className="md:col-span-5"><p className="mono-face text-xs tracking-[0.12em] text-[var(--accent)]">03 / REVIEW</p><h3 className="display-face mt-4 max-w-[12ch] text-4xl font-normal leading-[0.94] tracking-[-0.04em] text-balance md:text-6xl">Draft with sources. Pause for a person.</h3><p className="mt-4 max-w-[44ch] text-sm leading-7 text-[var(--text-secondary)]">The narrative can be assisted. The decision and rationale remain explicit human inputs.</p></div>
              <div className="panel-shell md:col-span-6 md:col-start-7"><div className="panel-inner p-5 sm:p-7"><p className="mono-face text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-muted)]">Draft · source-linked</p><p className="mt-4 max-w-[52ch] text-sm leading-7">The observed trace includes a high-temperature interval. Candidate lots are listed from the supplied shipment record. Calibration evidence was not provided.</p><p className="mt-4 font-mono text-[0.68rem] text-[var(--accent)]">EVT-017 · POL-02 · INV-13 · CAL-04</p><p className="mt-6 border-t border-[var(--border-subtle)] pt-4 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--accent)]">Paused for human review</p></div></div>
            </article>
          </div>
        </div>
      </section>

      <section id="evidence" className="relative z-10 bg-[var(--bg-primary)] py-24 md:py-32" aria-labelledby="evidence-title">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:px-8 lg:grid-cols-12 lg:px-12 xl:px-16">
          <div className="col-span-full mb-2 grid grid-cols-1 gap-5 md:grid-cols-12 md:items-end">
            <Reveal className="md:col-span-7"><span className="section-eyebrow">Evidence canvas</span><h2 id="evidence-title" className="display-face mt-4 max-w-[12ch] text-4xl leading-[0.96] tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl">See the event and the unknowns together.</h2></Reveal>
            <Reveal className="md:col-span-4 md:col-start-9"><p className="max-w-[44ch] text-sm leading-7 text-[var(--text-secondary)]">A candidate scope is a transparent join across supplied records. It is not a conclusion about product quality.</p></Reveal>
          </div>
          <Reveal className="relative overflow-hidden rounded-[1rem] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5 sm:p-7 lg:col-span-7 lg:p-8"><AnimatedTrace /></Reveal>
          <Reveal className="relative rounded-[1rem] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5 sm:p-7 lg:col-span-5 lg:p-8">
            <h3 className="display-face text-2xl tracking-[-0.03em]">Evidence in scope</h3>
            <div className="mt-4 divide-y divide-[var(--border-subtle)]">
              {[{ id: "EVT-017", label: "Event window", detail: "09:14–09:37 UTC · source trace" }, { id: "POL-02", label: "Synthetic policy", detail: "Version 1.0 · 2.0–8.0°C" }, { id: "INV-13", label: "Inventory snapshot", detail: "Shipment SHP-DEMO-13 · three records" }, { id: "CAL-04", label: "Calibration record", detail: "Missing: calibration record", missing: true }].map((row) => <div key={row.id} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-4"><span className="font-mono text-[0.68rem] text-[var(--accent)]">{row.id}</span><div><p className="text-sm font-medium">{row.label}</p><p className={`mt-1 text-xs leading-5 ${row.missing ? "text-[var(--danger)]" : "text-[var(--text-secondary)]"}`}>{row.missing && <span aria-hidden="true">! </span>}{row.detail}</p></div></div>)}
            </div>
          </Reveal>
          <div className="col-span-full grid grid-cols-1 gap-0 border-y border-[var(--border-default)] md:grid-cols-12">
            <div className="py-6 md:col-span-3 md:pr-6"><p className="section-eyebrow">Candidate scope</p><h3 className="display-face mt-4 text-3xl leading-tight">Two lots match. One is excluded.</h3></div>
            <div className="divide-y divide-[var(--border-subtle)] md:col-span-9">
              {[{ lot: "LOT-26-041", reason: "SHP-DEMO-13, container, location, and time match", status: "CANDIDATE" }, { lot: "LOT-26-042", reason: "SHP-DEMO-13, container, location, and time match", status: "CANDIDATE" }, { lot: "LOT-26-050", reason: "Receipt time falls outside the observed event window", status: "EXCLUDED" }].map((item) => <div key={item.lot} className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-center"><span className="font-mono text-sm">{item.lot}<span className="ml-3 text-sm font-sans text-[var(--text-secondary)]">{item.reason}</span></span><span className={`inline-flex w-fit items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] ${item.status === "CANDIDATE" ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>{item.status}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="human-review" className="relative z-10 bg-[var(--bg-secondary)] py-24 md:py-32" aria-labelledby="human-title">
        <div className="public-container grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4"><span className="section-eyebrow">Human review</span><h2 id="human-title" className="display-face mt-5 max-w-[10ch] text-4xl leading-[0.94] tracking-[-0.04em] text-balance md:text-6xl">A draft can assist. A person decides.</h2><p className="mt-5 max-w-[42ch] text-sm leading-7 text-[var(--text-secondary)] md:text-base">A source-linked template is available without an external model. Any model draft stays within the evidence boundary and cannot set scope or disposition.</p></Reveal>
          <Reveal className="panel-shell lg:col-span-8"><div className="panel-inner grid grid-cols-1 gap-0 lg:grid-cols-12">
            <div className="border-b border-[var(--border-subtle)] p-5 sm:p-7 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full border border-[var(--border-default)] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-secondary)]">Draft · source-linked</span><span className="text-xs text-[var(--text-muted)]">Not a disposition decision</span></div><p className="mt-5 max-w-[55ch] text-sm leading-7 md:text-base">The readings show a high-temperature interval from 09:14 to 09:37 UTC, with a peak of 11.2°C. Two lots match the supplied shipment, location, and time records. The calibration reference was not supplied. Request quality review of the evidence and unknowns.</p><p className="mt-5 flex flex-wrap gap-3 font-mono text-[0.68rem] text-[var(--accent)]"><a href="#evidence" className="text-link">EVT-017</a><a href="#evidence" className="text-link">POL-02</a><a href="#evidence" className="text-link">INV-13</a><a href="#evidence" className="text-link">CAL-04</a></p></div>
            <div className="p-5 sm:p-7 lg:col-span-5 lg:p-8"><h3 className="text-sm font-semibold">Human decision</h3><p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">Kestra pauses until a person records a sample choice and rationale.</p><div className="mt-5 space-y-3" role="list" aria-label="Example sample choices"><p className="flex min-h-12 items-center gap-3 border-b border-[var(--border-subtle)] py-3 text-sm"><span className="size-4 rounded-full border border-[var(--border-default)]" aria-hidden="true" />Maintain hold</p><p className="flex min-h-12 items-center gap-3 border-b border-[var(--border-subtle)] py-3 text-sm"><span className="size-4 rounded-full border border-[var(--border-default)]" aria-hidden="true" />Escalate for quality review</p><p className="flex min-h-12 items-start gap-3 py-3 text-sm"><span className="mt-0.5 size-4 shrink-0 rounded-full border border-[var(--border-default)]" aria-hidden="true" /><span>Record simulated release<small className="mt-1 block font-mono text-[0.6rem] uppercase tracking-[0.08em] text-[var(--accent)]">Simulation only — no inventory system changes</small></span></p></div>
            </div>
          </div></Reveal>
          <div className="lg:col-span-8 lg:col-start-5"><Link className="primary-button" href="/demo?fixture=excursion-01">Inspect sample review <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <KestraSequence />

      <section className="relative z-10 overflow-hidden border-t border-[var(--border-default)] bg-[var(--bg-secondary)] py-24 md:py-32">
        <div className="public-container grid grid-cols-1 items-end gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-8"><span className="section-eyebrow">Start with a synthetic event</span><h2 className="display-face mt-5 max-w-[12ch] text-4xl leading-[0.94] tracking-[-0.04em] text-balance sm:text-5xl md:text-7xl">Review the path before trusting the result.</h2><p className="mt-5 max-w-[54ch] text-sm leading-7 text-[var(--text-secondary)] md:text-base">Explore the fixture, inspect the evidence and candidate scope, then record a sample human decision. No live inventory connection is present.</p></Reveal>
          <Reveal className="md:col-span-4 md:flex md:justify-end"><Link className="primary-button" href="/demo?fixture=excursion-01">Run sample event <span aria-hidden="true">↗</span></Link></Reveal>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[var(--border-default)] bg-[var(--bg-primary)] py-8 md:py-10">
        <div className="public-container grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4"><Link href="/" className="display-face text-2xl tracking-[-0.04em]">Lotline</Link><p className="mt-3 max-w-[36ch] text-xs leading-5 text-[var(--text-muted)]">Open workflow blueprint and synthetic operator demo.</p></div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-3 text-sm text-[var(--text-secondary)] md:col-span-4"><a href="#workflow" className="text-link">Workflow</a><Link href="/demo" className="text-link">Operator demo</Link><a href="#human-review" className="text-link">Safety boundary</a><a href="https://github.com/kestra-io/blueprints" rel="noreferrer" target="_blank" className="text-link">Kestra Blueprints</a></nav>
          <p className="font-mono text-[0.62rem] leading-5 text-[var(--text-muted)] md:col-span-4 md:col-start-9">Synthetic data only · Prototype · Not validated for regulated use · No automated release</p>
        </div>
      </footer>
    </main>
  </MotionConfig>;
}
