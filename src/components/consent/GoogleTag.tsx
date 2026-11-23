"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useSyncExternalStore } from "react";
import { pickClickParams, withClickParams } from "@/lib/click-ids";
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
  // Gäller från första stund, före samtyckesvalet: annonsklicket följer med i adressen i stället för
  // i en cookie, och annonsdata rensas så länge samtycke saknas
  gtag("set", "url_passthrough", true);
  gtag("set", "ads_data_redaction", true);
  gtag("consent", "default", { ...DENIED, wait_for_update: 500 });
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
 * den innan den lämnar webbläsaren. `value` = ordervärdet exkl. frakt, `currency` = orderns valuta
 * (SEK, EUR, DKK, PLN) – värdet räknas aldrig om.
 */
export function googlePurchase(orderNumber: string, value: number, email: string | null | undefined, currency: string) {
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

/**
 * Annonsklickets parametrar (gclid m.fl.) från landningsadressen. Läses när skriptet laddas, innan
 * någon navigering hunnit ske, och hålls bara i minnet – aldrig i cookie eller localStorage.
 */
const landingClickParams: [string, string][] = typeof window === "undefined" ? [] : pickClickParams(window.location.search);

/**
 * url_passthrough dekorerar vanliga länkar, men Next.js navigerar med sin egen href (Link,
 * router.push), så parametrarna föll bort vid första sidbytet. Så länge besökaren inte har
 * godkänt cookies läggs de tillbaka i adressen efter varje navigering. Då kan taggen spara klicket
 * när samtycket ges, och köpet på tacksidan kan kopplas cookiefritt. Med samtycke ligger klicket
 * i Googles cookie och adressen lämnas orörd.
 */
function KeepClickParams({ consent }: { consent: Consent | null }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    if (consent === "all" || landingClickParams.length === 0) return;
    const next = withClickParams(new URL(window.location.href), landingClickParams);
    // Next.js synkar routern med history.replaceState, sidan laddas inte om
    if (next) window.history.replaceState(null, "", next.href);
  }, [pathname, search, consent]);
  return null;
}

/** Klickparametrarna i nuvarande adress, för kassans återkomstadress från Stripe. */
export const currentClickParams = (): Record<string, string> =>
  typeof window === "undefined" ? {} : Object.fromEntries(pickClickParams(window.location.search));

/** Laddar Google-taggen, håller samtycket i synk och skickar page_view vid varje sidbyte. */
export function GoogleTag() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null as Consent | null);
  const pathname = usePathname();

  // Samtycke ändrat: uppdatera taggen (beviljat vid "Acceptera alla", annars nekat).
  // null = serverns ögonblicksbild under hydreringen, inte ett val: då skickas ingenting. Annars
  // gick "nekat" ut mellan ensureTag:s "beviljat" och det riktiga värdet, och ett köp som
  // skickades just då (tacksidan) räknades som nekat och kopplades inte till annonsklicket.
  useEffect(() => {
    if (consent === null) return;
    const gtag = ensureTag();
    if (!gtag) return;
    gtag("consent", "update", consent === "all" ? GRANTED : DENIED);
  }, [consent]);

  useEffect(() => {
    googleTrack("page_view", { page_path: pathname });
  }, [pathname]);

  // useSearchParams kräver en Suspense-gräns för att sidorna ska kunna förrenderas statiskt
  return TAG_ID ? (
    <Suspense fallback={null}>
      <KeepClickParams consent={consent} />
    </Suspense>
  ) : null;
}

/** Köp från tacksidan. Körs en gång per ordernummer i webbläsaren. */
export function GooglePurchase({ orderNumber, value, currency, email }: { orderNumber: string; value: number; currency: string; email?: string | null }) {
  useEffect(() => {
    googlePurchase(orderNumber, value, email, currency.toUpperCase());
  }, [orderNumber, value, currency, email]);
  return null;
}
