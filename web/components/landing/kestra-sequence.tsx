"use client";

import { useEffect, useRef } from "react";

const scenes = [
  { step: "01 / INTAKE", title: "Preserve the source; validate the event contract.", detail: "A webhook or documented file input becomes a normalised event without losing its source IDs or timestamps.", symbol: "JSON → EVENT" },
  { step: "02 / SCOPE", title: "Rules identify candidate exposure and missing evidence.", detail: "Configured policy, observed readings, shipment or container links, location, and time determine the review scope.", symbol: "POLICY + LINKS" },
  { step: "03 / DRAFT", title: "A model may draft cited text from the evidence pack.", detail: "The optional external branch is off by default and is restricted to the named synthetic fixture.", symbol: "CITATIONS CHECKED" },
  { step: "04 / HUMAN PAUSE", title: "A person supplies the decision and rationale.", detail: "Kestra waits for structured input, then records the sample choice. No inventory action follows.", symbol: "PAUSED → RECORDED" },
];

export function KestraSequence() {
  const trackRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const frame = frameRef.current;
        if (!track || !frame) return;
        const items = gsap.utils.toArray<HTMLElement>("[data-sequence-scene]", frame);
        const path = frame.querySelector<SVGPathElement>("[data-sequence-path]");
        gsap.set(items, { opacity: 0, y: 18 });
        if (items[0]) gsap.set(items[0], { opacity: 1, y: 0 });
        if (path) gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 3)}`,
            pin: frame,
            pinSpacing: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            toggleActions: "play none none reverse",
            markers: false,
          },
        });
        items.forEach((item, index) => {
          const start = index * 0.25;
          if (index > 0) timeline.fromTo(item, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.09, ease: "none" }, start);
          if (index < items.length - 1) timeline.to(item, { opacity: 0, y: -10, duration: 0.05, ease: "none" }, start + 0.2);
        });
        if (path) timeline.to(path, { strokeDashoffset: 0, duration: 0.92, ease: "none" }, 0.03);
        return () => timeline.scrollTrigger?.kill();
      });
      cleanup = () => media.revert();
    };
    void setup();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section id="workflow" ref={trackRef} className="relative h-auto bg-[var(--bg-primary)] md:h-[360vh]">
      <div ref={frameRef} className="relative mx-auto grid min-h-[100dvh] w-full max-w-[90rem] grid-cols-1 items-center gap-8 px-4 py-20 sm:px-6 md:px-8 lg:grid-cols-12 lg:px-12 xl:px-16">
        <div className="lg:col-span-4">
          <span className="section-eyebrow">Inside the Kestra run</span>
          <h2 className="display-face mt-5 max-w-[10ch] text-4xl leading-[0.94] tracking-[-0.04em] text-balance md:text-6xl">A traceable path from event to review.</h2>
          <p className="mt-5 max-w-[40ch] text-sm leading-7 text-[var(--text-secondary)]">A reusable blueprint with an explicit decision gate. It records a sample outcome and has no connected release side effect.</p>
          <p className="mono-face mt-8 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">Synthetic data only · Template by default</p>
        </div>
        <div className="relative min-h-[30rem] overflow-hidden border-y border-[var(--border-default)] py-6 md:min-h-[34rem] lg:col-span-7 lg:col-start-6 lg:py-8">
          <svg aria-hidden="true" className="absolute inset-y-8 left-1/2 hidden h-[calc(100%-4rem)] w-20 -translate-x-1/2 md:block" viewBox="0 0 80 480" fill="none"><path data-sequence-path d="M40 4 C40 80 40 88 40 160 S40 240 40 320 S40 400 40 476" stroke="var(--accent)" strokeWidth="1.5" pathLength="1" /></svg>
          <div className="grid min-h-[30rem] grid-cols-1 content-center gap-8 md:min-h-[34rem]">
            {scenes.map((scene, index) => <article data-sequence-scene key={scene.step} className={`${index === 0 ? "" : "md:absolute md:inset-0 md:grid md:content-center"} grid grid-cols-1 gap-6 border-b border-[var(--border-subtle)] py-6 last:border-b-0 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center md:gap-8 md:border-0`}>
              <div>
                <p className="mono-face text-xs tracking-[0.12em] text-[var(--accent)]">{scene.step}</p>
                <h3 className="display-face mt-4 text-3xl leading-[0.98] tracking-[-0.035em] text-balance md:text-5xl">{scene.title}</h3>
                <p className="mt-4 max-w-[46ch] text-sm leading-6 text-[var(--text-secondary)]">{scene.detail}</p>
              </div>
              <div className="flex min-h-28 items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-5 py-6 text-center font-mono text-xs tracking-[0.12em] text-[var(--accent)] md:min-h-40">{scene.symbol}</div>
            </article>)}
          </div>
          <div className="pointer-events-none absolute bottom-3 right-0 left-0 hidden justify-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-muted)] md:flex">
            <span>Intake</span><span>→</span><span>Scope</span><span>→</span><span>Draft</span><span>→</span><span>Human review</span>
          </div>
        </div>
      </div>
    </section>
  );
}
