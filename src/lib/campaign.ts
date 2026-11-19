/**
 * Tidsstyrd kampanj (Black Week). Katalogen sänker alla priser medan kampanjen pågår och
 * lägger det ordinarie priset som jämförpris – produktsidor, kort, korg, kassa och feeds följer
 * automatiskt. Före start och efter slut är butiken helt som vanligt, inget behöver återställas.
 *
 * Ingen fil här kräver server, så modulen används även i klientkomponenter (nedräkningen).
 * `CAMPAIGN_OFF=true` stänger av kampanjen direkt utan ny kod.
 */
import { roundPrice } from "./i18n";

export type Campaign = {
  id: string;
  /** Rabatt i procent på alla produkter och paket. */
  percent: number;
  /** ISO-tid med tidszon. */
  start: string;
  end: string;
};

export const BLACK_WEEK: Campaign = {
  id: "black-week-2026",
  percent: 25,
  start: "2026-11-19T00:00:00+01:00",
  end: "2026-11-30T23:59:59+01:00",
};

const campaigns: Campaign[] = [BLACK_WEEK];

/** Kampanjen som gäller vid `now`, annars null. */
export function activeCampaign(now = Date.now()): Campaign | null {
  if (typeof process !== "undefined" && process.env.CAMPAIGN_OFF === "true") return null;
  return campaigns.find((c) => now >= Date.parse(c.start) && now <= Date.parse(c.end)) ?? null;
}

/** Start eller slut som passerats inom `withinMs` (för cron som förnyar sidorna), annars null. */
export function campaignBoundaryNear(now: number, withinMs: number): string | null {
  for (const c of campaigns) {
    for (const t of [c.start, c.end]) {
      const d = now - Date.parse(t);
      if (d >= 0 && d <= withinMs) return `${c.id} ${t}`;
    }
  }
  return null;
}

/** Kampanjpris, avrundat som övriga priser i valutan. */
export const campaignPrice = (price: number, c: Campaign, currency: string): number =>
  roundPrice(price * (1 - c.percent / 100), currency);

/** Det som skickas till klienten (korg, nedräkning). */
export type CampaignInfo = Pick<Campaign, "id" | "percent" | "end">;

export const campaignInfo = (c: Campaign | null): CampaignInfo | null => (c ? { id: c.id, percent: c.percent, end: c.end } : null);
