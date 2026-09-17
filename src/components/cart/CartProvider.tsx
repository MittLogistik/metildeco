"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { site } from "@/lib/site";
import { getProduct, tieredUnitPrice, type Product } from "@/lib/products";
import { getBundle, type Bundle } from "@/lib/bundles";
import { cheapestSwedenRate, shippingCost } from "@/lib/shipping";
import { cartStore, type CartLine } from "./cartStore";
import type { Plan } from "./types";

export type { CartLine, Plan };

export type ResolvedLine = CartLine & {
  name: string;
  image: string;
  unitPrice: number;
  /** Ordinarie styckpris innan rabatter. */
  listPrice: number;
  lineTotal: number;
  discountLabel: string | null;
  freeShipping: boolean;
  product?: Product;
  bundle?: Bundle;
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
  addProduct: (slug: string, qty?: number, plan?: Plan) => void;
  addBundle: (slug: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);

const resolve = (line: CartLine): ResolvedLine | null => {
  if (line.kind === "bundle") {
    const bundle = getBundle(line.slug);
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
  const product = getProduct(line.slug);
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

export function CartProvider({ children }: { children: ReactNode }) {
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
    setOpen(true);
  }, []);

  const addProduct = useCallback(
    (slug: string, qty = 1, plan: Plan = "once") =>
      upsert({ key: `product:${slug}:${plan}`, kind: "product", slug, qty, plan }),
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
  const remove = useCallback((key: string) => cartStore.update((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => cartStore.set([]), []);

  const value = useMemo<CartState>(() => {
    const resolved = lines.map(resolve).filter((l): l is ResolvedLine => l !== null);
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
      remove,
      clear,
    };
  }, [lines, isOpen, addProduct, addBundle, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart måste användas inom CartProvider");
  return ctx;
}
