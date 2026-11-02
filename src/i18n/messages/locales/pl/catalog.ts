import type { CatalogMessages } from "../../catalog";

/** Polska odmiana: 1 / 2–4 (bez 12–14) / 5+. */
const plural = (n: number, one: string, few: string, many: string) => {
  if (n === 1) return one;
  const d = n % 10;
  const h = n % 100;
  return d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many;
};

export const messages: CatalogMessages = {
  // Karty
  soldOut: "Wyprzedane",
  isNew: "Nowość",
  bundleSoldOut: "Chwilowo niedostępne",
  save: (pct: number) => `Oszczędzasz ${pct}%`,
  bundleItems: (n: number) => `Zestaw · ${n} ${plural(n, "produkt", "produkty", "produktów")}`,
  boughtSeparately: (v: string) => `Kupowane osobno ${v}`,
  readMinutes: (n: number) => `${n} min czytania`,
  rating: (r: string) => `Ocena ${r} na 5`,
  // Galeria
  imageAlt: (name: string, n: number) => `${name} – zdjęcie ${n}`,
  playVideo: "Odtwórz wideo",
  showVideo: "Pokaż wideo",
  showImage: (n: number) => `Pokaż zdjęcie ${n}`,
  moreImages: "Więcej zdjęć",
  // Lista produktów
  listTitle: "Wszystkie produkty – ekstrakty z ziół i grzybów",
  listDescription:
    "Cała oferta Metilde ze standaryzowanymi ekstraktami z ziół i grzybów: Lion's Mane, Cordyceps, Reishi, Chaga, Maca i więcej.",
  sorts: { utvald: "Polecane", "pris-lag": "Najniższa cena", "pris-hog": "Najwyższa cena", namn: "A–Z" },
  bundles: "Zestawy",
  allProducts: "Wszystkie produkty",
  products: "Produkty",
  listIntro: "Standaryzowane ekstrakty w wegańskich kapsułkach, pakowane w plastikowe słoiki.",
  categoryNav: "Kategoria",
  all: "Wszystkie",
  sortLabel: "Sortuj:",
  emptyCategory: "W tej kategorii nie ma obecnie produktów.",
  productCount: (n: number) => `${n} ${plural(n, "produkt", "produkty", "produktów")}`,
  // Strona zestawu
  bundleNotFound: "Nie znaleziono zestawu",
  bundleSeoTitle: (name: string, pct: number) => `${name} – oszczędzasz ${pct}%`,
  bundleEyebrow: (pct: number) => `Zestaw · oszczędzasz ${pct}%`,
  included: "W zestawie",
  valueSeparately: "Wartość osobno",
  bundlePrice: "Cena zestawu",
  youSave: "Oszczędzasz",
  bundleFreeShipping: "Darmowa dostawa tego zestawu",
  freeShippingOver: (amount: string) => `Darmowa dostawa od ${amount}`,
  sameDay: "W dni robocze wysyłka tego samego dnia przy zamówieniu do 12:00 (CET)",
  securePayment: "Bezpieczna płatność przez",
  description: "Opis",
  moreBundles: "Więcej zestawów",
};
