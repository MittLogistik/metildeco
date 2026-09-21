"use client";

import { useEffect } from "react";

/**
 * Fångar affiliateklick vid landning. Besökaren får ett id i localStorage som följer med
 * till kassan, och klickparametrarna skickas till servern en gång per klick-ID.
 *
 * Inget skickas härifrån till AddRevenue – webbläsaren pratar bara med vår egen server.
 */

const VISITOR_KEY = "metilde_vid";
const SENT_KEY = "metilde_click";
const CLICK_KEYS = ["adt_id", "adt_ei", "arid", "clickid", "click_id"];

/** Besökarens id, skapat vid första besöket. Används för att knyta klick till order. */
export function visitorId(): string | null {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    // Privat läge eller blockerad lagring: då går attributionen inte att spara
    return null;
  }
}

export function ClickTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clickId = CLICK_KEYS.map((k) => params.get(k)).find((v) => v && v.trim())?.trim();
    const id = visitorId();
    if (!clickId || !id) return;
    try {
      if (localStorage.getItem(SENT_KEY) === clickId) return;
    } catch {
      /* lagring blockerad – skicka ändå, servern tål dubbletter */
    }
    void fetch("/api/affiliate/click", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        visitorId: id,
        search: window.location.search,
        landingUrl: window.location.href.slice(0, 1000),
        referrer: document.referrer.slice(0, 1000) || null,
      }),
    })
      .then(() => {
        try {
          localStorage.setItem(SENT_KEY, clickId);
        } catch {
          /* strunt samma */
        }
      })
      .catch(() => undefined);
  }, []);
  return null;
}
