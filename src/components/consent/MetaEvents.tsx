"use client";

import { useEffect } from "react";
import { metaTrack } from "./MetaPixel";

/** ViewContent på produkt- och paketsidor. */
export function MetaViewContent({ id, name, price, category }: { id: string; name: string; price: number; category: string }) {
  useEffect(() => {
    metaTrack("ViewContent", { content_ids: [id], content_name: name, content_type: "product", content_category: category, value: price, currency: "SEK" });
  }, [id, name, price, category]);
  return null;
}

/** Purchase från tacksidan – samma event-id (Stripe-sessionen) som serverhändelsen. */
export function MetaPurchase({ sessionId, value, ids, subscription }: { sessionId: string; value: number; ids: string[]; subscription: boolean }) {
  useEffect(() => {
    metaTrack("Purchase", { value, currency: "SEK", content_ids: ids, content_type: "product" }, sessionId);
    if (subscription) metaTrack("Subscribe", { value, currency: "SEK", content_ids: ids, content_type: "product" }, `${sessionId}_sub`);
  }, [sessionId, value, ids, subscription]);
  return null;
}
