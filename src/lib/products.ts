/**
 * Produkttyper och rena hjälpfunktioner. Själva datan hämtas via `@/lib/catalog`
 * (databasen) – den här filen innehåller inget som kräver server eller nätverk,
 * så att den kan användas i både server- och klientkomponenter.
 */
import { mediaUrl, PLACEHOLDER } from "./media";

export type Variant = {
  group: string;
  groupName: string;
  flavor: string;
  flavorHex: string;
  size: string;
  format: string;
  servings: number;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  tags: string[];
  bg: string;
  short: string;
  bullets: string[];
  description: string[];
  images: string[];
  storyImages: string[];
  storyHeroImage: string | null;
  videoUrl: string | null;
  videoPosterUrl: string | null;
  variant: Variant | null;
  isActive: boolean;
  sortOrder: number;
  sku: string | null;
  stock: number;
  trackStock: boolean;
  countries: string[];
  tieredPricing: boolean;
  tier2Discount: number;
  tier3Discount: number;
  gtin: string | null;
  mpn: string | null;
  brand: string;
  googleProductCategory: string | null;
  customsDescription: string | null;
  customsCode: string | null;
  countryOfOrigin: string | null;
  weightGrams: number | null;
  /** Kanaler produkten inte ska med i: "google" | "meta" | "addrevenue". */
  feedExclusions: string[];
  createdAt: string;
  updatedAt: string;
};

/** Rad i tabellen products (och samma form som data/products.json). */
export type ProductRow = {
  slug: string;
  name: string;
  category: string;
  price: number | string;
  old_price: number | string | null;
  rating: number | string;
  reviews: number;
  tags: string[] | null;
  bg: string;
  short: string;
  bullets: string[] | null;
  description: string[] | null;
  images: string[] | null;
  variant: Variant | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  sku?: string | null;
  stock?: number | null;
  track_stock: boolean;
  video_url?: string | null;
  video_poster_url?: string | null;
  story_images?: string[] | null;
  countries?: string[] | null;
  tiered_pricing: boolean;
  tier_2_discount: number;
  tier_3_discount: number;
  gtin?: string | null;
  mpn?: string | null;
  google_product_category?: string | null;
  brand?: string | null;
  story_hero_image?: string | null;
  customs_description?: string | null;
  customs_code?: string | null;
  country_of_origin?: string | null;
  weight_grams?: number | null;
  feed_exclusions?: string[] | null;
};

/** Bygger en produkt av en databasrad plus (valfritt) SEK-pris från product_prices. */
export const productFromRow = (r: ProductRow, sekPrice?: { price: number | string; old_price: number | string | null } | null): Product => {
  const price = sekPrice ? Number(sekPrice.price) : Number(r.price);
  const rawOld = sekPrice ? sekPrice.old_price : r.old_price;
  const oldPrice = rawOld !== null && rawOld !== undefined && Number(rawOld) > price ? Number(rawOld) : null;
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    price,
    oldPrice,
    rating: Number(r.rating),
    reviews: r.reviews,
    tags: r.tags ?? [],
    bg: r.bg,
    short: r.short,
    bullets: r.bullets ?? [],
    description: r.description ?? [],
    images: (r.images ?? []).map(mediaUrl),
    storyImages: (r.story_images ?? []).map(mediaUrl),
    storyHeroImage: r.story_hero_image ? mediaUrl(r.story_hero_image) : null,
    videoUrl: r.video_url ? mediaUrl(r.video_url) : null,
    videoPosterUrl: r.video_poster_url ? mediaUrl(r.video_poster_url) : null,
    variant: r.variant ?? null,
    isActive: r.is_active,
    sortOrder: r.sort_order,
    sku: r.sku ?? null,
    stock: r.stock ?? 0,
    trackStock: r.track_stock,
    countries: r.countries ?? [],
    tieredPricing: r.tiered_pricing,
    tier2Discount: r.tier_2_discount,
    tier3Discount: r.tier_3_discount,
    gtin: r.gtin ?? null,
    mpn: r.mpn ?? null,
    brand: r.brand ?? "Metilde",
    googleProductCategory: r.google_product_category ?? null,
    customsDescription: r.customs_description ?? null,
    customsCode: r.customs_code ?? null,
    countryOfOrigin: r.country_of_origin ?? null,
    weightGrams: r.weight_grams ?? null,
    feedExclusions: r.feed_exclusions ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
};

export const isInStock = (p: Pick<Product, "trackStock" | "stock">): boolean => !p.trackStock || p.stock > 0;

export const isLowStock = (p: Pick<Product, "trackStock" | "stock">): boolean =>
  p.trackStock && p.stock > 0 && p.stock <= 10;

/** Bilder – egna bilder eller en neutral platshållare. */
export const imagesFor = (p: Pick<Product, "images">): string[] => (p.images.length > 0 ? p.images : [PLACEHOLDER]);

export const primaryImage = (p: Pick<Product, "images">): string => imagesFor(p)[0]!;

/** Pris per förpackning vid mängdrabatt (2 resp. 3 st). */
export const tieredUnitPrice = (
  p: Pick<Product, "price" | "tieredPricing" | "tier2Discount" | "tier3Discount">,
  qty: number,
): number => {
  if (!p.tieredPricing) return p.price;
  if (qty >= 3) return Math.round(p.price * (1 - p.tier3Discount / 100));
  if (qty === 2) return Math.round(p.price * (1 - p.tier2Discount / 100));
  return p.price;
};

/** Antal kapslar/tabletter enligt namnet, t.ex. "… | 60 kapslar" → 60. */
export const unitCount = (p: Pick<Product, "name">): number | null => {
  const m = p.name.match(/(\d+)\s*(kapslar|tabletter)/i);
  return m ? Number(m[1]) : null;
};

/** Kategorier i sorteringsordning enligt sortimentet. */
export const categoriesOf = (list: Product[]): string[] => Array.from(new Set(list.map((p) => p.category)));

/** Relaterade produkter: samma kategori först, sedan resten. */
export const relatedProducts = (p: Product, list: Product[], limit = 4): Product[] => {
  const same = list.filter((x) => x.slug !== p.slug && x.category === p.category);
  const others = list.filter((x) => x.slug !== p.slug && x.category !== p.category);
  return [...same, ...others].slice(0, limit);
};

/** Aggregerat betyg över produkter med omdömen. */
export const aggregateRating = (list: Product[]) => {
  const rated = list.filter((p) => p.reviews > 0);
  const count = rated.reduce((s, p) => s + p.reviews, 0);
  if (count === 0) return null;
  const avg = rated.reduce((s, p) => s + p.rating * p.reviews, 0) / count;
  return { avg: Math.round(avg * 10) / 10, count };
};

/** Så mycket av en produkt som behövs i varukorg och kassa (skickas till klienten). */
export type SlimProduct = Pick<
  Product,
  "slug" | "name" | "price" | "images" | "bg" | "tieredPricing" | "tier2Discount" | "tier3Discount" | "trackStock" | "stock" | "category"
>;

export const slimProduct = (p: Product): SlimProduct => ({
  slug: p.slug,
  name: p.name,
  price: p.price,
  images: p.images.slice(0, 1),
  bg: p.bg,
  tieredPricing: p.tieredPricing,
  tier2Discount: p.tier2Discount,
  tier3Discount: p.tier3Discount,
  trackStock: p.trackStock,
  stock: p.stock,
  category: p.category,
});
