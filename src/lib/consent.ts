/**
 * Cookiesamtycke. "necessary" = bara det som krävs för att butiken ska fungera.
 * "all" = även marknadsföring (Meta Pixel). Sparas i cookien metilde_consent i 12 månader.
 */
export type Consent = "necessary" | "all";
export const CONSENT_COOKIE = "metilde_consent";

export const readConsent = (): Consent | null => {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(necessary|all)`));
  return (m?.[1] as Consent | undefined) ?? null;
};

export const writeConsent = (c: Consent) => {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE}=${c}; Max-Age=${maxAge}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  window.dispatchEvent(new CustomEvent("metilde:consent", { detail: c }));
};

export const hasMarketingConsent = () => readConsent() === "all";

/** Slumpat event-id som delas mellan pixel och Conversions API för avduplicering. */
export const eventId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

/** Produkt-id i Meta-katalogen. Måste vara samma i feeden som i pixel-händelserna. */
export const metaContentId = (kind: "product" | "bundle", slug: string) => (kind === "bundle" ? `paket-${slug}` : slug);
