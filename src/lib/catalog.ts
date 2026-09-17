import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import productsJson from "../../data/products.json";
import pricesJson from "../../data/product_prices.json";
import bundlesJson from "../../data/bundles.json";
import componentsJson from "../../data/bundle_components.json";
import bundlePricesJson from "../../data/bundle_prices.json";
import { buildBundles, slimBundle, type Bundle, type BundleComponentRow, type BundleRow, type SlimBundle } from "./bundles";
import { productFromRow, slimProduct, type Product, type ProductRow, type SlimProduct } from "./products";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Katalogen: produkter och paket. Hämtas från Supabase och cachas tills admin
 * sparar något (revalidateTag(CATALOG_TAG)) eller som längst en timme.
 * Saknas databaskoppling (t.ex. lokalt utan nycklar) används exporten i data/.
 */
export const CATALOG_TAG = "catalog";

type PriceRow = { product_slug?: string; bundle_slug?: string; currency: string; price: number | string; old_price: number | string | null };

type RawCatalog = {
  products: ProductRow[];
  productPrices: PriceRow[];
  bundles: BundleRow[];
  components: BundleComponentRow[];
  bundlePrices: PriceRow[];
};

const fromJson = (): RawCatalog => ({
  products: productsJson as unknown as ProductRow[],
  productPrices: pricesJson as PriceRow[],
  bundles: bundlesJson as unknown as BundleRow[],
  components: componentsJson as BundleComponentRow[],
  bundlePrices: bundlePricesJson as PriceRow[],
});

const fromDb = async (): Promise<RawCatalog> => {
  const db = supabaseAdmin();
  const [p, pp, b, bc, bp] = await Promise.all([
    db.from("products").select("*").order("sort_order"),
    db.from("product_prices").select("product_slug,currency,price,old_price").eq("currency", "SEK"),
    db.from("bundles").select("*").order("sort_order"),
    db.from("bundle_components").select("bundle_slug,product_slug,qty,sort_order,blurb"),
    db.from("bundle_prices").select("bundle_slug,currency,price,old_price").eq("currency", "SEK"),
  ]);
  for (const r of [p, pp, b, bc, bp]) if (r.error) throw new Error(r.error.message);
  return {
    products: (p.data ?? []) as ProductRow[],
    productPrices: (pp.data ?? []) as PriceRow[],
    bundles: (b.data ?? []) as BundleRow[],
    components: (bc.data ?? []) as BundleComponentRow[],
    bundlePrices: (bp.data ?? []) as PriceRow[],
  };
};

const loadRaw = unstable_cache(async () => (supabaseConfigured() ? fromDb() : fromJson()), ["catalog-raw"], {
  tags: [CATALOG_TAG],
  revalidate: 3600,
});

export type Catalog = {
  /** Alla produkter inkl. inaktiva (admin, feeds). */
  allProducts: Product[];
  /** Produkter som säljs just nu. */
  products: Product[];
  bundles: Bundle[];
  /** Alla paket inkl. dolda (admin). */
  allBundles: Bundle[];
};

/** Katalogen för aktuell request (dedupliceras med React cache). */
export const getCatalog = cache(async (): Promise<Catalog> => {
  const raw = await loadRaw();
  const sek = new Map<string, PriceRow>();
  for (const r of raw.productPrices) if (r.product_slug) sek.set(r.product_slug, r);
  const allProducts = raw.products.map((r) => productFromRow(r, sek.get(r.slug))).sort((a, b) => a.sortOrder - b.sortOrder);
  const products = allProducts.filter((p) => p.isActive);
  const bundleSek = new Map<string, PriceRow>();
  for (const r of raw.bundlePrices) if (r.bundle_slug) bundleSek.set(r.bundle_slug, r);
  const bundles = buildBundles(raw.bundles, raw.components, products, bundleSek);
  const allBundles = buildBundles(raw.bundles, raw.components, allProducts, bundleSek, { includeHidden: true });
  return { allProducts, products, bundles, allBundles };
});

export const getProducts = async () => (await getCatalog()).products;
export const getProduct = async (slug: string) => (await getCatalog()).products.find((p) => p.slug === slug);
export const getBundles = async () => (await getCatalog()).bundles;
export const getBundle = async (slug: string) => (await getCatalog()).bundles.find((b) => b.slug === slug);

export type CatalogSnapshot = { products: SlimProduct[]; bundles: SlimBundle[] };

/** Liten variant av katalogen som skickas till klienten för varukorgen. */
export const getCatalogSnapshot = async (): Promise<CatalogSnapshot> => {
  const c = await getCatalog();
  return { products: c.products.map(slimProduct), bundles: c.bundles.map(slimBundle) };
};
