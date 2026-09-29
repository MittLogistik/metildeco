"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ProductBuyBox } from "./AddToCart";
import { OfferBuyBox, type GiftOption } from "./OfferBuyBox";
import { buyboxVariant, subscribeNoop, type ExperimentMode } from "@/lib/experiment-client";
import { track } from "@/lib/track";
import type { Product } from "@/lib/products";

/**
 * Väljer köpruta utifrån A/B-testet. Servern renderar alltid variant A (sidan är statisk);
 * har webbläsaren lottats till B byts rutan direkt efter hydreringen. Visningen rapporteras
 * som ab_view så att utfallet kan jämföras per variant i admin.
 */
export function BuyBoxSwitch({ product, inStock, gifts, mode, split }: { product: Product; inStock: boolean; gifts: GiftOption[]; mode: ExperimentMode; split: number }) {
  const variant = useSyncExternalStore(
    subscribeNoop,
    () => buyboxVariant(mode, split),
    () => "a" as const,
  );
  useEffect(() => {
    if (mode !== "off") track("ab_view", { slug: product.slug, variant });
  }, [mode, variant, product.slug]);

  if (variant === "b" && product.offerEnabled) return <OfferBuyBox product={product} inStock={inStock} gifts={gifts} />;
  return <ProductBuyBox product={product} inStock={inStock} />;
}
