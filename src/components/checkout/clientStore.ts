/**
 * Små klientvärden för kassan (e-post, rabattkod, "hämtar korg") som React läser via
 * useSyncExternalStore, samma mönster som varukorgen. På servern är allt tomt; i webbläsaren
 * läses de sparade värdena från localStorage första gången, så att inget sätts i en effekt.
 */
import { useSyncExternalStore } from "react";

const PERSISTED: Record<string, string> = { email: "metilde_email", code: "metilde_code" };
const values = new Map<string, string>();
const loaded = new Set<string>();
const listeners = new Set<() => void>();

const read = (key: string): string => {
  if (!loaded.has(key)) {
    loaded.add(key);
    const storageKey = PERSISTED[key];
    if (storageKey) {
      try {
        values.set(key, window.localStorage.getItem(storageKey) ?? "");
      } catch {
        values.set(key, "");
      }
    }
  }
  return values.get(key) ?? "";
};

export const clientValues = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get: (key: string) => read(key),
  set(key: string, value: string) {
    loaded.add(key);
    values.set(key, value);
    const storageKey = PERSISTED[key];
    if (storageKey) {
      try {
        if (value) window.localStorage.setItem(storageKey, value);
        else window.localStorage.removeItem(storageKey);
      } catch {
        /* lagring kan vara blockerad – värdet lever då bara i minnet */
      }
    }
    listeners.forEach((cb) => cb());
  },
};

export const useClientValue = (key: string) =>
  useSyncExternalStore(
    clientValues.subscribe,
    () => clientValues.get(key),
    () => "",
  );
