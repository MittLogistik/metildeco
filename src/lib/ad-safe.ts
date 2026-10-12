/**
 * Produkter som får visas på kampanjsidorna för Google Ads (/sv/kampanj m.fl.).
 * Google räknar Tongkat Ali som "otillåtet ämne" och underkänner annonser vars målsida nämner det,
 * även i sidfot eller korgdata. Fadogia och Blue Lotus hålls också utanför – de flaggas ofta i samma kategori.
 * Paket visas inte (alla innehåller någon av dem).
 */
import type { Product } from "./products";

const EXCLUDED = new Set(["tongkat-ali-elite", "tongkat-premium", "black-tongkat", "tongkat-ali-ruby", "fadogia-agrestis", "blue-lotus"]);

/** Ord som aldrig får förekomma på kampanjsidan (kontrolleras även i produktens texter). */
const BLOCKED = /tongkat|eurycoma|fadogia|blue lotus|nymphaea/i;

export const isAdSafe = (p: Pick<Product, "slug" | "name" | "short" | "category">): boolean =>
  !EXCLUDED.has(p.slug) && !BLOCKED.test(`${p.name} ${p.short} ${p.category}`);

/** Svampextrakten visas som egen grupp överst. */
export const MUSHROOMS = new Set(["lions-mane", "reishi", "chaga", "cordyceps"]);
