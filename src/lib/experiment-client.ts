/**
 * A/B-test av köprutan, klientsidan. Varianten lottas en gång per webbläsare och sparas i
 * localStorage, så att kunden ser samma köpruta på alla produktsidor och varianten kan
 * följa med ordern. ?ab=a eller ?ab=b i adressen tvingar en variant (för att titta själv).
 *
 * a = nuvarande köpruta, b = erbjudandet (prenumeration 1 / flerpack med gåva / engångsköp).
 */

export const EXPERIMENT = "buybox";
export type Variant = "a" | "b";
export type ExperimentMode = "off" | "ab" | "on";
const KEY = "metilde_ab_buybox";

let cached: Variant | null = null;

const read = (): Variant | null => {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "a" || v === "b" ? v : null;
  } catch {
    return null;
  }
};
const write = (v: Variant) => {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* lagring blockerad – varianten lever bara i minnet */
  }
};

/** Varianten för den här webbläsaren. Stabil under sidladdningen (useSyncExternalStore kräver det). */
export function buyboxVariant(mode: ExperimentMode, split: number): Variant {
  if (typeof window === "undefined") return "a";
  if (mode === "off") return "a";
  if (mode === "on") return "b";
  if (cached) return cached;
  const forced = new URLSearchParams(window.location.search).get("ab");
  if (forced === "a" || forced === "b") {
    write(forced);
    cached = forced;
    return forced;
  }
  const stored = read();
  if (stored) {
    cached = stored;
    return stored;
  }
  const v: Variant = Math.random() * 100 < split ? "b" : "a";
  write(v);
  cached = v;
  return v;
}

/** Varianten som ska följa med ordern: den kunden faktiskt fått, oavsett läge. */
export function storedVariant(): Variant | null {
  if (typeof window === "undefined") return null;
  return cached ?? read();
}

export const subscribeNoop = () => () => {};
