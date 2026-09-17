/**
 * Produktkatalog. Källa: /data/products.json (export från gamla butiken).
 * Priser i SEK kommer från product_prices (valuta SEK) med products.price som reserv.
 */
import productsJson from "../../data/products.json";
import pricesJson from "../../data/product_prices.json";
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
  createdAt: string;
  updatedAt: string;
};

type Raw = (typeof productsJson)[number];
type RawPrice = (typeof pricesJson)[number];

const sekPrices = new Map<string, RawPrice>();
for (const row of pricesJson as RawPrice[]) {
  if (row.currency === "SEK") sekPrices.set(row.product_slug, row);
}

const toProduct = (r: Raw): Product => {
  const priceRow = sekPrices.get(r.slug);
  const price = priceRow ? Number(priceRow.price) : Number(r.price);
  const rawOld = priceRow ? priceRow.old_price : r.old_price;
  const oldPrice = rawOld !== null && Number(rawOld) > price ? Number(rawOld) : null;
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
    variant: (r.variant as Variant | null) ?? null,
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
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
};

/** Alla produkter, inklusive inaktiva (används av admin/feeds senare). */
export const allProducts: Product[] = (productsJson as Raw[])
  .map(toProduct)
  .sort((a, b) => a.sortOrder - b.sortOrder);

/** Produkter som säljs i butiken just nu. */
export const products: Product[] = allProducts.filter((p) => p.isActive);

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const isInStock = (p: Product): boolean => !p.trackStock || p.stock > 0;

export const isLowStock = (p: Product): boolean =>
  p.trackStock && p.stock > 0 && p.stock <= 10;

/** Kategorier i sorteringsordning enligt sortimentet. */
export const categories: string[] = Array.from(new Set(products.map((p) => p.category)));

export const productsInCategory = (category: string): Product[] =>
  products.filter((p) => p.category === category);

/** Bilder – egna bilder eller en neutral platshållare. */
export const imagesFor = (p: Product): string[] =>
  p.images.length > 0 ? p.images : [PLACEHOLDER];

export const primaryImage = (p: Product): string => imagesFor(p)[0]!;

/** Pris per förpackning vid mängdrabatt (2 resp. 3 st). */
export const tieredUnitPrice = (p: Product, qty: number): number => {
  if (!p.tieredPricing) return p.price;
  if (qty >= 3) return Math.round(p.price * (1 - p.tier3Discount / 100));
  if (qty === 2) return Math.round(p.price * (1 - p.tier2Discount / 100));
  return p.price;
};

/** Antal kapslar/tabletter enligt namnet, t.ex. "… | 60 kapslar" → 60. */
export const unitCount = (p: Product): number | null => {
  const m = p.name.match(/(\d+)\s*(kapslar|tabletter)/i);
  return m ? Number(m[1]) : null;
};

/** Relaterade produkter: samma kategori först, sedan resten. */
export const relatedProducts = (p: Product, limit = 4): Product[] => {
  const same = products.filter((x) => x.slug !== p.slug && x.category === p.category);
  const others = products.filter((x) => x.slug !== p.slug && x.category !== p.category);
  return [...same, ...others].slice(0, limit);
};

/** Aggregerat betyg över produkter med omdömen. */
export const aggregateRating = () => {
  const rated = products.filter((p) => p.reviews > 0);
  const count = rated.reduce((s, p) => s + p.reviews, 0);
  if (count === 0) return null;
  const avg = rated.reduce((s, p) => s + p.rating * p.reviews, 0) / count;
  return { avg: Math.round(avg * 10) / 10, count };
};
