"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { eventId, readConsent, type Consent } from "@/lib/consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const subscribe = (cb: () => void) => {
  window.addEventListener("metilde:consent", cb);
  return () => window.removeEventListener("metilde:consent", cb);
};

/**
 * Skickar en Meta-händelse via pixeln och Conversions API med samma event-id.
 * Gör ingenting utan marknadsföringssamtycke.
 */
export function metaTrack(name: "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase", params: Record<string, unknown> = {}, id?: string) {
  if (!PIXEL_ID || readConsent() !== "all") return;
  const eid = id ?? eventId();
  try {
    window.fbq?.("track", name, params, { eventID: eid });
  } catch {
    /* pixel kan vara blockerad */
  }
  try {
    const body = JSON.stringify({ name, params, eventId: eid, url: location.href });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/meta", new Blob([body], { type: "application/json" }));
    else void fetch("/api/meta", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch {
    /* ignorera */
  }
}

/** Laddar Meta Pixel efter samtycke och skickar PageView vid varje sidbyte. */
export function MetaPixel() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null as Consent | null);
  const pathname = usePathname();
  const enabled = Boolean(PIXEL_ID) && consent === "all";

  useEffect(() => {
    if (!enabled || !window.fbq) return;
    const eid = eventId();
    window.fbq("track", "PageView", {}, { eventID: eid });
    const body = JSON.stringify({ name: "PageView", params: {}, eventId: eid, url: location.href });
    void fetch("/api/meta", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => undefined);
  }, [enabled, pathname]);

  if (!enabled) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');`}
    </Script>
  );
}
