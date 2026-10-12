"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/client";
import { layout } from "@/i18n/messages/layout";
import type { Locale } from "@/lib/i18n";

/**
 * `file` saknas för betalsätt utan fri logotyp – då visas namnet som text i samma ruta.
 * `markets` begränsar till vissa språk/marknader (iDEAL i NL, MobilePay i FI och DK); utan = alla.
 */
export type PaymentMethod = { id: string; name: string; file?: string; width?: number; height?: number; markets?: Locale[] };

/** Betalsätt butiken tar emot via Stripe. Swish läggs tillbaka när Stripe godkänt ansökan (raden finns kvar nedan, avstängd). */
export const paymentMethods: PaymentMethod[] = [
  // { id: "swish", name: "Swish", file: "/payments/swish.svg", width: 578, height: 176 },
  { id: "klarna", name: "Klarna", file: "/payments/klarna.svg", width: 1448, height: 609 },
  { id: "visa", name: "Visa", file: "/payments/visa.svg", width: 780, height: 500 },
  { id: "mastercard", name: "Mastercard", file: "/payments/mastercard.svg", width: 780, height: 500 },
  { id: "amex", name: "American Express", file: "/payments/amex.svg", width: 780, height: 500 },
  { id: "applepay", name: "Apple Pay", file: "/payments/applepay.svg", width: 24, height: 24 },
  { id: "googlepay", name: "Google Pay", file: "/payments/googlepay.svg", width: 24, height: 24 },
  { id: "ideal", name: "iDEAL", markets: ["nl"] },
  { id: "mobilepay", name: "MobilePay", markets: ["fi", "da"] },
];

/** Betalsätten som visas på en marknad (samma som Stripe erbjuder där). */
export const paymentMethodsFor = (locale: Locale) => paymentMethods.filter((m) => !m.markets || m.markets.includes(locale));

/**
 * Rad med betalsättslogotyper. `only` begränsar till vissa betalsätt,
 * t.ex. utan Swish när korgen innehåller prenumeration.
 */
export function PaymentMethods({
  only,
  size = "md",
  className = "",
  label,
}: {
  only?: string[];
  size?: "sm" | "md";
  className?: string;
  label?: string;
}) {
  const { locale } = useI18n();
  const forMarket = paymentMethodsFor(locale);
  const list = only ? forMarket.filter((m) => only.includes(m.id)) : forMarket;
  const h = size === "sm" ? "h-6" : "h-8";
  return (
    <div className={className}>
      {label ? <p className="mb-2 text-center text-xs text-muted">{label}</p> : null}
      <ul className="flex flex-wrap items-center justify-center gap-2" aria-label={layout[locale].payments.label}>
        {list.map((m) => (
          <li
            key={m.id}
            title={m.name}
            className={`inline-flex ${h} items-center justify-center rounded-md border border-line bg-white px-2`}
          >
            {m.file ? (
              <Image
                src={m.file}
                alt={m.name}
                width={m.width}
                height={m.height}
                unoptimized
                className={`w-auto ${size === "sm" ? "h-3.5" : "h-4.5"} ${m.id === "applepay" || m.id === "googlepay" ? (size === "sm" ? "h-4" : "h-5") : ""}`}
              />
            ) : (
              <span className={`font-semibold text-foreground ${size === "sm" ? "text-[10px]" : "text-xs"}`}>{m.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Prenumerationer dras automatiskt varje period – iDEAL och MobilePay erbjuds bara vid engångsköp. */
export const subscriptionPaymentIds = ["klarna", "visa", "mastercard", "amex", "applepay", "googlepay"];
