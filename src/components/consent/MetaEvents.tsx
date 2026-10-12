"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n/client";
import { metaTrack } from "./MetaPixel";

/** ViewContent på produkt- och paketsidor. Priset är i marknadens valuta. */
export function MetaViewContent({ id, name, price, category }: { id: string; name: string; price: number; category: string }) {
  const { currency } = useI18n().market;
  useEffect(() => {
    metaTrack("ViewContent", { content_ids: [id], content_name: name, content_type: "product", content_category: category, value: price, currency });
  }, [id, name, price, category, currency]);
  return null;
}

/**
 * Purchase från tacksidan – samma event-id (Stripe-sessionen) som serverhändelsen.
 * `currency` = orderns valuta; utelämnad används marknadens.
 */
export function MetaPurchase({
  sessionId,
  value,
  ids,
  subscription,
  currency: orderCurrency,
}: {
  sessionId: string;
  value: number;
  ids: string[];
  subscription: boolean;
  currency?: string;
}) {
  const market = useI18n().market;
  const currency = (orderCurrency ?? market.currency).toUpperCase();
  useEffect(() => {
    metaTrack("Purchase", { value, currency, content_ids: ids, content_type: "product" }, sessionId);
    if (subscription) metaTrack("Subscribe", { value, currency, content_ids: ids, content_type: "product" }, `${sessionId}_sub`);
  }, [sessionId, value, ids, subscription, currency]);
  return null;
}
