import Image from "next/image";

export type PaymentMethod = { id: string; name: string; file: string; width: number; height: number };

/** Betalsätt butiken tar emot via Stripe. Swish läggs tillbaka när Stripe godkänt ansökan (raden finns kvar nedan, avstängd). */
export const paymentMethods: PaymentMethod[] = [
  // { id: "swish", name: "Swish", file: "/payments/swish.svg", width: 578, height: 176 },
  { id: "klarna", name: "Klarna", file: "/payments/klarna.svg", width: 1448, height: 609 },
  { id: "visa", name: "Visa", file: "/payments/visa.svg", width: 780, height: 500 },
  { id: "mastercard", name: "Mastercard", file: "/payments/mastercard.svg", width: 780, height: 500 },
  { id: "amex", name: "American Express", file: "/payments/amex.svg", width: 780, height: 500 },
  { id: "applepay", name: "Apple Pay", file: "/payments/applepay.svg", width: 24, height: 24 },
  { id: "googlepay", name: "Google Pay", file: "/payments/googlepay.svg", width: 24, height: 24 },
];

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
  const list = only ? paymentMethods.filter((m) => only.includes(m.id)) : paymentMethods;
  const h = size === "sm" ? "h-6" : "h-8";
  return (
    <div className={className}>
      {label ? <p className="mb-2 text-center text-xs text-muted">{label}</p> : null}
      <ul className="flex flex-wrap items-center justify-center gap-2" aria-label="Betalsätt vi tar emot">
        {list.map((m) => (
          <li
            key={m.id}
            title={m.name}
            className={`inline-flex ${h} items-center justify-center rounded-md border border-line bg-white px-2`}
          >
            <Image
              src={m.file}
              alt={m.name}
              width={m.width}
              height={m.height}
              unoptimized
              className={`w-auto ${size === "sm" ? "h-3.5" : "h-4.5"} ${m.id === "applepay" || m.id === "googlepay" ? (size === "sm" ? "h-4" : "h-5") : ""}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const subscriptionPaymentIds = ["klarna", "visa", "mastercard", "amex", "applepay", "googlepay"];
