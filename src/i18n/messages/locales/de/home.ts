import type { HomeMessages } from "../../home";

export const messages: HomeMessages = {
  title: "Metilde – Reine botanische Nahrungsergänzungsmittel",
  description: (freeOver) =>
    `Funktionelle Pilze, Kräuter und Pflanzenextrakte als standardisierte Extrakte in veganen Kapseln. Kostenloser Versand ab ${freeOver}.`,
  heroEyebrow: "Vegane Kapsel",
  heroTitle: "Reine botanische Extrakte",
  heroTitleAccent: "für jeden Tag",
  heroLead:
    "Standardisierte Kräuter- und Pilzextrakte in veganen Kapseln – ohne Bindemittel, Füllstoffe oder Farbstoffe. Extraktstärke und Menge pro Kapsel stehen auf jeder Dose.",
  shopNow: "Jetzt shoppen",
  findExtract: "Finde dein Extrakt",
  reviews: (n) => `${n} Bewertungen`,
  freeShippingOver: (amount) => `Kostenloser Versand ab ${amount}`,
  returnRight: "30 Tage Widerrufsrecht",
  original: "Unser Original",
  allProducts: "Alle Produkte",
  rangeEyebrow: "Das Sortiment",
  rangeTitle: "Unsere Extrakte",
  showAll: "Alle Produkte ansehen",
  bundlesEyebrow: "Sets",
  bundlesTitle: "Kombinieren und sparen",
  bundlesIntro: "Fertige Kombinationen unserer meistgefragten Extrakte – immer mit kostenlosem Versand.",
  howEyebrow: "So arbeiten wir",
  howTitle: "Du sollst genau wissen, was in jeder Kapsel steckt",
  howText:
    "Wir geben immer den lateinischen Namen, den Pflanzenteil, die Extraktstärke und die Menge pro Kapsel an. Keine Füllstoffe, keine Fließmittel, keine Farbstoffe – und die Chargennummer auf der Verpackung gehört zu einem bestimmten Analyseprotokoll.",
  howCta: "Mehr über Qualität und Kennzeichnung",
  pillars: [
    ["Standardisiert", "Gleicher Gehalt in jeder Charge – gemessen an Markersubstanz oder Extraktstärke."],
    ["Rückverfolgbar", "Jede Dose hat eine Chargennummer und ein Mindesthaltbarkeitsdatum."],
    ["Vegan", "Pflanzliche Kapselhülle (HPMC oder Pullulan). Glutenfrei, ohne Gentechnik."],
  ],
  goalsEyebrow: "Persönlich",
  goalsIntro: "Sortiere das Sortiment nach Rohstoff und Tageszeit.",
  productCount: (n) => `${n} ${n === 1 ? "Produkt" : "Produkte"}`,
  journalEyebrow: "Journal",
  journalTitle: "Ratgeber und Hintergründe",
  allArticles: "Alle Artikel",
};
