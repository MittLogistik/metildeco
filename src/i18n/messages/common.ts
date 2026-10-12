/**
 * Gemensamma texter (sidhuvud, sidfot, 404, metadata). Varje namnrymd i src/i18n/messages
 * är ett objekt per språk där fi och da har samma form som sv (typen tvingar det).
 * Användning: `const t = common[locale]`.
 */
import type { Locale } from "@/lib/i18n";

const sv = {
  siteTitle: "Metilde – Rena botaniska kosttillskott utvecklade i Sverige",
  siteDescription: (freeOver: string) =>
    `Standardiserade örtextrakt och svampextrakt utan fyllnadsmedel, utvecklade i Sverige. Fri frakt över ${freeOver}.`,
  notFound: {
    title: "Sidan hittades inte",
    text: "Adressen kan ha ändrats eller så finns produkten inte längre i sortimentet.",
    home: "Till startsidan",
  },
};

export const common: Record<Locale, typeof sv> = {
  sv,
  fi: {
    siteTitle: "Metilde – Puhtaita kasviperäisiä ravintolisiä, kehitetty Ruotsissa",
    siteDescription: (freeOver) =>
      `Standardoituja yrtti- ja sieniuutteita ilman täyteaineita, kehitetty Ruotsissa. Ilmainen toimitus yli ${freeOver} tilauksiin.`,
    notFound: {
      title: "Sivua ei löytynyt",
      text: "Osoite on voinut muuttua tai tuote ei ole enää valikoimassa.",
      home: "Etusivulle",
    },
  },
  da: {
    siteTitle: "Metilde – Rene botaniske kosttilskud udviklet i Sverige",
    siteDescription: (freeOver) =>
      `Standardiserede urte- og svampeekstrakter uden fyldstoffer, udviklet i Sverige. Fri fragt over ${freeOver}.`,
    notFound: {
      title: "Siden blev ikke fundet",
      text: "Adressen kan være ændret, eller produktet findes ikke længere i sortimentet.",
      home: "Til forsiden",
    },
  },
  nl: {
    siteTitle: "Metilde – Pure botanische voedingssupplementen, ontwikkeld in Zweden",
    siteDescription: (freeOver) =>
      `Gestandaardiseerde kruiden- en paddenstoelenextracten zonder vulstoffen, ontwikkeld in Zweden. Gratis verzending vanaf ${freeOver}.`,
    notFound: {
      title: "Pagina niet gevonden",
      text: "Het adres is mogelijk gewijzigd of het product zit niet meer in het assortiment.",
      home: "Naar de startpagina",
    },
  },
};
