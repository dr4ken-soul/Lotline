"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const menuItems = [
  { label: "The problem", href: "#problem" },
  { label: "Evidence", href: "#evidence" },
  { label: "Human review", href: "#human-review" },
  { label: "Workflow", href: "#workflow" },
  { label: "Operator demo", href: "/demo" },
];

export function PublicNavigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[200] flex h-16 items-center justify-between px-4 transition-colors duration-200 md:h-20 md:px-8 lg:px-12 ${scrolled ? "bg-[oklch(0.155_0.014_254_/_0.88)] backdrop-blur-md" : "bg-transparent"}`}>
        <Link href="/" className="display-face text-2xl font-medium leading-none tracking-[-0.045em] text-[var(--text-primary)] sm:text-[1.7rem]">Lotline</Link>
        <button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-controls="public-menu" className="inline-flex min-h-11 items-center gap-3 rounded-full px-3 text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]">
          Menu <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none"><path d="M3 6h14M3 14h14" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      </header>
      {open && <>
        <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-[300] cursor-default bg-[oklch(0.08_0.01_254_/_0.74)] backdrop-blur-sm" />
        <div id="public-menu" ref={panelRef} role="dialog" aria-modal="true" aria-label="Main navigation" className="fixed inset-0 z-[400] flex min-h-[100dvh] flex-col overflow-y-auto bg-[var(--bg-primary)] px-4 pb-8 pt-5 sm:px-8 md:px-12 md:pb-12 md:pt-8 lg:px-16">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-5 md:pb-7">
            <span className="display-face text-2xl font-medium tracking-[-0.045em]">Lotline</span>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center gap-3 rounded-full px-3 text-sm hover:text-[var(--accent)]">Close <span aria-hidden="true">×</span></button>
          </div>
          <nav aria-label="Main" className="my-auto grid grid-cols-1 gap-1 py-12 md:gap-2 lg:py-16">
            {menuItems.map((item) => item.href.startsWith("/")
              ? <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block w-fit max-w-full display-face text-[clamp(3.25rem,11vw,8rem)] font-normal leading-[0.88] tracking-[-0.055em] text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]">{item.label}</Link>
              : <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="block w-fit max-w-full display-face text-[clamp(3.25rem,11vw,8rem)] font-normal leading-[0.88] tracking-[-0.055em] text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]">{item.label}</a>)}
          </nav>
          <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between md:pt-7">
            <span>Synthetic demo · Human decision required</span>
            <span>No inventory system changes</span>
          </div>
        </div>
      </>}
    </>
  );
}
