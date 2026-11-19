"use client";

import { useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/client";
import { blackWeek } from "@/i18n/messages/blackweek";

/** En gemensam sekundklocka för alla nedräkningar på sidan. */
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;
let now = 0;
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
};
const getSnapshot = () => now || Date.now();
// Servern ritar ingen tid (sidan är statisk) – siffrorna fylls i efter hydreringen
const getServerSnapshot = () => 0;

const parts = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
};
const pad = (n: number) => String(n).padStart(2, "0");

/** Tiden kvar till `end`. Efter slut visas ingenting. */
export function useTimeLeft(end: string) {
  const t = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (t === 0) return null;
  const left = Date.parse(end) - t;
  return left > 0 ? parts(left) : { d: 0, h: 0, m: 0, s: 0, ended: true as const };
}

/** Kompakt nedräkning för toppraden: "4 d 06:12:09". */
export function InlineCountdown({ end }: { end: string }) {
  const { locale } = useI18n();
  const u = blackWeek[locale].short;
  const left = useTimeLeft(end);
  // Platshållare med samma bredd så att raden inte hoppar vid hydrering
  if (!left) return <span className="inline-block min-w-[9ch] tabular-nums opacity-0">0 {u.d} 00:00:00</span>;
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {left.d > 0 ? `${left.d} ${u.d} ` : ""}
      {pad(left.h)}:{pad(left.m)}:{pad(left.s)}
    </span>
  );
}

/** Stora rutor för startsidans banner. */
export function BlockCountdown({ end }: { end: string }) {
  const { locale } = useI18n();
  const u = blackWeek[locale].long;
  const left = useTimeLeft(end);
  const cells: [number | null, string][] = [
    [left?.d ?? null, u.d],
    [left?.h ?? null, u.h],
    [left?.m ?? null, u.m],
    [left?.s ?? null, u.s],
  ];
  return (
    <div className="grid w-full max-w-md grid-cols-4 gap-2 sm:gap-3" role="timer" aria-live="off">
      {cells.map(([v, label]) => (
        <div key={label} className="rounded-2xl border border-white/15 bg-white/[0.06] px-2 py-3 text-center sm:py-4">
          <div className="font-display text-3xl font-semibold tabular-nums leading-none sm:text-5xl">{v === null ? "–" : pad(v)}</div>
          <div className="mt-1.5 truncate text-[10px] uppercase tracking-[0.14em] text-white/60 sm:text-xs">{label}</div>
        </div>
      ))}
    </div>
  );
}
