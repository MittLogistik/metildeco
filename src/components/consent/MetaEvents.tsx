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
export function MetaPurchase({ sessionId, value, ids }: { sessionId: string; value: number; ids: string[] }) {
  useEffect(() => {
    metaTrack("Purchase", { value, currency: "SEK", content_ids: ids, content_type: "product" }, sessionId);
  }, [sessionId, value, ids]);
  return null;
}
