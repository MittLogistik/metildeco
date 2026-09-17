/** Paket – databasrader kopplade till riktiga produkter. */
import bundlesJson from "../../data/bundles.json";
import componentsJson from "../../data/bundle_components.json";
import bundlePricesJson from "../../data/bundle_prices.json";
import { mediaUrl } from "./media";
import { getProduct, primaryImage, type Product } from "./products";

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
  sku: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  items: BundleItem[];
  sortOrder: number;
};

type RawBundle = (typeof bundlesJson)[number];
type RawComponent = (typeof componentsJson)[number];
type RawPrice = (typeof bundlePricesJson)[number];

const sek = new Map<string, RawPrice>();
for (const row of bundlePricesJson as RawPrice[]) {
  if (row.currency === "SEK") sek.set(row.bundle_slug, row);
}

const build = (row: RawBundle): Bundle | null => {
  const items: BundleItem[] = (componentsJson as RawComponent[])
    .filter((c) => c.bundle_slug === row.slug)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => {
      const product = getProduct(c.product_slug);
      return product ? { product, qty: c.qty, blurb: c.blurb ?? null } : null;
    })
    .filter((x): x is BundleItem => x !== null);
  if (items.length === 0) return null;

  const priceRow = sek.get(row.slug);
  const price = priceRow ? Number(priceRow.price) : Number(row.price);
  const value = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const images =
    row.images.length > 0 ? row.images.map(mediaUrl) : items.map((i) => primaryImage(i.product));

  return {
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
    sku: row.sku ?? null,
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    items,
    sortOrder: row.sort_order,
  };
};

export const bundles: Bundle[] = (bundlesJson as RawBundle[])
  .filter((b) => b.is_active)
  .map(build)
  .filter((b): b is Bundle => b !== null)
  .sort((a, b) => a.sortOrder - b.sortOrder);

export const getBundle = (slug: string): Bundle | undefined =>
  bundles.find((b) => b.slug === slug);

/** Ett paket är köpbart när alla ingående produkter finns i lager. */
export const bundleInStock = (b: Bundle): boolean =>
  b.items.every((i) => !i.product.trackStock || i.product.stock >= i.qty);
