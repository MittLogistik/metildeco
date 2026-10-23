import type { Locale } from "./i18n";

/**
 * Produkter som räknas som nya livsmedel (novel food, EU 2015/2283) utan godkännande:
 * Tongkat Ali (Eurycoma longifolia), Fadogia agrestis och Blue Lotus (Nymphaea caerulea).
 * På marknaderna i `CLOSED_IN` behandlas de som inaktiva – borta från katalog, produktsidor,
 * paket som innehåller dem, feeds, sitemap och kassa. Raderna finns kvar för admin och ordrar.
 */
export const NOVEL_FOOD_SLUGS = new Set([
  "tongkat-ali-elite",
  "tongkat-premium",
  "black-tongkat",
  "tongkat-ali-ruby",
  "fadogia-agrestis",
  "blue-lotus",
]);

/** Journalartiklar som handlar om produkterna ovan – dolda på samma marknader. */
export const NOVEL_FOOD_ARTICLES = new Set([
  "fordjupning-i-tongkat-ali-skillnaden-mellan-klassisk-rot-och-den-morka-varianten",
  "blue-lotus-historien-konsten-att-varva-ner-och-vad-ett-200-1-extrakt-innebar",
]);

/** Marknader där produkterna är stängda (sedan 2026-10-23: Sverige). */
const CLOSED_IN = new Set<Locale>(["sv"]);

export const novelFoodsClosed = (locale: Locale) => CLOSED_IN.has(locale);

export const isClosedNovelFood = (slug: string, locale: Locale) => novelFoodsClosed(locale) && NOVEL_FOOD_SLUGS.has(slug);
