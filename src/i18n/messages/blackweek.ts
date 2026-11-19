/**
 * Black Week (lib/campaign): toppraden, startsidans banner, märken, korg och produktsida.
 * Visas bara medan kampanjen pågår. Belopp och datum formateras innan de skickas in.
 * Inga hälsopåståenden – bara rabatt, tid och villkor.
 */
import type { Locale } from "@/lib/i18n";

const sv = {
  name: "Black Week",
  /** Toppraden. */
  bar: (pct: number) => `${pct} % på alla produkter och paket`,
  endsIn: "Slutar om",
  /** Nedräkningens enheter: kort form i toppraden, lång under siffrorna på startsidan. */
  short: { d: "d", h: "h", m: "m", s: "s" },
  long: { d: "dagar", h: "timmar", m: "minuter", s: "sekunder" },
  heroTitle: (pct: number) => `${pct} % på allt`,
  heroLead: (end: string) =>
    `Alla produkter och paket. Engångsköp och första leveransen av en prenumeration. Gäller till och med ${end}.`,
  heroCta: "Handla nu",
  heroSub: "Se paketen",
  terms: "Kan inte kombineras med andra rabatter.",
  /** Märke på produktkort och paket. */
  badge: (pct: number) => `−${pct} %`,
  /** Etikett på korgrader. */
  cartLabel: (pct: number) => `Black Week −${pct} %`,
  /** Prisangivelse enligt EU:s regler för prissänkningar. */
  lowestPrice: (price: string) => `Lägsta pris senaste 30 dagarna: ${price}`,
  /** Prenumeration: första leveransen till kampanjpris, sedan vanlig prenumerationsrabatt. */
  subThen: (price: string) => `Första leveransen. Därefter ${price}/st.`,
  ordinary: (price: string) => `Ord. ${price}`,
};

export type BlackWeekMessages = typeof sv;

export const blackWeek: Record<Locale, BlackWeekMessages> = {
  sv,
  fi: {
    name: "Black Week",
    bar: (pct) => `${pct} % kaikista tuotteista ja paketeista`,
    endsIn: "Päättyy",
    short: { d: "pv", h: "h", m: "min", s: "s" },
    long: { d: "päivää", h: "tuntia", m: "minuuttia", s: "sekuntia" },
    heroTitle: (pct) => `${pct} % kaikesta`,
    heroLead: (end) =>
      `Kaikki tuotteet ja paketit. Kertaostokset ja kestotilauksen ensimmäinen toimitus. Voimassa ${end} asti.`,
    heroCta: "Osta nyt",
    heroSub: "Katso paketit",
    terms: "Ei voi yhdistää muihin alennuksiin.",
    badge: (pct) => `−${pct} %`,
    cartLabel: (pct) => `Black Week −${pct} %`,
    lowestPrice: (price) => `Alin hinta viimeisten 30 päivän aikana: ${price}`,
    subThen: (price) => `Ensimmäinen toimitus. Sen jälkeen ${price}/kpl.`,
    ordinary: (price) => `Norm. ${price}`,
  },
  da: {
    name: "Black Week",
    bar: (pct) => `${pct} % på alle produkter og pakker`,
    endsIn: "Slutter om",
    short: { d: "d", h: "t", m: "m", s: "s" },
    long: { d: "dage", h: "timer", m: "minutter", s: "sekunder" },
    heroTitle: (pct) => `${pct} % på alt`,
    heroLead: (end) =>
      `Alle produkter og pakker. Enkeltkøb og første levering af et abonnement. Gælder til og med ${end}.`,
    heroCta: "Køb nu",
    heroSub: "Se pakkerne",
    terms: "Kan ikke kombineres med andre rabatter.",
    badge: (pct) => `−${pct} %`,
    cartLabel: (pct) => `Black Week −${pct} %`,
    lowestPrice: (price) => `Laveste pris de seneste 30 dage: ${price}`,
    subThen: (price) => `Første levering. Derefter ${price}/stk.`,
    ordinary: (price) => `Norm. ${price}`,
  },
  nl: {
    name: "Black Week",
    bar: (pct) => `${pct}% op alle producten en pakketten`,
    endsIn: "Eindigt over",
    short: { d: "d", h: "u", m: "m", s: "s" },
    long: { d: "dagen", h: "uur", m: "minuten", s: "seconden" },
    heroTitle: (pct) => `${pct}% op alles`,
    heroLead: (end) =>
      `Alle producten en pakketten. Losse aankopen en de eerste levering van een abonnement. Geldig tot en met ${end}.`,
    heroCta: "Shop nu",
    heroSub: "Bekijk de pakketten",
    terms: "Niet te combineren met andere kortingen.",
    badge: (pct) => `−${pct}%`,
    cartLabel: (pct) => `Black Week −${pct}%`,
    lowestPrice: (price) => `Laagste prijs in de afgelopen 30 dagen: ${price}`,
    subThen: (price) => `Eerste levering. Daarna ${price}/st.`,
    ordinary: (price) => `Normaal ${price}`,
  },
  de: {
    name: "Black Week",
    bar: (pct) => `${pct} % auf alle Produkte und Sets`,
    endsIn: "Endet in",
    short: { d: "T", h: "Std", m: "Min", s: "Sek" },
    long: { d: "Tage", h: "Stunden", m: "Minuten", s: "Sekunden" },
    heroTitle: (pct) => `${pct} % auf alles`,
    heroLead: (end) =>
      `Alle Produkte und Sets. Einzelkäufe und die erste Lieferung eines Abos. Gültig bis einschließlich ${end}.`,
    heroCta: "Jetzt einkaufen",
    heroSub: "Zu den Sets",
    terms: "Nicht mit anderen Rabatten kombinierbar.",
    badge: (pct) => `−${pct} %`,
    cartLabel: (pct) => `Black Week −${pct} %`,
    lowestPrice: (price) => `Niedrigster Preis der letzten 30 Tage: ${price}`,
    subThen: (price) => `Erste Lieferung. Danach ${price}/Stk.`,
    ordinary: (price) => `Statt ${price}`,
  },
  fr: {
    name: "Black Week",
    bar: (pct) => `−${pct} % sur tous les produits et coffrets`,
    endsIn: "Se termine dans",
    short: { d: "j", h: "h", m: "min", s: "s" },
    long: { d: "jours", h: "heures", m: "minutes", s: "secondes" },
    heroTitle: (pct) => `−${pct} % sur tout`,
    heroLead: (end) =>
      `Tous les produits et coffrets. Achats uniques et première livraison d’un abonnement. Valable jusqu’au ${end} inclus.`,
    heroCta: "J’en profite",
    heroSub: "Voir les coffrets",
    terms: "Non cumulable avec d’autres réductions.",
    badge: (pct) => `−${pct} %`,
    cartLabel: (pct) => `Black Week −${pct} %`,
    lowestPrice: (price) => `Prix le plus bas des 30 derniers jours : ${price}`,
    subThen: (price) => `Première livraison. Ensuite ${price}/unité.`,
    ordinary: (price) => `Au lieu de ${price}`,
  },
  en: {
    name: "Black Week",
    bar: (pct) => `${pct}% off all products and bundles`,
    endsIn: "Ends in",
    short: { d: "d", h: "h", m: "m", s: "s" },
    long: { d: "days", h: "hours", m: "minutes", s: "seconds" },
    heroTitle: (pct) => `${pct}% off everything`,
    heroLead: (end) =>
      `All products and bundles. One-off purchases and the first delivery of a subscription. Valid until ${end} inclusive.`,
    heroCta: "Shop now",
    heroSub: "See the bundles",
    terms: "Cannot be combined with other discounts.",
    badge: (pct) => `−${pct}%`,
    cartLabel: (pct) => `Black Week −${pct}%`,
    lowestPrice: (price) => `Lowest price in the last 30 days: ${price}`,
    subThen: (price) => `First delivery. Then ${price} each.`,
    ordinary: (price) => `Was ${price}`,
  },
  pl: {
    name: "Black Week",
    bar: (pct) => `−${pct}% na wszystkie produkty i zestawy`,
    endsIn: "Kończy się za",
    short: { d: "d", h: "godz", m: "min", s: "s" },
    long: { d: "dni", h: "godzin", m: "minut", s: "sekund" },
    heroTitle: (pct) => `−${pct}% na wszystko`,
    heroLead: (end) =>
      `Wszystkie produkty i zestawy. Zakupy jednorazowe i pierwsza dostawa w subskrypcji. Ważne do ${end} włącznie.`,
    heroCta: "Kupuj teraz",
    heroSub: "Zobacz zestawy",
    terms: "Nie łączy się z innymi rabatami.",
    badge: (pct) => `−${pct}%`,
    cartLabel: (pct) => `Black Week −${pct}%`,
    lowestPrice: (price) => `Najniższa cena z ostatnich 30 dni: ${price}`,
    subThen: (price) => `Pierwsza dostawa. Następnie ${price}/szt.`,
    ordinary: (price) => `Zamiast ${price}`,
  },
};

/** Slutdatum på marknadens språk, t.ex. "30 november" (CET). */
export const campaignEndLabel = (endIso: string, intl: string): string =>
  new Intl.DateTimeFormat(intl, { day: "numeric", month: "long", timeZone: "Europe/Stockholm" }).format(new Date(endIso));
