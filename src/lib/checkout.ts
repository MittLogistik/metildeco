/**
 * Kassalogik som delas av API:t och kassasidan.
 * Priser räknas alltid om på servern utifrån katalogen – klienten skickar bara slug, antal och plan.
 * Adress, telefon och fraktval samlas in av Stripe Checkout.
 */
import type Stripe from "stripe";
import { getBundle, getProduct } from "./catalog";
import { isInStock, tieredUnitPrice } from "./products";
import { ratesForZone, shippingCost } from "./shipping";
import { site } from "./site";

export const SUB_INTERVALS = [30, 60, 90] as const;
export type SubInterval = (typeof SUB_INTERVALS)[number];

export type CheckoutLine = {
  kind: "product" | "bundle";
  slug: string;
  qty: number;
  plan: "once" | "sub";
  intervalDays?: SubInterval;
};

export type CheckoutRequest = {
  lines: CheckoutLine[];
  email: string | null;
  /** Besökarens id från localStorage, för att knyta ett affiliateklick till ordern. */
  visitorId: string | null;
};

export type PricedLine = CheckoutLine & {
  name: string;
  unitPrice: number;
  image: string | null;
  freeShipping: boolean;
};

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Validerar inkommande JSON och kastar ett läsbart fel om något saknas. */
export function parseCheckoutRequest(body: unknown): CheckoutRequest {
  if (!body || typeof body !== "object") throw new Error("Ogiltig begäran.");
  const b = body as Record<string, unknown>;
  const rawLines = Array.isArray(b.lines) ? b.lines : [];
  const lines: CheckoutLine[] = rawLines.map((l) => {
    const x = (l ?? {}) as Record<string, unknown>;
    const qty = Math.min(20, Math.max(1, Math.floor(Number(x.qty) || 1)));
    const interval = Number(x.intervalDays);
    return {
      kind: x.kind === "bundle" ? "bundle" : "product",
      slug: clean(x.slug, 120),
      qty,
      plan: x.plan === "sub" ? "sub" : "once",
      intervalDays: (SUB_INTERVALS as readonly number[]).includes(interval) ? (interval as SubInterval) : 30,
    };
  });
  if (lines.length === 0) throw new Error("Varukorgen är tom.");
  const email = clean(b.email, 200).toLowerCase();
  const visitorId = clean(b.visitorId, 100) || null;
  return { lines, email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : null, visitorId };
}

/** Sätter pris på varje rad utifrån katalogen. Okända eller slutsålda varor ger fel. */
export async function priceLines(lines: CheckoutLine[]): Promise<PricedLine[]> {
  const out: PricedLine[] = [];
  for (const line of lines) {
    if (line.kind === "bundle") {
      const bundle = await getBundle(line.slug);
      if (!bundle) throw new Error("Ett paket i varukorgen finns inte längre.");
      const soldOut = bundle.items.some((i) => i.product.trackStock && i.product.stock < i.qty * line.qty);
      if (soldOut) throw new Error(`${bundle.name} är tillfälligt slut.`);
      out.push({
        ...line,
        plan: "once",
        name: bundle.name,
        unitPrice: bundle.price,
        image: bundle.images[0] ?? null,
        freeShipping: bundle.freeShipping,
      });
      continue;
    }
    const product = await getProduct(line.slug);
    if (!product) throw new Error("En produkt i varukorgen finns inte längre.");
    if (!isInStock(product) || (product.trackStock && product.stock < line.qty)) {
      throw new Error(`${product.name} är slutsåld i det antal du valt.`);
    }
    const unitPrice =
      line.plan === "sub"
        ? Math.round(product.price * (1 - site.subscriptionDiscount / 100))
        : tieredUnitPrice(product, line.qty);
    out.push({ ...line, name: product.name, unitPrice, image: product.images[0] ?? null, freeShipping: line.plan === "sub" });
  }
  return out;
}

export const subtotalOf = (priced: PricedLine[]) => priced.reduce((s, l) => s + l.unitPrice * l.qty, 0);

const sek = (amount: number) => Math.round(amount * 100);

/** Bygger Stripe-raderna. Prenumerationsrader blir återkommande, resten engångsköp. */
export function buildLineItems(priced: PricedLine[], origin: string): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return priced.map((l) => ({
    quantity: l.qty,
    price_data: {
      currency: "sek",
      unit_amount: sek(l.unitPrice),
      tax_behavior: "inclusive",
      product_data: {
        name: l.plan === "sub" ? `${l.name} – prenumeration var ${l.intervalDays ?? 30}:e dag` : l.name,
        images: l.image ? [`${origin}${l.image}`] : [],
        metadata: { slug: l.slug, kind: l.kind, plan: l.plan },
      },
      ...(l.plan === "sub" ? { recurring: { interval: "day" as const, interval_count: l.intervalDays ?? 30 } } : {}),
    },
  }));
}

/**
 * Fraktalternativ för Sverige som Stripe visar i kassan. Är alla rader fraktfria
 * (prenumerationer, paket) blir det ett enda kostnadsfritt alternativ.
 */
export function buildShippingOptions(priced: PricedLine[]): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  const subtotal = subtotalOf(priced);
  const allFree = priced.every((l) => l.freeShipping);
  const rates = ratesForZone("se");
  const estimate = {
    minimum: { unit: "business_day" as const, value: 1 },
    maximum: { unit: "business_day" as const, value: 3 },
  };
  if (allFree) {
    return [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "Fri frakt – spårbart brev",
          fixed_amount: { amount: 0, currency: "sek" },
          delivery_estimate: estimate,
        },
      },
    ];
  }
  return rates.map((r) => {
    const cost = shippingCost(r, subtotal);
    return {
      shipping_rate_data: {
        type: "fixed_amount",
        display_name: cost === 0 ? `${r.label} – fri frakt` : r.label,
        fixed_amount: { amount: sek(cost), currency: "sek" },
        delivery_estimate: estimate,
        metadata: { method: r.method },
      },
    };
  });
}
