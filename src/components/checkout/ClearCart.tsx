"use client";

import { useEffect } from "react";
import { cartStore } from "@/components/cart/cartStore";

/** Tömmer varukorgen när kunden landar på tacksidan efter betalning. */
export function ClearCart() {
  useEffect(() => {
    cartStore.set([]);
  }, []);
  return null;
}
