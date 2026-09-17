/**
 * Varukorgens lagring – en liten extern store som React läser via
 * useSyncExternalStore. På servern är korgen alltid tom; i webbläsaren
 * läses den från localStorage första gången den efterfrågas.
 */
import type { Plan } from "./types";

export type CartLine = {
  /** "product:<slug>:<plan>" eller "bundle:<slug>" */
  key: string;
  kind: "product" | "bundle";
  slug: string;
  qty: number;
  plan: Plan;
  /** Dagar mellan leveranser för prenumeration (30, 60 eller 90). */
  intervalDays?: 30 | 60 | 90;
};

const STORAGE_KEY = "metilde_cart";
const EMPTY: CartLine[] = [];

let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

const load = (): CartLine[] => {
  if (lines !== null) return lines;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    lines = Array.isArray(parsed) ? (parsed as CartLine[]) : EMPTY;
  } catch {
    lines = EMPTY;
  }
  return lines;
};

const persist = () => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines ?? EMPTY));
  } catch {
    /* lagring kan vara blockerad – korgen lever då bara i minnet */
  }
};

export const cartStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getSnapshot: (): CartLine[] => load(),
  getServerSnapshot: (): CartLine[] => EMPTY,
  set(next: CartLine[]) {
    lines = next;
    persist();
    listeners.forEach((cb) => cb());
  },
  update(fn: (prev: CartLine[]) => CartLine[]) {
    cartStore.set(fn(load()));
  },
};
