"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { site } from "@/lib/site";
import { tieredUnitPrice, type SlimProduct } from "@/lib/products";
import type { SlimBundle } from "@/lib/bundles";
import { cheapestSwedenRate, shippingCost } from "@/lib/shipping";
import { track } from "@/lib/track";
import { metaTrack } from "@/components/consent/MetaPixel";
import { metaContentId } from "@/lib/consent";
import { cartStore, type CartLine } from "./cartStore";
import type { Plan } from "./types";

export type { CartLine, Plan };

export type CatalogSnapshot = { products: SlimProduct[]; bundles: SlimBundle[] };

export type ResolvedLine = CartLine & {
  name: string;
  image: string;
  unitPrice: number;
  /** Ordinarie styckpris innan rabatter. */
  listPrice: number;
  lineTotal: number;
  discountLabel: string | null;
  freeShipping: boolean;
  product?: SlimProduct;
  bundle?: SlimBundle;
};

type CartState = {
  lines: CartLine[];
  resolved: ResolvedLine[];
  count: number;
  subtotal: number;
  listTotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addProduct: (slug: string, qty?: number, plan?: Plan, intervalDays?: 30 | 60 | 90) => void;
  addBundle: (slug: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  /** Byter köpplan för en produktrad (engångsköp ↔ prenumeration) och behåller antalet. */
  setPlan: (key: string, plan: Plan, intervalDays?: 30 | 60 | 90) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);

const resolve = (line: CartLine, catalog: CatalogSnapshot): ResolvedLine | null => {
  if (line.kind === "bundle") {
    const bundle = catalog.bundles.find((b) => b.slug === line.slug);
    if (!bundle) return null;
    return {
      ...line,
      name: bundle.name,
      image: bundle.images[0] ?? "/media/placeholder.svg",
      unitPrice: bundle.price,
      listPrice: bundle.value,
      lineTotal: bundle.price * line.qty,
      discountLabel: bundle.discount > 0 ? `Paket −${bundle.discount} %` : null,
      freeShipping: bundle.freeShipping,
      bundle,
    };
  }
  const product = catalog.products.find((p) => p.slug === line.slug);
  if (!product) return null;
  let unitPrice = product.price;
  let discountLabel: string | null = null;
  if (line.plan === "sub") {
    unitPrice = Math.round(product.price * (1 - site.subscriptionDiscount / 100));
    discountLabel = `Prenumeration −${site.subscriptionDiscount} %`;
  } else if (product.tieredPricing && line.qty >= 2) {
    unitPrice = tieredUnitPrice(product, line.qty);
    const pct = line.qty >= 3 ? product.tier3Discount : product.tier2Discount;
    discountLabel = `Mängdrabatt −${pct} %`;
  }
  return {
    ...line,
    name: product.name,
    image: product.images[0] ?? "/media/placeholder.svg",
    unitPrice,
    listPrice: product.price,
    lineTotal: unitPrice * line.qty,
    discountLabel,
    freeShipping: line.plan === "sub",
    product,
  };
};

export function CartProvider({ catalog, children }: { catalog: CatalogSnapshot; children: ReactNode }) {
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [isOpen, setOpen] = useState(false);

  const upsert = useCallback((line: CartLine) => {
    cartStore.update((prev) => {
      const idx = prev.findIndex((l) => l.key === line.key);
      if (idx === -1) return [...prev, line];
      const next = [...prev];
      next[idx] = { ...next[idx]!, qty: next[idx]!.qty + line.qty };
      return next;
    });
    track("add_to_cart");
    const resolved = resolve(line, catalog);
    metaTrack("AddToCart", {
      content_ids: [metaContentId(line.kind, line.slug)],
      content_name: resolved?.name,
      content_type: "product",
      value: resolved ? resolved.unitPrice * line.qty : undefined,
      currency: "SEK",
    });
    setOpen(true);
  }, [catalog]);

  const addProduct = useCallback(
    (slug: string, qty = 1, plan: Plan = "once", intervalDays: 30 | 60 | 90 = 30) =>
      upsert(
        plan === "sub"
          ? { key: `product:${slug}:sub:${intervalDays}`, kind: "product", slug, qty, plan, intervalDays }
          : { key: `product:${slug}:once`, kind: "product", slug, qty, plan },
      ),
    [upsert],
  );
  const addBundle = useCallback(
    (slug: string, qty = 1) => upsert({ key: `bundle:${slug}`, kind: "bundle", slug, qty, plan: "once" }),
    [upsert],
  );
  const setQty = useCallback((key: string, qty: number) => {
    cartStore.update((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);
  const setPlan = useCallback((key: string, plan: Plan, intervalDays: 30 | 60 | 90 = 30) => {
    cartStore.update((prev) => {
      const line = prev.find((l) => l.key === key);
      if (!line || line.kind !== "product") return prev;
      const next: CartLine =
        plan === "sub"
          ? { key: `product:${line.slug}:sub:${intervalDays}`, kind: "product", slug: line.slug, qty: line.qty, plan, intervalDays }
          : { key: `product:${line.slug}:once`, kind: "product", slug: line.slug, qty: line.qty, plan };
      if (next.key === key) return prev;
      const rest = prev.filter((l) => l.key !== key);
      const existing = rest.find((l) => l.key === next.key);
      // Finns samma produkt redan med den nya planen slås antalet ihop, annars byts raden på plats.
      return existing
        ? rest.map((l) => (l.key === next.key ? { ...l, qty: l.qty + next.qty } : l))
        : prev.map((l) => (l.key === key ? next : l));
    });
  }, []);
  const remove = useCallback((key: string) => cartStore.update((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => cartStore.set([]), []);

  const value = useMemo<CartState>(() => {
    const resolved = lines.map((l) => resolve(l, catalog)).filter((l): l is ResolvedLine => l !== null);
    const subtotal = resolved.reduce((s, l) => s + l.lineTotal, 0);
    const listTotal = resolved.reduce((s, l) => s + l.listPrice * l.qty, 0);
    const allFree = resolved.length > 0 && resolved.every((l) => l.freeShipping);
    const shipping = resolved.length === 0 || allFree ? 0 : shippingCost(cheapestSwedenRate, subtotal);
    const threshold = cheapestSwedenRate.freeOver ?? site.freeShippingOver;
    return {
      lines,
      resolved,
      count: resolved.reduce((s, l) => s + l.qty, 0),
      subtotal,
      listTotal,
      discount: listTotal - subtotal,
      shipping,
      total: subtotal + shipping,
      freeShippingRemaining: allFree ? 0 : Math.max(0, threshold - subtotal),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      addProduct,
      addBundle,
      setQty,
      setPlan,
      remove,
      clear,
    };
  }, [lines, catalog, isOpen, addProduct, addBundle, setQty, setPlan, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart måste användas inom CartProvider");
  return ctx;
}
