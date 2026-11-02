/** Fraktzoner och priser. Källa: /data/shipping_zones.json + shipping_rates.json. */
import zonesJson from "../../data/shipping_zones.json";
import ratesJson from "../../data/shipping_rates.json";
import { markets, type Locale } from "./i18n";

export type ShippingRate = {
  zone: string;
  method: string;
  label: string;
  description: string;
  price: number;
  freeOver: number | null;
  sortOrder: number;
};

type MethodLabels = Record<string, { label: string; description: string }>;

const methodLabels: Record<Locale, MethodLabels> = {
  sv: {
    varubrev: { label: "Varubrev", description: "Levereras i brevlådan, 1–3 arbetsdagar" },
    "tracked-letter": { label: "Spårbart brev", description: "Spårbar leverans i brevlådan, 1–3 arbetsdagar" },
    ombud: { label: "Paket till ombud", description: "Hämtas hos närmaste ombud, 1–3 arbetsdagar" },
  },
  fi: {
    varubrev: { label: "Kirje", description: "Toimitetaan postilaatikkoon, 2–5 arkipäivää" },
    "tracked-letter": { label: "Kirje seurannalla", description: "Seurattava toimitus postilaatikkoon, 2–5 arkipäivää" },
    ombud: { label: "Paketti noutopisteeseen", description: "Noudetaan lähimmästä noutopisteestä, 2–5 arkipäivää" },
  },
  da: {
    varubrev: { label: "Brev", description: "Leveres i postkassen, 2–5 hverdage" },
    "tracked-letter": { label: "Sporbart brev", description: "Sporbar levering i postkassen, 2–5 hverdage" },
    ombud: { label: "Pakke til udleveringssted", description: "Afhentes på nærmeste udleveringssted, 2–5 hverdage" },
  },
  nl: {
    varubrev: { label: "Brief", description: "Levering in de brievenbus, 3–6 werkdagen" },
    "tracked-letter": { label: "Brief met track & trace", description: "Traceerbare levering in de brievenbus, 3–6 werkdagen" },
    ombud: { label: "Pakket naar afhaalpunt", description: "Ophalen bij het dichtstbijzijnde afhaalpunt, 3–6 werkdagen" },
  },
  de: {
    varubrev: { label: "Brief", description: "Lieferung in den Briefkasten, 3–6 Werktage" },
    "tracked-letter": { label: "Brief mit Sendungsverfolgung", description: "Nachverfolgbare Lieferung in den Briefkasten, 3–6 Werktage" },
    ombud: { label: "Paket an Abholstelle", description: "Abholung an der nächsten Abholstelle, 3–6 Werktage" },
  },
  fr: {
    varubrev: { label: "Lettre", description: "Livraison en boîte aux lettres, 3 à 6 jours ouvrés" },
    "tracked-letter": { label: "Lettre suivie", description: "Livraison suivie en boîte aux lettres, 3 à 6 jours ouvrés" },
    ombud: { label: "Colis en point relais", description: "Retrait au point relais le plus proche, 3 à 6 jours ouvrés" },
  },
  en: {
    varubrev: { label: "Letter", description: "Delivered to your letterbox, 3–6 working days" },
    "tracked-letter": { label: "Tracked letter", description: "Tracked delivery to your letterbox, 3–6 working days" },
    ombud: { label: "Parcel to collection point", description: "Collect at your nearest collection point, 3–6 working days" },
  },
  pl: {
    varubrev: { label: "List", description: "Dostawa do skrzynki pocztowej, 3–6 dni roboczych" },
    "tracked-letter": { label: "List ze śledzeniem", description: "Śledzona dostawa do skrzynki pocztowej, 3–6 dni roboczych" },
    ombud: { label: "Paczka do punktu odbioru", description: "Odbiór w najbliższym punkcie, 3–6 dni roboczych" },
  },
};

type RawZone = { code: string; name: string; countries: string[]; active: boolean; sort_order: number };
type RawRate = {
  zone_code: string;
  method: string;
  currency: string;
  price: number;
  free_over: number | null;
  sort_order: number;
  active: boolean;
};

export const shippingZones = (zonesJson as RawZone[])
  .filter((z) => z.active)
  .sort((a, b) => a.sort_order - b.sort_order);

export const ratesForZone = (zone: string, currency = "SEK", locale: Locale = "sv"): ShippingRate[] =>
  (ratesJson as RawRate[])
    .filter((r) => r.active && r.zone_code === zone && r.currency === currency)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => ({
      zone: r.zone_code,
      method: r.method,
      label: methodLabels[locale][r.method]?.label ?? r.method,
      description: methodLabels[locale][r.method]?.description ?? "",
      price: Number(r.price),
      freeOver: r.free_over === null ? null : Number(r.free_over),
      sortOrder: r.sort_order,
    }));

/** Fraktsätten för en marknad, i marknadens valuta. */
export const ratesFor = (locale: Locale): ShippingRate[] => ratesForZone(markets[locale].shippingZone, markets[locale].currency, locale);

/** Billigaste fraktsättet för en marknad (gräns för fri frakt, frakt för prenumerationskorgar). */
export const cheapestRate = (locale: Locale): ShippingRate =>
  ratesFor(locale).reduce((best, r) => (r.price < best.price ? r : best));

/** Gränsen för fri frakt på en marknad. */
export const freeShippingOver = (locale: Locale): number => cheapestRate(locale).freeOver ?? 0;

export const swedenRates = ratesFor("sv");

export const cheapestSwedenRate: ShippingRate = cheapestRate("sv");

/** Fraktkostnad för ett valt fraktsätt givet varuvärde. */
export const shippingCost = (rate: ShippingRate, subtotal: number): number =>
  rate.freeOver !== null && subtotal >= rate.freeOver ? 0 : rate.price;

/** Fraktfria varianter av namnen, som de skrivs hos Stripe (lib/checkout). */
const freeWords: Record<Locale, { suffix: string; subscription: string }> = {
  sv: { suffix: "fri frakt", subscription: "Fri frakt – spårbart brev" },
  fi: { suffix: "ilmainen toimitus", subscription: "Ilmainen toimitus – kirje seurannalla" },
  da: { suffix: "fri fragt", subscription: "Fri fragt – sporbart brev" },
  nl: { suffix: "gratis verzending", subscription: "Gratis verzending – brief met track & trace" },
  de: { suffix: "kostenloser Versand", subscription: "Kostenloser Versand – Brief mit Sendungsverfolgung" },
  fr: { suffix: "livraison gratuite", subscription: "Livraison gratuite – lettre suivie" },
  en: { suffix: "free delivery", subscription: "Free delivery – tracked letter" },
  pl: { suffix: "darmowa wysyłka", subscription: "Darmowa wysyłka – list polecony ze śledzeniem" },
};

/**
 * Fraktsättets namn på svenska, oavsett kundens språk. Plocky mappar namnet mot en fraktmall,
 * så finska och danska namn skickas dit med samma svenska namn som tidigare ordrar.
 * Okända namn lämnas orörda.
 */
export function swedishShippingMethod(name: string | null): string | null {
  if (!name) return name;
  for (const l of Object.keys(methodLabels) as Locale[]) {
    if (name === freeWords[l].subscription) return freeWords.sv.subscription;
    for (const [method, { label }] of Object.entries(methodLabels[l])) {
      const sv = methodLabels.sv[method]!.label;
      if (name === label) return sv;
      if (name === `${label} – ${freeWords[l].suffix}`) return `${sv} – ${freeWords.sv.suffix}`;
    }
  }
  return name;
}
