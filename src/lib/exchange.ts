import "server-only";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Växelkurser till SEK. Kursen sparas på ordern vid köptillfället, så att provision och
 * nettovinst kan räknas om i efterhand utan att dagens kurs påverkar gamla ordrar.
 *
 * Affiliatepostbacken skickas alltid i ordervalutan – kursen används bara för våra egna
 * sammanställningar.
 */

/** Reserv när tabellen inte svarar. Grova nivåer, bara för att inte tappa en order. */
const FALLBACK: Record<string, number> = { SEK: 1, EUR: 11.3, USD: 9.6, GBP: 13.2, DKK: 1.52, NOK: 0.95, PLN: 2.65 };

let cache: { at: number; rates: Record<string, number> } | null = null;

/** Alla kurser, cachade en kvart i processen. */
export async function rates(): Promise<Record<string, number>> {
  if (cache && Date.now() - cache.at < 900_000) return cache.rates;
  if (!supabaseConfigured()) return FALLBACK;
  const res = await supabaseAdmin().from("exchange_rates").select("currency,rate_to_sek");
  if (res.error || !res.data?.length) return FALLBACK;
  const map: Record<string, number> = { ...FALLBACK };
  for (const r of res.data as { currency: string; rate_to_sek: number | string }[]) {
    const rate = Number(r.rate_to_sek);
    if (Number.isFinite(rate) && rate > 0) map[r.currency.toUpperCase()] = rate;
  }
  cache = { at: Date.now(), rates: map };
  return map;
}

/** Kursen från valutan till SEK. Okänd valuta ger 1, så att beloppet aldrig blir noll. */
export async function rateToSek(currency: string): Promise<number> {
  const code = (currency || "SEK").toUpperCase();
  if (code === "SEK") return 1;
  const all = await rates();
  return all[code] ?? FALLBACK[code] ?? 1;
}
