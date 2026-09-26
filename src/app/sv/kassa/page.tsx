import type { Metadata } from "next";
import { Suspense } from "react";
import { Checkout } from "@/components/checkout/Checkout";

export const metadata: Metadata = {
  title: "Kassa",
  description: "Slutför din beställning hos Metilde.",
  robots: { index: false, follow: false },
};

/** Kassan läser ?korg och ?kod från påminnelselänkar, därför Suspense runt klientkomponenten. */
export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <Checkout />
    </Suspense>
  );
}
