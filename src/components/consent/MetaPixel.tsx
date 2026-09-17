"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { eventId, readConsent, type Consent } from "@/lib/consent";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; push: unknown; loaded: boolean; version: string };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/** Publikt pixel-ID. Miljövariabeln kan skriva över, t.ex. för en testpixel. */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1606920894391393";

const subscribe = (cb: () => void) => {
  window.addEventListener("metilde:consent", cb);
  return () => window.removeEventListener("metilde:consent", cb);
};

/**
 * Skapar fbq-kön och laddar fbevents.js första gången (samma som Metas snippet).
 * Anrop före laddning köas, så inget PageView går förlorat.
 */
function ensurePixel(): Fbq | null {
  if (typeof window === "undefined" || !PIXEL_ID) return null;
  if (window.fbq) return window.fbq;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as Fbq;
  n.queue = [];
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  n("init", PIXEL_ID);
  return n;
}

const post = (body: string) => {
  try {
    if (navigator.sendBeacon) navigator.sendBeacon("/api/meta", new Blob([body], { type: "application/json" }));
    else void fetch("/api/meta", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch {
    /* ignorera */
  }
};

/**
 * Skickar en Meta-händelse via pixeln och Conversions API med samma event-id.
 * Gör ingenting utan marknadsföringssamtycke.
 */
export function metaTrack(name: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase" | "Subscribe", params: Record<string, unknown> = {}, id?: string) {
  if (readConsent() !== "all") return;
  const fbq = ensurePixel();
  if (!fbq) return;
  const eid = id ?? eventId();
  try {
    fbq("track", name, params, { eventID: eid });
  } catch {
    /* pixel kan vara blockerad */
  }
  post(JSON.stringify({ name, params, eventId: eid, url: location.href }));
}

/** Laddar Meta Pixel efter samtycke och skickar PageView vid varje sidbyte. */
export function MetaPixel() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null as Consent | null);
  const pathname = usePathname();
  const enabled = Boolean(PIXEL_ID) && consent === "all";

  useEffect(() => {
    if (!enabled) return;
    metaTrack("PageView");
  }, [enabled, pathname]);

  return null;
}
