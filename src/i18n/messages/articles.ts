/** Journalen: listan och artikelsidan. */
import type { Locale } from "@/lib/i18n";

const sv = {
  metaTitle: "Journalen – guider om örtextrakt, svampextrakt och kvalitet",
  metaDescription:
    "Guider och fördjupning om råvaror, extraktionsgrad, standardisering och rutiner – skrivet av Metilde. Utan genvägar och utan löften vi inte kan hålla.",
  journal: "Journalen",
  title: "Guider och fördjupning",
  intro: "Bakgrund om råvaror, extrakt och rutiner – utan genvägar och utan löften vi inte kan hålla.",
  categoryNav: "Kategori",
  allPosts: "Alla inlägg",
  empty: "Inga artiklar i den här kategorin ännu.",
  disclaimer:
    "Innehållet är allmän information om råvaror och rutiner och ersätter inte rådgivning från vård eller apotek. Kosttillskott ersätter inte en varierad kost.",
  notFound: "Artikeln hittades inte",
  fromRange: "Ur sortimentet",
  productsInArticle: "Produkter i artikeln",
  readMinutes: (n: number) => `${n} min läsning`,
  published: "Publicerad",
  more: "Fler artiklar",
};

export const articlesMessages: Record<Locale, typeof sv> = {
  sv,
  fi: {
    metaTitle: "Journal – oppaita yrtti- ja sieniuutteista sekä laadusta",
    metaDescription:
      "Oppaita ja syventäviä artikkeleita raaka-aineista, uutesuhteista, standardoinnista ja rutiineista – Metilden kirjoittamia. Ilman oikoteitä ja ilman lupauksia, joita emme voi pitää.",
    journal: "Journal",
    title: "Oppaat ja syventävät artikkelit",
    intro: "Taustatietoa raaka-aineista, uutteista ja rutiineista – ilman oikoteitä ja ilman lupauksia, joita emme voi pitää.",
    categoryNav: "Kategoria",
    allPosts: "Kaikki artikkelit",
    empty: "Tässä kategoriassa ei ole vielä artikkeleita.",
    disclaimer:
      "Sisältö on yleistä tietoa raaka-aineista ja rutiineista, eikä se korvaa terveydenhuollon tai apteekin neuvontaa. Ravintolisä ei korvaa monipuolista ruokavaliota.",
    notFound: "Artikkelia ei löytynyt",
    fromRange: "Valikoimastamme",
    productsInArticle: "Artikkelin tuotteet",
    readMinutes: (n) => `${n} min lukuaika`,
    published: "Julkaistu",
    more: "Lisää artikkeleita",
  },
  da: {
    metaTitle: "Journalen – guides om urteekstrakter, svampeekstrakter og kvalitet",
    metaDescription:
      "Guides og fordybelse om råvarer, ekstraktionsgrad, standardisering og rutiner – skrevet af Metilde. Uden genveje og uden løfter, vi ikke kan holde.",
    journal: "Journalen",
    title: "Guides og fordybelse",
    intro: "Baggrund om råvarer, ekstrakter og rutiner – uden genveje og uden løfter, vi ikke kan holde.",
    categoryNav: "Kategori",
    allPosts: "Alle indlæg",
    empty: "Der er endnu ingen artikler i denne kategori.",
    disclaimer:
      "Indholdet er generel information om råvarer og rutiner og erstatter ikke rådgivning fra sundhedsvæsenet eller apoteket. Kosttilskud erstatter ikke en varieret kost.",
    notFound: "Artiklen blev ikke fundet",
    fromRange: "Fra sortimentet",
    productsInArticle: "Produkter i artiklen",
    readMinutes: (n) => `${n} min. læsning`,
    published: "Udgivet",
    more: "Flere artikler",
  },
  nl: {
    metaTitle: "Journal – gidsen over kruidenextracten, paddenstoelenextracten en kwaliteit",
    metaDescription:
      "Gidsen en verdieping over grondstoffen, extractieverhouding, standaardisatie en routines – geschreven door Metilde. Zonder shortcuts en zonder beloften die we niet kunnen waarmaken.",
    journal: "Journal",
    title: "Gidsen en verdieping",
    intro: "Achtergrond over grondstoffen, extracten en routines – zonder shortcuts en zonder beloften die we niet kunnen waarmaken.",
    categoryNav: "Categorie",
    allPosts: "Alle artikelen",
    empty: "Er zijn nog geen artikelen in deze categorie.",
    disclaimer:
      "De inhoud is algemene informatie over grondstoffen en routines en vervangt geen advies van een arts of apotheek. Voedingssupplementen zijn geen vervanging voor een gevarieerd voedingspatroon.",
    notFound: "Artikel niet gevonden",
    fromRange: "Uit het assortiment",
    productsInArticle: "Producten in dit artikel",
    readMinutes: (n) => `${n} min leestijd`,
    published: "Gepubliceerd",
    more: "Meer artikelen",
  },
};
