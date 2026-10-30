import { tracePath, traceReadings } from "@/lib/chart-data";

interface Props {
  compact?: boolean;
}

export function TemperatureTrace({ compact = false }: Props) {
  return (
    <figure className="w-full" aria-labelledby="trace-title" aria-describedby="trace-description">
      <figcaption className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mono-face text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">SYNTHETIC FIXTURE</p>
          <h3 id="trace-title" className="display-face mt-2 text-2xl tracking-[-0.03em] text-[var(--text-primary)] md:text-3xl">Observed temperature trace</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Configured band 2.0–8.0°C · no values interpolated</p>
        </div>
        <span className="mono-face text-xs text-[var(--text-secondary)]">EVT-DEMO-017</span>
      </figcaption>
      <svg className={`block w-full overflow-visible ${compact ? "h-48" : "h-[14rem] md:h-[19rem]"}`} viewBox="0 0 760 300" role="img" aria-labelledby="trace-title trace-description">
        <desc id="trace-description">Synthetic trace from 09:00 to 09:37 UTC. It starts at 2.6 degrees Celsius, rises above the configured upper bound at 09:14, peaks at 11.2, then returns to 7.8.</desc>
        <rect className="chart-range" x="72" y="138" width="550" height="126" rx="3" />
        {[60, 138, 213, 264].map((y) => <line key={y} className="chart-grid" x1="72" x2="622" y1={y} y2={y} />)}
        <line className="chart-grid" x1="72" x2="72" y1="52" y2="264" />
        <line className="chart-grid" x1="622" x2="622" y1="52" y2="264" />
        <text x="22" y="64" fill="var(--text-muted)" fontFamily="var(--font-mono-family)" fontSize="12">12°C</text>
        <text x="22" y="142" fill="var(--accent)" fontFamily="var(--font-mono-family)" fontSize="12">8°C</text>
        <text x="22" y="268" fill="var(--text-muted)" fontFamily="var(--font-mono-family)" fontSize="12">2°C</text>
        <text x="500" y="159" fill="var(--accent)" fontFamily="var(--font-mono-family)" fontSize="11">Configured range</text>
        <path d={tracePath} className="chart-path" pathLength={1} />
        {traceReadings.map((reading, index) => {
          const points = [[84, 213], [278, 133], [390, 93], [598, 141]];
          const [cx, cy] = points[index];
          return <g key={reading.id}>
            <circle cx={cx} cy={cy} r="5" className={reading.temperature > 8 ? "chart-excursion" : "chart-reading"} />
            <text x={cx} y="286" textAnchor="middle" fill="var(--text-muted)" fontFamily="var(--font-mono-family)" fontSize="11">{reading.time}</text>
          </g>;
        })}
        {!compact && <path d="M 278 119 L 278 78 M 598 126 L 598 78 M 278 78 L 598 78" fill="none" stroke="var(--accent)" strokeWidth="1.5" />}
      </svg>
      <p className="mt-4 font-mono text-xs leading-5 text-[var(--text-muted)]">Observed window 09:14–09:37 UTC · Peak 11.2°C · calibration reference missing</p>
    </figure>
  );
}
