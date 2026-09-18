"use client";

import { useId, useRef, useState } from "react";

export type Point = { date: string; value: number };
export type Unit = "count" | "sek" | "percent";

const formatters: Record<Unit, (v: number) => string> = {
  count: (v) => new Intl.NumberFormat("sv-SE").format(Math.round(v)),
  sek: (v) => (Math.abs(v) >= 10000 ? `${(v / 1000).toFixed(1).replace(".", ",")} tkr` : `${new Intl.NumberFormat("sv-SE").format(Math.round(v))} kr`),
  percent: (v) => `${v.toFixed(1).replace(".", ",")} %`,
};

const fmtDate = (iso: string) =>
  iso.includes("T")
    ? new Date(iso).toLocaleTimeString("sv-SE", { timeZone: "Europe/Stockholm", hour: "2-digit", minute: "2-digit" })
    : new Date(iso + "T00:00:00").toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
const niceTicks = (max: number): number[] => {
  if (max <= 0) return [0];
  const raw = max / 3;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? pow * 10;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step * 0.999; v += step) ticks.push(v);
  return ticks;
};

/**
 * En serie över tid: 2 px linje, 10 % områdesfyllning, ändpunkt, hårlinjer och
 * en korshårs-tooltip. Ett diagram per mått – aldrig två axlar.
 */
export function TrendChart({ points, unit, height = 120 }: { points: Point[]; unit: Unit; height?: number }) {
  const format = formatters[unit];
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = height;
  const padL = 36;
  const padR = 12;
  const padT = 10;
  const padB = 22;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(1, ...points.map((p) => p.value));
  const ticks = niceTicks(max);
  const yMax = ticks[ticks.length - 1] ?? max;
  const n = points.length;
  const x = (i: number) => padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => padT + innerH - (v / yMax) * innerH;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${path} L${x(n - 1).toFixed(1)},${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)},${(padT + innerH).toFixed(1)} Z`;
  const last = points[n - 1];
  const hovered = hover !== null ? points[hover] : null;
  const labelEvery = Math.max(1, Math.ceil(n / 6));

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - padL) / innerW) * (n - 1));
    setHover(Math.min(n - 1, Math.max(0, i)));
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none"
        role="img"
        aria-label={points[0]?.date.includes("T") ? "Utveckling per timme" : "Utveckling per dag"}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.14" />
            <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeWidth={1} />
            <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize={9} fill="var(--color-muted)">
              {format(t)}
            </text>
          </g>
        ))}
        {points.map((p, i) =>
          i % labelEvery === 0 || i === n - 1 ? (
            <text key={p.date} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize={9} fill="var(--color-muted)">
              {fmtDate(p.date)}
            </text>
          ) : null,
        )}
        {n > 1 ? <path d={area} fill={`url(#${id}-fill)`} /> : null}
        <path d={path} fill="none" stroke="var(--color-primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {last ? <circle cx={x(n - 1)} cy={y(last.value)} r={4} fill="var(--color-primary)" stroke="white" strokeWidth={2} /> : null}
        {hovered && hover !== null ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + innerH} stroke="var(--color-muted-soft)" strokeWidth={1} />
            <circle cx={x(hover)} cy={y(hovered.value)} r={5} fill="var(--color-primary)" stroke="white" strokeWidth={2} />
          </g>
        ) : null}
      </svg>
      {hovered && hover !== null ? (
        <div
          className="pointer-events-none absolute -top-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs shadow-card"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > n / 2 ? "-100%" : "0"})` }}
        >
          <span className="font-semibold tabular-nums">{format(hovered.value)}</span>
          <span className="ml-1.5 text-muted">{fmtDate(hovered.date)}</span>
        </div>
      ) : null}
    </div>
  );
}
