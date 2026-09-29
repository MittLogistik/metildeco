/** Skickar en statistikhändelse från webbläsaren. Misslyckas tyst. */
export type TrackEvent = "page_view" | "add_to_cart" | "begin_checkout" | "ab_view";

const AB_KEY = "metilde_ab_buybox";

/** Varianten i A/B-testet av köprutan följer med händelsen om kunden fått en. */
const variant = (): string | null => {
  try {
    const v = window.localStorage.getItem(AB_KEY);
    return v === "a" || v === "b" ? v : null;
  } catch {
    return null;
  }
};

export function track(event: TrackEvent, extra: { slug?: string; variant?: string } = {}) {
  if (typeof window === "undefined") return;
  try {
    const v = extra.variant ?? variant();
    const body = JSON.stringify({ event, ...(v ? { experiment: "buybox", variant: v } : {}), ...(extra.slug ? { slug: extra.slug } : {}) });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
    }
  } catch {
    /* statistik får aldrig störa kunden */
  }
}
