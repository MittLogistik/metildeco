import type { Metadata } from "next";
import { Suspense } from "react";
import { Checkout } from "@/components/checkout/Checkout";
import { alternates, getI18n } from "@/i18n/server";
import { checkout } from "@/i18n/messages/checkout";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, r } = await getI18n();
  const t = checkout[locale];
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: alternates(r.checkout, { key: "checkout" }),
    robots: { index: false, follow: false },
  };
}

/** Kassan läser ?korg och ?kod från påminnelselänkar, därför Suspense runt klientkomponenten. */
export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <Checkout />
    </Suspense>
  );
}
