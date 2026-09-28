"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { readConsent, type Consent } from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Google Ads-taggens id (AW-…). Publikt. Tomt = avstängt. */
const TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
/** Konverteringsetikett för Köp från Google Ads → Mål → Konverteringar → "Ställ in manuellt via kod". */
const PURCHASE_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL || "";

const subscribe = (cb: () => void) => {
  window.addEventListener("metilde:consent", cb);
  return () => window.removeEventListener("metilde:consent", cb);
};

/**
 * Laddar gtag.js första gången, med samtyckesläge (Consent Mode v2) satt till
 * beviljat eftersom taggen bara laddas efter "Acceptera alla". Anrop innan skriptet
 * hunnit ladda köas i dataLayer, precis som i Googles snippet.
 */
function ensureTag(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined" || !TAG_ID) return null;
  if (window.gtag) return window.gtag;
  window.dataLayer = window.dataLayer || [];
  const gtag = function (...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag = gtag;
  gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied", wait_for_update: 500 });
  gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("config", TAG_ID, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(TAG_ID)}`;
  document.head.appendChild(s);
  return gtag;
}

/** Skickar en händelse till Google-taggen. Gör ingenting utan marknadsföringssamtycke. */
export function googleTrack(name: string, params: Record<string, unknown> = {}) {
  if (readConsent() !== "all") return;
  const gtag = ensureTag();
  if (!gtag) return;
  try {
    gtag("event", name, params);
  } catch {
    /* taggen kan vara blockerad */
  }
}

/**
 * Köpkonvertering till Google Ads med ordernummer som transaction_id, så att en
 * omladdad tacksida inte räknas två gånger. Utan etikett skickas bara standardhändelsen
 * purchase, som syns i taggen men inte som konvertering i Google Ads.
 * E-posten ges till förbättrade konverteringar (user_data); taggen hashar den innan
 * den lämnar webbläsaren. Skickas bara med marknadsföringssamtycke, som allt annat här.
 */
export function googlePurchase(orderNumber: string, value: number, email?: string | null, currency = "SEK") {
  if (readConsent() !== "all") return;
  const gtag = ensureTag();
  if (!gtag) return;
  if (email) {
    try {
      gtag("set", "user_data", { email: email.trim().toLowerCase() });
    } catch {
      /* ignorera */
    }
  }
  if (PURCHASE_LABEL) googleTrack("conversion", { send_to: `${TAG_ID}/${PURCHASE_LABEL}`, value, currency, transaction_id: orderNumber });
  googleTrack("purchase", { transaction_id: orderNumber, value, currency });
}

/** Laddar Google-taggen efter samtycke och skickar page_view vid varje sidbyte. */
export function GoogleTag() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null as Consent | null);
  const pathname = usePathname();
  const enabled = Boolean(TAG_ID) && consent === "all";

  useEffect(() => {
    if (!enabled) return;
    googleTrack("page_view", { page_path: pathname });
  }, [enabled, pathname]);

  return null;
}

/** Köp från tacksidan. Körs bara en gång per ordernummer i webbläsaren. */
export function GooglePurchase({ orderNumber, value, email }: { orderNumber: string; value: number; email?: string | null }) {
  useEffect(() => {
    googlePurchase(orderNumber, value, email);
  }, [orderNumber, value, email]);
  return null;
}
