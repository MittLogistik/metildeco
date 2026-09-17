/** Skickar en statistikhändelse från webbläsaren. Misslyckas tyst. */
export type TrackEvent = "page_view" | "add_to_cart" | "begin_checkout";

export function track(event: TrackEvent) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ event });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
    }
  } catch {
    /* statistik får aldrig störa kunden */
  }
}
