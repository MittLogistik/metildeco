"use client";

import { useEffect } from "react";
import { classifyLanding, type SourceState } from "@/lib/attribution";

/**
 * Fångar affiliateklick vid landning. Besökaren får ett id i localStorage som följer med
 * till kassan, och klickparametrarna skickas till servern en gång per klick-ID.
 *
 * Inget skickas härifrån till AddRevenue – webbläsaren pratar bara med vår egen server.
 */

const VISITOR_KEY = "metilde_vid";
const SENT_KEY = "metilde_click";
/** AddRevenue lägger på clickId, channelId och advertiserId på landningsadressen; äldre länkar använder adt_id/arid. */
const CLICK_KEYS = ["clickid", "adt_id", "adt_ei", "arid", "click_id"];

/** Skiftlägesokänslig uppslagning: AddRevenue skriver clickId, andra skriver clickid. */
const findParam = (params: URLSearchParams, keys: string[]): string | null => {
  for (const [key, value] of params.entries()) {
    if (keys.includes(key.toLowerCase()) && value.trim()) return value.trim();
  }
  return null;
};

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

const SOURCE_KEY = "metilde_src";

/** Varifrån besökaren kom (se lib/attribution). Null om lagringen är blockerad. */
export function storedSource(): SourceState | null {
  try {
    const raw = localStorage.getItem(SOURCE_KEY);
    return raw ? (JSON.parse(raw) as SourceState) : { first: null, last: null };
  } catch {
    return null;
  }
}

/** Klassar landningen och sparar den: första besöket en gång, senaste icke-direkta varje gång. */
function recordSource() {
  try {
    const state = storedSource();
    if (!state) return;
    const touch = classifyLanding(new URL(window.location.href), document.referrer);
    const next: SourceState = { first: state.first ?? touch ?? { ch: "direct", d: null, t: Date.now() }, last: touch ?? state.last };
    localStorage.setItem(SOURCE_KEY, JSON.stringify(next));
  } catch {
    /* lagring blockerad */
  }
}

export function ClickTracker() {
  useEffect(() => {
    recordSource();
    const params = new URLSearchParams(window.location.search);
    const clickId = findParam(params, CLICK_KEYS);
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
