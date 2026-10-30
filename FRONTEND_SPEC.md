# Lotline — Frontend Specification

**Status:** Approved design handoff; implementation is on hold per Paul’s explicit no-code instruction. No frontend code has been built.  
**Project name:** Lotline (provisional; text-only wordmark)  
**Spec date:** 2026-10-04  
**Routes:** Public product page `/`; synthetic operator demo `/demo`  
**Primary product:** A reusable Kestra cold-chain excursion → lot-review blueprint, presented through a compact operator demo.

> **Build gate:** Paul approved the project documents on 2026-10-04, but explicitly instructed: **do not write any code**. Document approval is not implementation authorization; wait for a separate explicit start instruction. The visual direction is approved, but no video asset has been selected. Before integrating the scroll-scrubbed video, source or create a candidate, show it to Paul, and get explicit approval. Until then, use a plain graphite placeholder surface—not an unapproved image, clip, logo, or generated visual.

---

## 0. Project Identity and Approved Design Gates

- **One-line pitch:** Turn temperature excursions into an evidence-linked lot review, with the final decision left to an authorised person.
- **Aesthetic (Gate 1):** Dark editorial.
- **Navigation (Gate 2):** D1 — full-screen typographic overlay.
- **Background and motion (Gate 3):** 1a — scroll-scrubbed video in the public hero. The asset is **pending user preview and approval**. Static poster/fallback required. No video on `/demo`.
- **Fonts (Gate 4):** Newsreader for display; IBM Plex Sans for interface/body copy; IBM Plex Mono for readings, timestamps, run IDs, and lot IDs.
- **Palette (Gate 5):** Bespoke graphite-and-amber OKLCH palette with semantic success and danger tokens. Palette values below are a concrete token realization of the approved direction, not a new aesthetic choice.
- **Hero (Gate 6):** Asymmetric, full-bleed scene; lower-left copy; text-only Lotline wordmark; primary CTA “Run sample event”; secondary CTA “See the workflow”.
- **Section plan (Gate 7):** Hero → problem statement → isolated snap chapter → asymmetric evidence canvas → human review → separate GSAP-pinned Kestra run → final CTA → footer. Ordinary page scrolling everywhere else. The snap chapter and pinned sequence must not overlap.
- **Project Identity Fingerprint:** asymmetric editorial / editorial serif + sans / monochrome + single pop / scroll-scrubbed video / wave / scroll-driven narrative.
- **Design dials:** `DESIGN_VARIANCE 5` / `MOTION_INTENSITY 7` / `VISUAL_DENSITY 7`.
- **Visual influence:** Blueprint Design plus restrained, meaningful audit-trail cues. Measurement ticks and fine lines belong to charts and process diagrams only. No CCTV/surveillance styling.
- **Branding rule:** “Lotline” is plain text. Do not invent, draw, or hardcode a logo, monogram, badge, or brand symbol.
- **Safety rule:** The demo uses synthetic data only. It is not a validated quality system, makes no GxP/21 CFR Part 11/EU Annex 11 compliance claim, and does not release lots. Deterministic rules identify candidate exposure scope; AI may draft cited text; an authorised human makes any real disposition decision.

---

## 1. Global Design System

### 1.1 Typography

Load and self-host the selected font files through the Next.js font loader when implementation begins. Set `font-display: swap`; preload only the critical Newsreader face used above the fold. Provide the listed fallbacks so the document remains usable when external font delivery is unavailable.

| Token | Family | Use | Weights |
|---|---|---|---|
| `font-display` | Newsreader, Georgia, serif | Headlines, editorial pull quotes | 400, 500, 600 |
| `font-body` | IBM Plex Sans, Arial, sans-serif | Interface, descriptions, labels | 400, 500, 600 |
| `font-mono` | IBM Plex Mono, ui-monospace, monospace | Temperatures, timestamps, event IDs, lot IDs, run status | 400, 500, 600 |

**Rules:** max three font families; body copy max `75ch`; use balanced line-wrap on h1–h3 and pretty line-wrap on paragraphs. Numeric readings and identifiers never use the display face.

### 1.2 Colour tokens — OKLCH

Restrained strategy: graphite neutrals carry the interface; amber is the single identity accent and stays sparse on marketing surfaces. Success and danger colours are reserved for genuine state communication in the demo, paired with words/icons so colour is never the only signal. Do not use pure black, a beige body background, or gradient headline text.

```css
:root {
  --bg-primary:     oklch(0.155 0.014 254);
  --bg-secondary:   oklch(0.188 0.016 254);
  --bg-surface:     oklch(0.222 0.018 254);
  --bg-elevated:    oklch(0.265 0.020 254);

  --accent:         oklch(0.790 0.170 79);
  --accent-hover:   oklch(0.845 0.145 82);
  --accent-quiet:   oklch(0.355 0.075 77);
  --focus:          oklch(0.845 0.145 82);

  --text-primary:   oklch(0.940 0.012 88);
  --text-secondary: oklch(0.805 0.015 250);
  --text-muted:     oklch(0.700 0.018 250);
  --text-inverse:   oklch(0.180 0.018 254);

  --border-subtle:  oklch(0.355 0.018 254 / 0.58);
  --border-default: oklch(0.445 0.022 254 / 0.72);
  --success:        oklch(0.775 0.145 150);
  --danger:         oklch(0.700 0.180 28);

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 160ms;
  --duration-normal: 220ms;
  --duration-slow: 650ms;
}
```

Use semantic CSS variables in components; no hardcoded hex colours in JSX. Before implementation is considered done, measure every foreground/background pair: normal text ≥4.5:1, large text ≥3:1, muted text ≥3:1, and focus rings clearly visible on every surface.

### 1.3 Shared layout and component classes

- **Page root:** `min-h-[100dvh] overflow-x-clip bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased selection:bg-[var(--accent)] selection:text-[var(--text-inverse)]`
- **Public section container:** `mx-auto w-full max-w-[90rem] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16`
- **Editorial body copy:** `max-w-[62ch] font-body text-base leading-[1.65] text-[var(--text-secondary)] text-pretty md:text-lg`
- **Mono eyebrow:** `font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-muted)]`
- **Section eyebrow with amber marker:** parent `inline-flex items-center gap-3`; marker `size-1.5 rounded-full bg-[var(--accent)]`; text uses Mono eyebrow class above.
- **Public section heading:** `max-w-[14ch] font-display text-4xl font-normal leading-[0.96] tracking-[-0.04em] text-[var(--text-primary)] text-balance sm:text-5xl md:text-6xl lg:text-7xl`
- **Panel shell (only for functional panels, not every data row):** outer `rounded-[1rem] bg-[var(--bg-secondary)] p-1.5 ring-1 ring-[var(--border-subtle)]`; inner `rounded-[calc(1rem-0.375rem)] bg-[var(--bg-surface)] shadow-[inset_0_1px_1px_oklch(1_0_0_/_0.08)]`.
- **Data separation:** prefer `border-t`, `divide-y`, and negative space for readings, evidence rows, and lot lists. Do not turn every metric or row into a card.
- **Inline icon system:** inline SVG only; consistent 16px/20px/24px viewBoxes. No emoji, icon-font, remote icon CDN, or invented brand glyph. Every icon-only control has a visible label where space allows and an `aria-label` in all cases.

### 1.4 Shared buttons

**Primary button** (use for “Run sample event”, “Send event to Kestra”, and one clearly primary form submit):

`group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-5 py-2.5 font-body text-sm font-semibold text-[var(--text-inverse)] transition-colors duration-200 hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-40 sm:px-6`

If a directional icon is used, place it in its own nested circle: `inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[oklch(0.15_0.01_254_/_0.12)] transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px`. The inline SVG inside uses `size-4`.

**Secondary link/button:**

`inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border-default)] px-5 py-2.5 font-body text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]`

**Text link:**

`font-body text-sm font-medium text-[var(--text-primary)] underline decoration-[var(--border-default)] underline-offset-4 transition-colors duration-200 hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]`

### 1.5 Global z-index map

Use only these named slots. Do not add arbitrary `z-[999]` values.

| Tailwind z class | CSS token | Purpose |
|---|---|---|
| `z-0` | `--z-background: 0` | Hero video/poster, chart backgrounds |
| `z-[3]` | `--z-texture: 3` | Non-interactive hero tint/grain overlay |
| `z-10` | `--z-content: 10` | Section content and default positioned content |
| `z-20` | `--z-floating: 20` | Functional contextual callouts inside a section |
| `z-[100]` | `--z-dropdown: 100` | Select menus/popovers |
| `z-[200]` | `--z-sticky: 200` | Fixed public/app header and progress rail |
| `z-[300]` | `--z-modal-backdrop: 300` | Full-screen navigation scrim and modal backdrops |
| `z-[400]` | `--z-modal: 400` | Full-screen navigation panel and dialogs |
| `z-[500]` | `--z-toast: 500` | Action confirmation/error toasts |
| `z-[600]` | `--z-tooltip: 600` | Tooltips that cannot be replaced with visible helper text |

Backdrop blur is permitted only on fixed/sticky UI such as the menu scrim or header. Do not blur scrolling content.

### 1.6 Motion rules and exact primitives

Motion intensity 7 applies to the scroll narrative—not to every component. Keep operator controls calm, immediate, and interruptible. Animate only `transform` and `opacity` except the video playhead and the SVG path-draw in the pinned narrative.

**Hero entrance (page-load only; not a scroll reveal):** easing for every row is `cubic-bezier(0.16, 1, 0.3, 1)`.

| Element | Initial | Animate | Duration | Delay |
|---|---|---|---:|---:|
| Hero eyebrow | `opacity: 0; y: 12px` | `opacity: 1; y: 0` | 0.55s | 0.00s |
| Hero h1 | `opacity: 0; y: 24px; filter: blur(6px)` | `opacity: 1; y: 0; filter: blur(0)` | 0.78s | 0.10s |
| Hero supporting copy | `opacity: 0; y: 16px` | `opacity: 1; y: 0` | 0.58s | 0.25s |
| Hero CTA row | `opacity: 0; y: 14px` | `opacity: 1; y: 0` | 0.58s | 0.38s |

**Repeatable below-fold reveal:** initially visible in markup. On client initialisation, only elements below the viewport may be marked hidden. Trigger at 10% visibility; add the `revealed` class on entry and remove it after the element exits above the viewport so the transition plays again on re-entry. No one-shot scroll reveals.

- Initial: `opacity: 0; transform: translateY(24px)`.
- Animate: `opacity: 1; transform: translateY(0)`.
- Duration: `650ms`; easing: `cubic-bezier(0.16, 1, 0.3, 1)`; group stagger: `40ms` per item, maximum 5 items per stagger.
- Use CSS transitions or Motion with `viewport={{ once: false, amount: 0.1 }}`. Never use `viewport={{ once: true }}` or CSS keyframes for scroll-triggered reveals.

**Micro-interactions:** 160–220ms; ease-out curve above. Hover/focus must not move layout. Functional buttons use no bounce/elastic easing. Success/error feedback appears within 300ms. Disabled controls use `disabled` and 0.40 opacity.

**Reduced motion:** under `prefers-reduced-motion: reduce`, disable video scrubbing, GSAP pinning, path-drawing, stagger, and parallax. Show the approved static poster (once approved), show all sequence stages in normal document flow, and keep all content visible. Do not hide content until motion completes.

---

## 2. Public navigation — Gate 2: D1 full-screen typographic overlay

### Header

- **Header element:** `fixed inset-x-0 top-0 z-[200] flex h-16 items-center justify-between px-4 transition-colors duration-200 md:h-20 md:px-8 lg:px-12`
- **Wordmark:** text `Lotline`; no mark. Classes: `font-display text-2xl font-medium leading-none tracking-[-0.045em] text-[var(--text-primary)] sm:text-[1.7rem]`
- **Menu trigger:** text “Menu” plus a two-line inline SVG; classes `inline-flex min-h-11 items-center gap-3 rounded-full px-3 font-body text-sm text-[var(--text-primary)] transition-colors duration-200 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]`
- **Sticky header on dark sections:** same classes; add `bg-[oklch(0.155_0.014_254_/_0.88)] backdrop-blur-md` only after leaving the video hero. On the hero, retain a transparent header with a subtle dark top tint from the hero overlay.

### Open menu

- **Scrim:** `fixed inset-0 z-[300] bg-[oklch(0.08_0.01_254_/_0.74)] opacity-0 backdrop-blur-sm transition-opacity duration-200 data-[open=true]:opacity-100`
- **Panel:** `fixed inset-0 z-[400] flex min-h-[100dvh] flex-col overflow-y-auto bg-[var(--bg-primary)] px-4 pb-8 pt-5 sm:px-8 md:px-12 md:pb-12 md:pt-8 lg:px-16`
- **Panel top row:** `flex items-center justify-between border-b border-[var(--border-subtle)] pb-5 md:pb-7`; left text uses the Wordmark class; right close button uses the Menu trigger class and visible label “Close”.
- **Navigation list:** `my-auto grid grid-cols-1 gap-1 py-12 md:gap-2 lg:py-16`; each link uses `block w-fit max-w-full font-display text-[clamp(3.25rem,11vw,8rem)] font-normal leading-[0.88] tracking-[-0.055em] text-[var(--text-primary)] transition-colors duration-200 hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]`.
- **Menu entries and destinations:** “The problem” → `#problem`; “Evidence” → `#evidence`; “Human review” → `#human-review`; “Workflow” → `#workflow`; “Operator demo” → `/demo`.
- **Panel footer:** `flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between md:pt-7`; copy: “Synthetic demo · Human decision required”.
- **Behaviour:** click, Enter, or Space opens; Escape and close button dismiss; clicking an in-panel link navigates and closes. Lock background scrolling, trap focus while open, focus the first link on open, return focus to the trigger on close. Do not place hidden drag zones over the page.

---

## 3. Public page sections (in approved order)

### Section 1 — Hero / scroll-scrubbed cold-chain scene

**Recipe:** `editorial-asymmetric-hero` + `scroll-scrubbed-video-showcase`, adapted to the approved lower-left composition and `100dvh` viewport rule. The hero is one dedicated scroll-scrub region.

- **Outer section:** `relative h-[300vh] bg-[var(--bg-primary)]`
- **Sticky viewport:** `sticky top-0 h-[100dvh] w-full overflow-hidden bg-[var(--bg-primary)]`
- **Video:** `absolute inset-0 z-0 h-full w-full object-cover`; attributes `muted`, `playsInline`, `preload="auto"`, `poster` set; **no** `autoplay` and **no** `loop`. Map `scrollYProgress` from 0→1 directly to `video.currentTime` from 0→duration. The clip is not an ambient loop.
- **Hero tint:** `absolute inset-0 z-[3] pointer-events-none bg-[linear-gradient(180deg,oklch(0.10_0.01_254_/_0.34)_0%,oklch(0.10_0.01_254_/_0.02)_32%,oklch(0.10_0.01_254_/_0.16)_60%,oklch(0.10_0.01_254_/_0.86)_100%)]`
- **Hero content group:** `absolute inset-x-0 bottom-[8dvh] z-10 mx-auto grid w-full max-w-[90rem] grid-cols-1 items-end gap-8 px-4 sm:px-6 md:px-8 lg:grid-cols-12 lg:px-12 xl:px-16`
- **Text column:** `lg:col-span-8 xl:col-span-7`; content flow `flex max-w-[64rem] flex-col items-start`.
- **Eyebrow:** `inline-flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-primary)]`; text “COLD-CHAIN SIGNAL / LOT REVIEW”. Amber marker uses `size-1.5 rounded-full bg-[var(--accent)]`.
- **H1:** “Turn excursions into lot decisions.” Classes: `mt-5 max-w-[11ch] font-display text-[clamp(3.4rem,8.4vw,8.8rem)] font-normal leading-[0.86] tracking-[-0.055em] text-[var(--text-primary)] text-balance`.
- **Supporting copy:** “Lotline turns temperature events into a clear, evidence-linked review path—while an authorised person keeps the final call.” Classes: `mt-5 max-w-[56ch] font-body text-base leading-[1.6] text-[var(--text-primary)]/85 text-pretty md:mt-6 md:text-lg`.
- **CTA row:** `mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-8`. Primary shared button “Run sample event” → `/demo?fixture=excursion-01`; secondary shared button “See the workflow” → `#workflow`.
- **Progress cue:** `absolute bottom-5 right-4 z-10 hidden items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--text-primary)]/75 md:flex md:bottom-8 md:right-8 lg:right-12`; copy “Scroll to trace the event”; short line `h-px w-10 bg-[var(--accent)]`.
- **Milestone 2 (scroll progress 0.47–0.66):** callout `absolute right-4 top-[28dvh] z-10 max-w-[18rem] md:right-8 lg:right-[10vw]`; eyebrow “EXPOSURE WINDOW”; title “Readings become a bounded event.”; body “The configured range and observed timestamps stay visible.” Use classes `font-display text-3xl leading-[0.98] tracking-[-0.035em] text-[var(--text-primary)] md:text-4xl` and `mt-3 max-w-[32ch] font-body text-sm leading-6 text-[var(--text-primary)]/80`. Opacity mapping `[0.40,0.47,0.60,0.68] → [0,1,1,0]`; y `[16,0,0,-10]` px.
- **Milestone 3 (scroll progress 0.76–0.94):** `absolute bottom-[12dvh] left-4 z-10 max-w-[42rem] md:left-8 lg:left-[10vw]`; eyebrow “REVIEW, NOT RELEASE”; headline “Evidence first. Human decision last.” Classes `font-display text-4xl leading-[0.92] tracking-[-0.045em] text-[var(--text-primary)] text-balance md:text-6xl`; opacity mapping `[0.70,0.77,0.90,0.96] → [0,1,1,1]`; y `[16,0,0,0]` px. No additional CTA here.
- **Hero z-stack:** z-0 video/poster; z-[3] tint; z-10 copy/cues; z-[200] fixed header.
- **Loading/performance:** poster visible before video metadata; if the video is not ready, keep poster and copy visible. H.264 MP4, 1080p, ≤10 MB. At small widths or under reduced motion, use the approved static poster with no playhead scrubbing and retain all hero copy.
- **Asset brief (pending):** one 5–7 second, non-looping, 21:9 cinematic clip, with a center-safe crop for mobile. Show an unbranded, temperature-controlled pharmaceutical shipper/cold-room surface and a single subtle amber instrument indicator; slow lateral camera movement from a sealed container to an unbranded sensor, no people required, no readable labels/UI, no medical claims, no visible surveillance lens, no logos, no generated text. Graphite/cool-neutral grade, controlled amber accent, editorial rather than sci-fi. Generate/source a still first, then animate; present the actual clip to Paul before use. Fallback is its approved poster frame. Host in project public assets or low-cost object storage only after approval.

### Section 2 — Problem statement

**Composition:** Bespoke editorial statement; no image, no metric strip, no repeated split hero.

- **Section:** `relative z-10 flex min-h-[72dvh] items-center bg-[var(--bg-primary)] py-24 md:min-h-[78dvh] md:py-32`
- **Container:** shared public section container, plus `grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12`.
- **Lead column:** `lg:col-span-7`; eyebrow shared class; h2 “An alarm starts a review. It does not finish one.” with `mt-5 max-w-[12ch] font-display text-4xl font-normal leading-[0.96] tracking-[-0.04em] text-[var(--text-primary)] text-balance sm:text-5xl md:text-6xl lg:text-7xl`.
- **Supporting column:** `lg:col-span-4 lg:col-start-9`; paragraph “A temperature trace does not, by itself, identify every lot in scope, resolve missing evidence, or authorise disposition.” Classes `max-w-[46ch] font-body text-base leading-[1.7] text-[var(--text-secondary)] text-pretty md:text-lg`.
- **Question row:** `col-span-full mt-10 grid grid-cols-1 border-t border-[var(--border-default)] sm:grid-cols-3`; each row `flex min-h-16 items-center gap-4 border-b border-[var(--border-subtle)] py-4 sm:px-4 md:min-h-20`; number `font-mono text-xs text-[var(--accent)]`; question `font-body text-sm text-[var(--text-primary)] md:text-base`. Copy: “Which exposure window?”, “Which lots are candidates?”, “What evidence is still missing?”.
- **Z-stack:** z-0 base; z-10 content. No floating overlays.
- **Animation:** question rows reveal with the repeatable 650ms fade-up primitive; 40ms stagger, first row delay 0.06s. H2 initial/animate same as repeatable reveal. No number counter.
- **Asset brief:** none. Typography and intentional rule lines only.

### Section 3 — Isolated scroll-snap chapter

**Composition:** Bespoke three-panel snap chapter. This is a self-contained, keyboard-focusable scroll region; it does not make the rest of the document mandatory-snap. It ends before the evidence canvas and is separate from the GSAP-pinned section.

- **Section wrapper:** `relative z-10 bg-[var(--bg-secondary)] py-14 md:py-20`
- **Inner container:** shared public section container.
- **Section header:** `mb-8 grid grid-cols-1 gap-5 md:mb-10 md:grid-cols-12 md:items-end`; eyebrow and h2 in `md:col-span-7`; small right-aligned mono label in `md:col-span-4 md:col-start-9`, copy “03 PARTS / ONE REVIEW PATH”.
- **Snap viewport:** `relative h-[100dvh] max-h-[100dvh] overflow-y-auto overscroll-y-contain rounded-[1rem] border border-[var(--border-default)] bg-[var(--bg-primary)] snap-y snap-proximity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)] lg:snap-mandatory`; `tabIndex=0`, accessible name “Lotline workflow chapters”.
- **Each panel:** `relative grid min-h-[100dvh] snap-start grid-cols-1 content-center gap-8 px-5 py-12 sm:px-8 md:min-h-[38rem] md:grid-cols-12 md:gap-10 md:px-12`; at narrow widths keep `snap-proximity` and permit free scroll if content is taller than the viewport.
- **Panel 01:** small label “01 / INTAKE”; h3 “Keep the source shape. Normalise the meaning.”; copy distinguishes file/webhook adapters from the common event contract. Left text `md:col-span-5`; right visual `md:col-span-6 md:col-start-7`. Visual is an inline SVG line joining two plain text source labels (“FILE” and “WEBHOOK”) to “NORMALISED EVENT”; SVG `h-24 w-full text-[var(--accent)] md:h-40`, `aria-hidden=true`; no brand symbols.
- **Panel 02:** label “02 / SCOPE”; h3 “Let rules identify candidate lots.”; copy “Product policy, timestamps, shipment/location links, and data completeness determine scope—not a model.” Right visual is a three-row evidence list with `divide-y divide-[var(--border-subtle)]`; each row `grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-4`; mono IDs use `font-mono text-xs text-[var(--accent)]`, text uses `font-body text-sm text-[var(--text-secondary)]`.
- **Panel 03:** label “03 / REVIEW”; h3 “Draft with sources. Pause for a person.”; copy “The narrative can be assisted. The decision and rationale remain explicit human inputs.” Right visual shows a compact AI draft with visible evidence-reference links and a labelled “PAUSED FOR HUMAN REVIEW” state.
- **Panel headings:** `max-w-[12ch] font-display text-4xl font-normal leading-[0.94] tracking-[-0.04em] text-[var(--text-primary)] text-balance md:text-6xl`.
- **Progress rail:** `absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex`; use three labelled buttons, `size-8 rounded-full border border-[var(--border-default)] font-mono text-[0.65rem] text-[var(--text-muted)] aria-[current=true]:border-[var(--accent)] aria-[current=true]:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]`. Each button scrolls to its panel; label it “Go to chapter 01/02/03”.
- **Z-stack:** z-0 surface; z-10 panel contents; z-20 progress rail; dropdowns use z-[100]. No shared/global pin in this section.
- **Animation:** active marker transitions only; panel content uses repeatable 650ms reveal with 40ms stagger on rows. Snap is native CSS behavior; do not animate scroll position automatically.
- **Asset brief:** no external image. SVG process line is semantic/labelled and may be replaced by DOM/CSS if that improves accessibility.

### Section 4 — Asymmetric evidence canvas

**Recipe:** `asymmetric-bento-grid`, adapted for one chart and evidence rows (not a grid of identical cards). The chart is a meaningful data canvas, not a decorative grid.

- **Section:** `relative z-10 bg-[var(--bg-primary)] py-24 md:py-32`
- **Container:** `mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12 xl:px-16`
- **Header:** `col-span-full mb-2 grid grid-cols-1 gap-5 md:grid-cols-12 md:items-end`; title `md:col-span-7`, supporting copy `md:col-span-4 md:col-start-9`.
- **Temperature trace panel:** `relative overflow-hidden rounded-[1rem] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5 sm:p-7 lg:col-span-7 lg:p-8`; no generic drop shadow.
  - top metadata row `flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-5`; event label `font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-muted)]`; value `font-mono text-sm text-[var(--text-primary)]`.
  - chart header h3 class `font-display text-2xl leading-tight tracking-[-0.03em] text-[var(--text-primary)] md:text-3xl`; subtitle `mt-2 font-body text-sm leading-6 text-[var(--text-secondary)]`.
  - inline SVG chart class `mt-6 block h-[14rem] w-full overflow-visible md:h-[19rem]`; viewBox ratio 760×300; graph axes, ticks, range band, data path, and event-window bracket all labelled. Tick/axis lines use `stroke-[var(--border-default)]`; normal readings use `stroke-[var(--text-secondary)]`; excursion trace uses `stroke-[var(--accent)]`; range band uses a faint amber fill plus “Configured range” text. The chart must also have a textual summary and accessible description.
  - synthetic chart fixture: configured band 2.0–8.0°C; trace begins at 2.6°C, rises above 8.0°C at 09:14 UTC, peaks at 11.2°C, and returns to range by 09:37 UTC. Label the entire view “SYNTHETIC FIXTURE”. Never present these values as customer data or a performance metric.
- **Policy/evidence rail:** `relative rounded-[1rem] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5 sm:p-7 lg:col-span-5 lg:p-8`; header “Evidence in scope”; rows separated by `divide-y divide-[var(--border-subtle)]`.
  - each evidence row class `grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-4`; ID `font-mono text-[0.68rem] text-[var(--accent)]`; label `font-body text-sm font-medium text-[var(--text-primary)]`; detail `mt-1 font-body text-xs leading-5 text-[var(--text-secondary)]`.
  - rows: `EVT-017` → event window; `POL-02` → synthetic policy version; `INV-13` → linked shipment/lot snapshot; `CAL-04` → calibration reference marked “not supplied” in this fixture.
  - missing evidence state uses text “Missing: calibration record” plus a warning icon and `text-[var(--danger)]`; never convey solely by red.
- **Lot-scope strip:** `col-span-full grid grid-cols-1 gap-0 border-y border-[var(--border-default)] md:grid-cols-12`; heading block `py-6 md:col-span-3 md:pr-6`; rows block `md:col-span-9` with `divide-y divide-[var(--border-subtle)]`.
  - candidate row layout `grid grid-cols-1 gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-center`; lot ID `font-mono text-sm text-[var(--text-primary)]`; scope reason `font-body text-sm text-[var(--text-secondary)]`; status `inline-flex w-fit items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--accent)]`.
  - synthetic fixture: `LOT-26-041` and `LOT-26-042` are *candidate* lots linked to `SHP-DEMO-13`; `LOT-26-050` is shown as excluded because its recorded receipt time falls outside the demonstrated event window. Each row says “candidate” or “excluded” in text. These are not actual affected or releasable lots.
- **Z-stack:** z-0 surface; z-10 content and chart; z-20 chart callouts only; tooltips z-[600]. The SVG has no absolute text overlay that obscures its axes.
- **Animation:** line draw `[strokeDashoffset: pathLength → 0]` over 0.9s, ease `cubic-bezier(0.16,1,0.3,1)`, delay 0.18s, only on first viewport entry; do not run continuously. Other content uses repeatable fade-up. Under reduced motion, draw the completed static line immediately.
- **Asset brief:** no external asset; one inline SVG temperature plot from the labelled synthetic fixture. No stock photo, fake dashboard screenshot, or raster placeholder.

### Section 5 — Human review

**Composition:** Bespoke editorial review panel; source-linked draft and human controls are visibly distinct. The AI text must never resemble a release instruction.

- **Section:** `relative z-10 bg-[var(--bg-secondary)] py-24 md:py-32`
- **Container:** shared public section container; `grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12`
- **Editorial lead:** `lg:col-span-4`; eyebrow shared class; h2 “A draft can assist. A person decides.” classes `mt-5 max-w-[10ch] font-display text-4xl font-normal leading-[0.94] tracking-[-0.04em] text-[var(--text-primary)] text-balance md:text-6xl`; body `mt-5 max-w-[42ch] font-body text-sm leading-7 text-[var(--text-secondary)] md:text-base`.
- **Review surface:** `lg:col-span-8`; outer shared Panel shell; inner `grid grid-cols-1 gap-0 lg:grid-cols-12`.
- **Draft column:** `border-b border-[var(--border-subtle)] p-5 sm:p-7 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-8`.
  - label row `flex items-center justify-between gap-4`; badge “DRAFT · SOURCE-LINKED” uses `inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-secondary)]`; status label “Not a disposition decision” uses `font-body text-xs text-[var(--text-muted)]`.
  - draft paragraph `mt-5 max-w-[55ch] font-body text-sm leading-7 text-[var(--text-primary)] md:text-base`; citations displayed as inline links with `font-mono text-[0.68rem] text-[var(--accent)] underline decoration-[var(--accent-quiet)] underline-offset-4`; sample citations `EVT-017`, `POL-02`, `INV-13` open evidence detail.
  - draft content must state facts and uncertainty, e.g. the observed interval/peak, candidate lots, and “calibration record not supplied”. It may suggest “request quality/stability assessment”; it must not label product safe, unsafe, releasable, or destroyed.
- **Human decision column:** `p-5 sm:p-7 lg:col-span-5 lg:p-8`; heading `font-body text-sm font-semibold text-[var(--text-primary)]`; helper `mt-2 font-body text-xs leading-5 text-[var(--text-secondary)]`; controls are visible radio/select choices, not colour-only chips. Example demo choices: “Maintain hold”, “Escalate for quality review”, and “Record simulated release”. The last option is always visibly marked “SIMULATION ONLY — no inventory system is changed”.
- **Primary interaction CTA:** shared Primary button “Inspect sample review” → `/demo?fixture=excursion-01`.
- **Z-stack:** z-0 section surface; z-10 review content; z-[100] if a native popover is required. No floating approval overlay.
- **Animation:** panel fade-up 650ms/ease-out on entry, repeatable on re-entry; no animated decision controls. Hover/focus only 160–220ms.
- **Asset brief:** no external image. Build the visible UI with real HTML, SVG, and synthetic copy; no generated application screenshot.

### Section 6 — Separate pinned Kestra run sequence

**Composition:** A dedicated GSAP `ScrollTrigger` pinned sequence after the snap chapter, never nested inside it. Bespoke adaptation of `vertical-grid-walkthrough` for process progression. Do not pin any preceding or following section.

- **Outer scroll track:** `relative h-[360vh] bg-[var(--bg-primary)]`; on mobile or reduced motion use ordinary-flow panels and do not pin.
- **Pinned frame:** `sticky top-0 h-[100dvh] overflow-hidden`; inner container `mx-auto grid h-full w-full max-w-[90rem] grid-cols-1 items-center gap-8 px-4 sm:px-6 md:px-8 lg:grid-cols-12 lg:px-12 xl:px-16`.
- **Left column:** `lg:col-span-4`; eyebrow “INSIDE THE KESTRA RUN”; h2 “A traceable path from event to review.” classes `mt-5 max-w-[10ch] font-display text-4xl leading-[0.94] tracking-[-0.04em] text-[var(--text-primary)] text-balance md:text-6xl`; small copy `mt-5 max-w-[40ch] font-body text-sm leading-7 text-[var(--text-secondary)]`.
- **Right sequence canvas:** `relative min-h-[24rem] overflow-hidden border-y border-[var(--border-default)] py-6 lg:col-span-7 lg:col-start-6 lg:min-h-[34rem] lg:py-8`.
- **Four sequence scenes:** use the same exact frame class `absolute inset-0 grid grid-cols-1 content-center gap-6 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center md:gap-8`; each has numbered label (`font-mono text-xs tracking-[0.12em] text-[var(--accent)]`), h3 (`font-display text-3xl leading-[0.98] tracking-[-0.035em] text-[var(--text-primary)] md:text-5xl`), body (`max-w-[46ch] font-body text-sm leading-6 text-[var(--text-secondary)]`), and right-side inline SVG/data output (`w-full max-w-[14rem] text-[var(--accent)]`).
  1. **00–24% — Intake:** webhook or file adapter → normalised event. Text: “Preserve the source; validate the event contract.”
  2. **24–49% — Deterministic scope:** evaluate policy and shipment/lot links. Text: “The rule engine identifies candidate exposure and flags missing evidence.”
  3. **49–74% — Draft:** optional AI narrative from the evidence pack. Text: “The model can draft cited text; it cannot set scope or choose disposition.”
  4. **74–100% — Human pause and record:** Kestra waits for a structured human choice and rationale, then records a sample run output. Text: “No release side effect is connected in this prototype.”
- **GSAP/ScrollTrigger values:** trigger is the outer track; `start: "top top"`; `end: () => "+=" + Math.round(window.innerHeight * 3)`; `pin: pinnedFrame`; `pinSpacing: true`; `scrub: 0.65`; `anticipatePin: 1`; `invalidateOnRefresh: true`; `toggleActions: "play none none reverse"`; `markers: false`. Use `gsap.matchMedia()` and disable pin below 768px or for reduced motion. Sequence visual motion uses `ease: "none"` so it stays tied to scroll.
- **Timeline states:** all scenes begin `{ opacity: 0, y: 18 }`. For each scene: enter from opacity 0/y 18 to opacity 1/y 0 over 0.09 normalized timeline units; hold at opacity 1; exit to opacity 0/y -10 over the final 0.05 before the next scene. Normalized scene windows: 0.00–0.24, 0.24–0.49, 0.49–0.74, 0.74–1.00. The first scene is visible at progress 0; the last remains visible at progress 1. A small active-step indicator changes at 0.00, 0.24, 0.49, and 0.74. No spring or bounce in the scroll-linked timeline.
- **Flowline:** one inline SVG path behind the four steps; initial `strokeDashoffset: pathLength`, final `strokeDashoffset: 0`, mapped linearly over progress 0.03–0.95. `aria-hidden="true"`; accessible sequence labels remain in DOM.
- **Z-stack:** z-0 background; z-10 pinned content; z-20 active-step indicator; z-[200] header remains above; no image/video layer in this section.
- **Reduced-motion/mobile fallback:** `h-auto` outer track; four scenes become static `relative` rows with `min-h-[68dvh]` and normal page scroll, no pin, no path draw, all labels visible.
- **Asset brief:** no external image/video. Inline vector flowline only.

### Section 7 — Final CTA

- **Section:** `relative z-10 overflow-hidden border-t border-[var(--border-default)] bg-[var(--bg-secondary)] py-24 md:py-32`
- **Container:** shared public section container plus `grid grid-cols-1 items-end gap-8 md:grid-cols-12`.
- **Copy column:** `md:col-span-8`; eyebrow “START WITH A SYNTHETIC EVENT”; h2 “Review the path before trusting the result.” classes `mt-5 max-w-[12ch] font-display text-4xl leading-[0.94] tracking-[-0.04em] text-[var(--text-primary)] text-balance sm:text-5xl md:text-7xl`; supporting text `mt-5 max-w-[54ch] font-body text-sm leading-7 text-[var(--text-secondary)] md:text-base`.
- **Action column:** `md:col-span-4 md:flex md:justify-end`; shared Primary button “Run sample event” → `/demo?fixture=excursion-01`.
- **Z-stack:** z-0 surface; z-10 content.
- **Animation:** repeatable fade-up, 650ms, ease-out, 40ms stagger between copy and CTA.
- **Asset brief:** none. Do not add an unapproved looping video or decorative gradient.

### Section 8 — Footer

- **Footer:** `relative z-10 border-t border-[var(--border-default)] bg-[var(--bg-primary)] py-8 md:py-10`
- **Container:** shared public section container; `grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start`.
- **Wordmark block:** `md:col-span-4`; plain “Lotline” in `font-display text-2xl tracking-[-0.04em] text-[var(--text-primary)]`; below, `mt-3 max-w-[36ch] font-body text-xs leading-5 text-[var(--text-muted)]` copy “Open workflow blueprint and synthetic operator demo.”
- **Footer links:** `grid grid-cols-2 gap-3 font-body text-sm text-[var(--text-secondary)] md:col-span-4`; links “Workflow” → `#workflow`, “Operator demo” → `/demo`, “Safety boundary” → `#human-review`, “Kestra Blueprints” → upstream repository only. Add a Lotline source-repository link only after its URL exists; never leave a dead placeholder link.
- **Safety note:** `md:col-span-4 md:col-start-9 font-mono text-[0.62rem] leading-5 text-[var(--text-muted)]`; copy “Synthetic data only · Prototype · Not validated for regulated use · No automated release”.
- **Z-stack:** z-0 background; z-10 content.
- **Asset brief:** none.

---

## 4. Operator demo route — `/demo`

The public page may be cinematic; the operator interface is deliberately static, compact, and calm. No video, no signup, no patient/product data import, and no persistent real-data storage. The only selectable input is the labelled synthetic fixture. If a Kestra instance is connected, the UI calls it through server-side routes; otherwise it must visibly identify itself as a UI-only simulation.

### 4.1 App shell

- **Root:** `min-h-[100dvh] bg-[var(--bg-primary)] text-[var(--text-primary)]`
- **Skip link (first focusable element):** `sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[600] focus:rounded-md focus:bg-[var(--accent)] focus:px-4 focus:py-3 focus:text-sm focus:text-[var(--text-inverse)]`; text “Skip to main content”.
- **Header:** `sticky top-0 z-[200] flex h-16 items-center justify-between border-b border-[var(--border-default)] bg-[oklch(0.155_0.014_254_/_0.94)] px-4 backdrop-blur-md md:px-6 lg:px-8`.
- **Header wordmark:** plain “Lotline” with `font-display text-xl tracking-[-0.04em]`; adjacent route label `font-body text-xs text-[var(--text-secondary)]` “Operator demo”.
- **Safety banner:** `inline-flex min-h-8 items-center gap-2 rounded-full border border-[var(--accent-quiet)] px-3 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-[var(--accent)]`; text “SYNTHETIC DATA ONLY”. On narrow view, show full label in a second line rather than abbreviate it.
- **Desktop content layout ≥1024px:** `mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-[100rem] grid-cols-1 lg:grid-cols-[14rem_minmax(0,1fr)]`; left step rail is an `aside`; main content is `min-w-0 px-4 py-6 sm:px-6 md:py-8 lg:px-8 xl:px-10`.
- **Mobile/tablet:** one column; replace left rail with a labelled, horizontally scrollable stepper `overflow-x-auto`; no desktop sidebar squeezed onto mobile.

### 4.2 Step rail and navigation

- **Aside:** `hidden border-r border-[var(--border-subtle)] px-4 py-6 lg:block`.
- **Aside heading:** `font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-muted)]`; text “SAMPLE REVIEW”.
- **Step list:** `mt-5 flex flex-col gap-1`; each step button `flex min-h-11 items-center gap-3 rounded-lg px-3 text-left font-body text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] aria-[current=step]:bg-[var(--bg-surface)] aria-[current=step]:text-[var(--text-primary)]`.
- **Steps:** Event, Evidence, Candidate lots, Draft, Human decision, Run record. Current/completed states must include text/icons; not colour alone.
- **Aside footer:** `mt-8 border-t border-[var(--border-subtle)] pt-4 font-mono text-[0.62rem] leading-5 text-[var(--text-muted)]`; text “No live inventory connection · No lot status changes”.

### 4.3 Main page content and controls

- **Page title row:** `flex flex-col gap-4 border-b border-[var(--border-default)] pb-6 md:flex-row md:items-end md:justify-between`; h1 `font-display text-3xl leading-[0.96] tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl md:text-5xl`; copy “Cold-chain excursion review”. Right controls show Kestra connection state and `Run`/`Simulation` label.
- **Fixture selector:** labelled visible `<select>`; field class `min-h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3 font-body text-sm text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:max-w-[22rem]`; only option “Synthetic excursion fixture · EVT-DEMO-017”. Do not allow arbitrary uploaded events in the public demo.
- **Fixture detail strip:** `mt-6 grid grid-cols-1 border-y border-[var(--border-default)] sm:grid-cols-3`; each data cell `flex min-h-20 flex-col justify-center gap-2 border-b border-[var(--border-subtle)] py-4 sm:px-4 sm:last:border-b-0`; label `font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-muted)]`; value `font-mono text-sm text-[var(--text-primary)]`. Values: “09:14–09:37 UTC”, “Peak 11.2°C”, “Policy 2.0–8.0°C”; every group includes the `SYNTHETIC` context label in the page banner.
- **Run action row:** `mt-6 flex flex-col gap-3 sm:flex-row sm:items-center`; primary shared button “Send sample event to Kestra”; text link “Reset demo”. If no Kestra is connected, button label becomes “Run UI-only simulation” and the adjacent notice says “No Kestra execution will be created”.
- **Execution status:** a semantic ordered list with `mt-8 grid grid-cols-1 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-default)]`; each step `grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-4`; status uses icon + accessible text (`Waiting`, `Running`, `Paused for review`, `Complete`, `Failed`). Live changes use `aria-live="polite"` and never rely on a blinking indicator.
- **Evidence section:** h2 “Readings and policy”; chart and evidence rows reuse Section 4 tokens and exact chart classes. Missing data is shown as `Review required` with a text reason.
- **Candidate lot table:** semantic `<table>`; wrapper `mt-4 overflow-x-auto border-y border-[var(--border-default)]`; table `w-full min-w-[36rem] border-collapse text-left`; headers `border-b border-[var(--border-default)] px-3 py-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-muted)]`; cells `border-b border-[var(--border-subtle)] px-3 py-4 font-body text-sm text-[var(--text-secondary)]`; lot IDs `font-mono text-sm text-[var(--text-primary)]`. Column headers: Lot, Link to event, Scope status. Avoid card-per-row.
- **AI narrative panel:** reuse Section 5 draft column classes. Provide mode select with options “Template fallback (default)” and “External model — synthetic fixture only”. The external option is hidden/disabled unless the server explicitly enables it. In all modes show “Draft, not a disposition” and source references. If the model is disabled or fails, show a deterministic template with a reason; never silently label a template as AI-generated.
- **Evidence detail interaction:** evidence references are buttons with visible IDs. Activate a non-blocking inline details region or accessible modal; if modal, focus moves inside on open and returns to the opener on close. Show source type, timestamp, policy version, and missing/known state—not unverified facts.
- **Human review form:** appears only when the connected Kestra execution is `PAUSED`, or in the clearly labelled UI simulation.
  - Form wrapper `mt-8 border-t border-[var(--border-default)] pt-6`.
  - Visible fieldset legend `font-body text-base font-semibold text-[var(--text-primary)]`; text “Record a sample human disposition”.
  - Options use labelled radio rows `flex min-h-12 items-start gap-3 border-b border-[var(--border-subtle)] py-3 font-body text-sm text-[var(--text-primary)]`; focus ring matches global focus. Options: “Maintain hold”, “Escalate for quality review”, “Record simulated release”. The release option includes persistent helper text “Simulation only—no inventory system is changed.”
  - Rationale textarea has visible label; class `mt-2 min-h-28 w-full resize-y rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] p-3 font-body text-sm leading-6 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]`; required in demo and validated on blur, not every keystroke.
  - Submit button text “Record sample decision”; on submit the connected Kestra route resumes the paused synthetic run. In UI-only mode it records only in the current browser session. Confirmation appears within 300ms.
- **Run/audit record:** semantic timeline with `mt-8 border-t border-[var(--border-default)]`; rows `grid grid-cols-[8rem_minmax(0,1fr)] gap-4 border-b border-[var(--border-subtle)] py-3`; time/IDs Mono, event text Body. Show execution ID, source adapter, policy version, candidate-scope result, AI mode, decision/rationale, and run outcome. Use the reviewer identity returned by Kestra only when actually connected; in simulation use `DEMO-REVIEWER-01` and label it simulated. “Execution record” is not called a validated or immutable audit trail.
- **Toasts:** `fixed bottom-4 right-4 z-[500] max-w-[min(24rem,calc(100vw-2rem))] rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3 font-body text-sm text-[var(--text-primary)] shadow-[0_16px_48px_oklch(0.79_0.17_79_/_0.08)]`; use status icon and text. Do not hide errors after an inaccessible timeout.

### 4.4 Demo states, network boundary, and empty/error behavior

1. **Ready:** fixture selected; no run yet; explains what happens when sent.
2. **Running:** progress text, current Kestra step, and “Cancel demo run” if the backend supports safe cancellation.
3. **Paused for review:** evidence, candidate lots, and source-linked draft visible; human form enabled.
4. **Complete:** disposition recorded, with “sample only” banner and event/run record.
5. **Malformed fixture / invalid policy / missing readings:** show the failed validation stage, cause, and next action. Do not infer a safe result.
6. **Missing lot map/calibration:** show `REVIEW REQUIRED`, list what is missing, and do not silently narrow scope.
7. **Kestra unavailable:** clearly label local UI-only simulation or offer a retry; never render a fake Kestra run ID.
8. **AI provider unavailable:** keep deterministic template and cite its source fields; no event failure solely because optional AI is down.

Only the server-side Next.js route may call Kestra. No Kestra token, webhook key, or LLM key goes to browser code. Default AI mode is `template`; outbound AI is off unless explicitly enabled and the input is the synthetic fixture. The demo has no real-data upload, no inventory/QMS connection, no user authentication, no third-party analytics, and no persistent operational data.

---

## 5. Responsive, accessibility, and performance contract

- **Breakpoints:** mobile `<640px`; compact tablet `640–767px`; tablet `768–1023px`; desktop `≥1024px`; wide desktop `≥1280px`.
- Use `min-h-[100dvh]` for viewport-height sections; never rely on `h-screen`/`min-h-screen` for the hero or pinned frame.
- Every positional/layout change has responsive variants. Mobile has no pinned section, no dense two-column table without horizontal scrolling, and no off-canvas content that traps the page.
- Add “Skip to main content” first on each route; preserve sequential heading levels; all controls keyboard reachable; visible 2px focus outline with 4px offset; keyboard order matches reading order.
- Every form control has a visible associated label; placeholder is supplementary only. Associate errors via `aria-describedby`, validate on blur, and focus the first invalid field after submit.
- Never encode status only by hue. Pair status with a word, icon, or pattern. All meaningful inline graphics have an accessible name/description; decorative SVGs use `aria-hidden="true"`.
- Reduced-motion behavior is specified in §1.6 and tested on both routes.
- Images/video have intrinsic dimensions/aspect ratio. Hero poster is eager; below-fold still images (if any are later approved) are lazy. This spec intentionally calls for no remote decorative images.
- Avoid third-party scripts, analytics, and external image/font dependencies in the in-app preview. The final browser build should bundle/self-host approved assets and fonts.
- Keep the marketing route's GSAP/motion code split from `/demo`; the operator route must not download video or pinning code.
- Chart and lot tables remain readable at 320px; do not scale the entire page down to fit.

---

## 6. Asset briefs and approval status

| Asset | Status | Brief / constraint |
|---|---|---|
| Hero video | **Pending** | See §3 Section 1. Source/create candidate and show it to Paul for approval before integration. 5–7 sec, 21:9, 1080p H.264, ≤10 MB, non-looping, no text/logos/surveillance styling. |
| Hero poster | **Pending** | Still frame from the eventually approved video; must also be shown before use. Center-safe crop and separate mobile crop only if needed. |
| Temperature trace | Specified | Inline SVG derived only from the synthetic fixture values in §3 Section 4. |
| Lot scope/evidence UI | Specified | Native HTML and inline SVG using fictional IDs. No screenshot asset. |
| Kestra flowline | Specified | Inline SVG path with semantic stage labels; no external illustration. |
| Logo/icon set | **Not required** | Text-only “Lotline” wordmark; inline SVG controls only. Ask Paul before adding any brand symbol or standalone logo. |

---

## 7. Spec self-check

- [x] All seven visual design gates recorded; no gate is silently re-opened.
- [x] Every named interface component and page section has concrete Tailwind class strings and responsive variants where layout changes.
- [x] Motion includes initial/animate states, duration, easing, delays, scroll thresholds, reset/replay behavior, and reduced-motion fallbacks.
- [x] Every section has an explicit z-index stack or inherits the documented section stack.
- [x] Every visual needing an asset has a brief; outstanding video/poster assets are clearly marked pending approval.
- [x] Relevant composition recipes are referenced; custom sections are explicitly bespoke.
- [x] Safety and AI boundaries are visible in both product copy and interface states.
- [ ] Actual video/poster asset reviewed and approved — **must happen before integration**.
- [x] Paul approved the documents on 2026-10-04.
- [ ] Separate implementation authorization — **Paul explicitly said not to write code; wait for a new instruction**.
*required before any application code is written**.
