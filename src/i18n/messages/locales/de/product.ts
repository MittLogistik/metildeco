import type { ProductMessages } from "../../product";

export const messages: ProductMessages = {
  notFound: "Produkt nicht gefunden",
  products: "Produkte",
  vegan: "Vegan",
  inclVat: "inkl. MwSt.",
  soldOut: "Ausverkauft – Nachschub ist unterwegs",
  lowStock: (n) => `Auf Lager – nur noch ${n} Stück`,
  inStock: "Auf Lager – an Werktagen bis 12 Uhr (schwedische Zeit) bestellt, am selben Tag verschickt",
  shippingFrom: (from, freeOver) => `Versand ab ${from}, kostenloser Versand ab ${freeOver}.`,
  deliveryTime: (min, max) => `Lieferzeit ${min}–${max} Werktage`,
  returnRight: "30 Tage Widerrufsrecht",
  securePayment: "Sicher bezahlen mit",
  summary: "Das Produkt im Überblick",
  description: "Beschreibung",
  facts: "Fakten",
  sku: "Artikelnummer",
  ingredients: "Zutaten",
  usage: "So wendest du es an",
  qualityTitle: "So sichern wir die Qualität",
  quality: [
    { t: "Lateinischer Name", d: "Art und Pflanzenteil stehen auf jeder Dose." },
    { t: "Klare Dosierung", d: "Extraktstärke und Menge pro Kapsel stehen auf dem Etikett." },
    { t: "Entwickelt in Schweden", d: "Vegane Kapsel ohne Füllstoffe, verpackt in einer Kunststoffdose." },
  ],
  faq: "Häufige Fragen",
  disclaimer:
    "Nahrungsergänzungsmittel sind kein Ersatz für eine abwechslungsreiche und ausgewogene Ernährung und eine gesunde Lebensweise. Die angegebene empfohlene tägliche Verzehrmenge darf nicht überschritten werden. Außerhalb der Reichweite von kleinen Kindern aufbewahren.",
  related: "Das könnte dir auch gefallen",
};
