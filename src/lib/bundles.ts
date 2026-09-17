/** Pakettyper och byggare. Datan kommer via `@/lib/catalog`. */
import { mediaUrl } from "./media";
import { primaryImage, type Product } from "./products";

export type BundleItem = {
  product: Product;
  qty: number;
  blurb: string | null;
};

export type Bundle = {
  slug: string;
  name: string;
  short: string;
  description: string[];
  price: number;
  /** Summan av ingående produkters ordinarie pris. */
  value: number;
  discount: number;
  bg: string;
  images: string[];
  freeShipping: boolean;
  isActive: boolean;
  sku: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  items: BundleItem[];
  sortOrder: number;
};

export type BundleRow = {
  slug: string;
  name: string;
  short: string;
  description: string[] | null;
  price: number | string;
  bg: string;
  images: string[] | null;
  free_shipping: boolean;
  is_active: boolean;
  sort_order: number;
  sku?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

export type BundleComponentRow = {
  bundle_slug: string;
  product_slug: string;
  qty: number;
  sort_order: number;
  blurb?: string | null;
};

const warn = (msg: string) => {
  if (process.env.NODE_ENV !== "test") console.warn(`[paket] ${msg}`);
};

/**
 * Bygger visningsklara paket. Ett paket visas bara om alla ingående produkter
 * är aktiva och paketpriset är lägre än delarna – annars döljs det med en varning.
 * `includeHidden` används av admin för att visa även dolda paket.
 */
export function buildBundles(
  rows: BundleRow[],
  components: BundleComponentRow[],
  products: Product[],
  sekPrices: Map<string, { price: number | string; old_price: number | string | null }> = new Map(),
  { includeHidden = false }: { includeHidden?: boolean } = {},
): Bundle[] {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const out: Bundle[] = [];
  for (const row of rows) {
    if (!row.is_active && !includeHidden) continue;
    const comps = components.filter((c) => c.bundle_slug === row.slug).sort((a, b) => a.sort_order - b.sort_order);
    const items: BundleItem[] = [];
    let complete = true;
    for (const c of comps) {
      const product = bySlug.get(c.product_slug);
      if (!product || !product.isActive) {
        complete = false;
        if (!includeHidden) warn(`${row.slug} döljs: ingående produkt "${c.product_slug}" är inaktiv eller saknas.`);
        continue;
      }
      items.push({ product, qty: c.qty, blurb: c.blurb ?? null });
    }
    if ((!complete || items.length === 0) && !includeHidden) continue;

    const priceRow = sekPrices.get(row.slug);
    const price = priceRow ? Number(priceRow.price) : Number(row.price);
    const value = items.reduce((s, i) => s + i.product.price * i.qty, 0);
    if (price >= value && items.length > 0 && !includeHidden) {
      warn(`${row.slug} döljs: paketpriset ${price} kr är inte lägre än delarna (${value} kr).`);
      continue;
    }
    const images = (row.images ?? []).length > 0 ? (row.images ?? []).map(mediaUrl) : items.map((i) => primaryImage(i.product));
    out.push({
      slug: row.slug,
      name: row.name,
      short: row.short,
      description: row.description ?? [],
      price,
      value,
      discount: value > 0 ? Math.max(0, Math.round((1 - price / value) * 100)) : 0,
      bg: row.bg,
      images,
      freeShipping: row.free_shipping,
      isActive: row.is_active,
      sku: row.sku ?? null,
      seoTitle: row.seo_title ?? null,
      seoDescription: row.seo_description ?? null,
      items,
      sortOrder: row.sort_order,
    });
  }
  return out.sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Ett paket är köpbart när alla ingående produkter finns i lager. */
export const bundleInStock = (b: Bundle): boolean => b.items.every((i) => !i.product.trackStock || i.product.stock >= i.qty);

export type SlimBundle = Pick<Bundle, "slug" | "sku" | "name" | "price" | "value" | "discount" | "images" | "freeShipping"> & {
  items: { slug: string; qty: number }[];
};

export const slimBundle = (b: Bundle): SlimBundle => ({
  slug: b.slug,
  sku: b.sku,
  name: b.name,
  price: b.price,
  value: b.value,
  discount: b.discount,
  images: b.images.slice(0, 1),
  freeShipping: b.freeShipping,
  items: b.items.map((i) => ({ slug: i.product.slug, qty: i.qty })),
});
