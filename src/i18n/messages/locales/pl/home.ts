import type { HomeMessages } from "../../home";

/** Polska odmiana: 1 / 2–4 (bez 12–14) / 5+. */
const plural = (n: number, one: string, few: string, many: string) => {
  if (n === 1) return one;
  const d = n % 10;
  const h = n % 100;
  return d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many;
};

export const messages: HomeMessages = {
  title: "Metilde – Czyste suplementy diety z roślin, opracowane w Szwecji",
  description: (freeOver: string) =>
    `Grzyby funkcjonalne, zioła i ekstrakty roślinne jako standaryzowane ekstrakty w wegańskich kapsułkach, opracowane w Szwecji. Darmowa dostawa od ${freeOver}.`,
  heroEyebrow: "Wegańska kapsułka",
  heroTitle: "Czyste ekstrakty roślinne",
  heroTitleAccent: "na każdy dzień",
  heroLead:
    "Standaryzowane ekstrakty z ziół i grzybów w wegańskich kapsułkach – bez substancji wiążących, wypełniaczy i barwników. Moc ekstraktu i dawka na kapsułkę są podane na każdym opakowaniu.",
  shopNow: "Kup teraz",
  findExtract: "Znajdź swój ekstrakt",
  reviews: (n: number) => `${n} ${plural(n, "opinia", "opinie", "opinii")}`,
  freeShippingOver: (amount: string) => `Darmowa dostawa od ${amount}`,
  returnRight: "30 dni na odstąpienie od umowy",
  original: "Nasz oryginał",
  allProducts: "Wszystkie produkty",
  rangeEyebrow: "Oferta",
  rangeTitle: "Nasze ekstrakty",
  showAll: "Zobacz wszystkie produkty",
  bundlesEyebrow: "Zestawy",
  bundlesTitle: "Łącz i oszczędzaj",
  bundlesIntro: "Gotowe połączenia naszych najczęściej wybieranych ekstraktów – zawsze z darmową dostawą.",
  howEyebrow: "Jak pracujemy",
  howTitle: "Masz wiedzieć dokładnie, co jest w każdej kapsułce",
  howText:
    "Zawsze podajemy nazwę łacińską, część rośliny, moc ekstraktu i ilość na kapsułkę. Bez wypełniaczy, bez substancji przeciwzbrylających, bez barwników – a numer partii na opakowaniu odpowiada konkretnemu protokołowi analizy.",
  howCta: "Przeczytaj o jakości i oznakowaniu",
  pillars: [
    ["Standaryzowane", "Ta sama zawartość w każdej partii – mierzona substancją markerową lub mocą ekstraktu."],
    ["Identyfikowalne", "Każde opakowanie ma numer partii i datę minimalnej trwałości."],
    ["Wegańskie", "Roślinna otoczka kapsułki (HPMC lub pullulan). Bez glutenu, bez GMO."],
  ] as [string, string][],
  goalsEyebrow: "Dla Ciebie",
  goalsIntro: "Przeglądaj ofertę według surowca i pory dnia.",
  productCount: (n: number) => `${n} ${plural(n, "produkt", "produkty", "produktów")}`,
  journalEyebrow: "Journal",
  journalTitle: "Poradniki i artykuły pogłębione",
  allArticles: "Wszystkie artykuły",
};
