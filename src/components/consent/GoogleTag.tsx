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

const GRANTED = { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" };
const DENIED = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" };

/**
 * Laddar gtag.js en gång, för alla besökare, i Googles avancerade samtyckesläge (Consent Mode v2).
 * Utgångsläget är nekat: utan samtycke sätter taggen inga cookies och skickar bara anonyma,
 * cookiefria signaler som Google använder för att modellera konverteringar. Samtycket uppdateras
 * till beviljat när besökaren väljer "Acceptera alla", och tillbaka till nekat om det dras in.
 */
function ensureTag(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined" || !TAG_ID) return null;
  if (window.gtag) return window.gtag;
  window.dataLayer = window.dataLayer || [];
  const gtag = function (...args: unknown[]) {
    // gtag.js läser arguments-objekt ur dataLayer, därför arguments och inte en vanlig array
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
    void args;
  };
  window.gtag = gtag;
  gtag("consent", "default", { ...DENIED, wait_for_update: 500 });
  // Inga annons-id i länkar och ingen personanpassning utan samtycke
  gtag("set", "ads_data_redaction", true);
  gtag("set", "url_passthrough", true);
  if (readConsent() === "all") gtag("consent", "update", GRANTED);
  gtag("js", new Date());
  gtag("config", TAG_ID, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(TAG_ID)}`;
  document.head.appendChild(s);
  return gtag;
}

/** Skickar en händelse till Google-taggen. Utan samtycke går den som anonym, cookiefri signal. */
export function googleTrack(name: string, params: Record<string, unknown> = {}) {
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
 * omladdad tacksida inte räknas två gånger. Skickas för alla köp: med samtycke räknas den
 * direkt, utan samtycke som cookiefri signal som Google modellerar.
 * E-posten till förbättrade konverteringar (user_data) ges bara med samtycke; taggen hashar
 * den innan den lämnar webbläsaren.
 */
export function googlePurchase(orderNumber: string, value: number, email?: string | null, currency = "SEK") {
  const gtag = ensureTag();
  if (!gtag) return;
  if (email && readConsent() === "all") {
    try {
      gtag("set", "user_data", { email: email.trim().toLowerCase() });
    } catch {
      /* ignorera */
    }
  }
  if (PURCHASE_LABEL) googleTrack("conversion", { send_to: `${TAG_ID}/${PURCHASE_LABEL}`, value, currency, transaction_id: orderNumber });
  googleTrack("purchase", { transaction_id: orderNumber, value, currency });
}

/** Laddar Google-taggen, håller samtycket i synk och skickar page_view vid varje sidbyte. */
export function GoogleTag() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null as Consent | null);
  const pathname = usePathname();

  // Samtycke ändrat: uppdatera taggen (beviljat vid "Acceptera alla", annars nekat)
  useEffect(() => {
    const gtag = ensureTag();
    if (!gtag) return;
    gtag("consent", "update", consent === "all" ? GRANTED : DENIED);
  }, [consent]);

  useEffect(() => {
    googleTrack("page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}

/** Köp från tacksidan. Körs en gång per ordernummer i webbläsaren. */
export function GooglePurchase({ orderNumber, value, email }: { orderNumber: string; value: number; email?: string | null }) {
  useEffect(() => {
    googlePurchase(orderNumber, value, email);
  }, [orderNumber, value, email]);
  return null;
}
