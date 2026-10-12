"use client";

import { useEffect, useSyncExternalStore } from "react";
import { readConsent, type Consent } from "@/lib/consent";

declare global {
  interface Window {
    uetq?: unknown[] & { push: (...args: unknown[]) => void };
    UET?: new (o: Record<string, unknown>) => unknown[] & { push: (...args: unknown[]) => void };
  }
}

/** Microsoft Advertisings UET-tagg (id från Verktyg → UET-tagg). Publikt. Tomt = avstängt. */
const TAG_ID = process.env.NEXT_PUBLIC_MS_UET_ID || "";

const subscribe = (cb: () => void) => {
  window.addEventListener("metilde:consent", cb);
  return () => window.removeEventListener("metilde:consent", cb);
};

let loaded = false;

/**
 * Laddar UET först när besökaren valt "Acceptera alla" – utan samtycke laddas ingenting
 * (Microsoft har inget cookiefritt läge motsvarande Googles). Sidbyten i appen räknas av
 * taggens egen SPA-spårning (enableAutoSpaTracking).
 */
function loadTag() {
  if (loaded || typeof window === "undefined" || !TAG_ID) return;
  loaded = true;
  const queue = (window.uetq = window.uetq || ([] as unknown as NonNullable<Window["uetq"]>));
  queue.push("consent", "default", { ad_storage: "granted" });
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://bat.bing.com/bat.js";
  s.onload = () => {
    if (!window.UET) return;
    const uet = new window.UET({ ti: TAG_ID, enableAutoSpaTracking: true, q: window.uetq });
    window.uetq = uet;
    uet.push("pageLoad");
  };
  document.head.appendChild(s);
}

/** Händelse till Microsoft (bara med samtycke; köas tills taggen laddat). */
export function microsoftTrack(action: string, params: Record<string, unknown> = {}) {
  if (!TAG_ID || readConsent() !== "all") return;
  loadTag();
  try {
    window.uetq?.push("event", action, params);
  } catch {
    /* taggen kan vara blockerad */
  }
}

/** Laddar taggen när samtycket finns och drar tillbaka det om besökaren ändrar sig. */
export function MicrosoftTag() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null as Consent | null);
  useEffect(() => {
    if (consent === "all") loadTag();
    else if (loaded) window.uetq?.push("consent", "update", { ad_storage: "denied" });
  }, [consent]);
  return null;
}

/**
 * Köp från tacksidan: Microsofts rekommenderade händelse "purchase" med ordervärde och valuta
 * (SEK, EUR, DKK – räknas aldrig om). Konverteringsmålet i Microsoft Ads sätts upp som
 * händelse med åtgärden "purchase" och variabelt intäktsvärde.
 */
export function MicrosoftPurchase({ orderNumber, value, currency }: { orderNumber: string; value: number; currency: string }) {
  useEffect(() => {
    microsoftTrack("purchase", { revenue_value: value, currency: currency.toUpperCase(), transaction_id: orderNumber });
  }, [orderNumber, value, currency]);
  return null;
}
