import type { CommonMessages } from "../../common";

export const messages: CommonMessages = {
  siteTitle: "Metilde – Reine botanische Nahrungsergänzungsmittel, entwickelt in Schweden",
  siteDescription: (freeOver) =>
    `Standardisierte Kräuter- und Pilzextrakte ohne Füllstoffe, entwickelt in Schweden. Kostenloser Versand ab ${freeOver}.`,
  notFound: {
    title: "Seite nicht gefunden",
    text: "Die Adresse hat sich möglicherweise geändert oder das Produkt ist nicht mehr im Sortiment.",
    home: "Zur Startseite",
  },
};
