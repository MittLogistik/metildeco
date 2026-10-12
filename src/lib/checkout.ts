/**
 * Kassalogik som delas av API:t och kassasidan.
 * Priser räknas alltid om på servern utifrån katalogen – klienten skickar bara slug, antal och plan.
 * Adress, telefon och fraktval samlas in av Stripe Checkout.
 */
import type Stripe from "stripe";
import { isChannel, type Channel } from "./attribution";
import { getBundle, getProduct } from "./catalog";
import { defaultLocale, isLocale, markets, type Locale } from "./i18n";
import { isInStock, offerGiftSlugs, subscriptionUnitPrice, tieredUnitPrice } from "./products";
import { ratesFor, shippingCost } from "./shipping";
import { site } from "./site";

export const SUB_INTERVALS = [30, 60, 90] as const;
export type SubInterval = (typeof SUB_INTERVALS)[number];

export type CheckoutLine = {
  kind: "product" | "bundle";
  slug: string;
  qty: number;
  /** gift = gåva som följer med ett flerpack, 0 kr. Kräver en kvalificerande prenumerationsrad i samma korg. */
  plan: "once" | "sub" | "gift";
  intervalDays?: SubInterval;
};

export type CheckoutRequest = {
  lines: CheckoutLine[];
  email: string | null;
  /** Besökarens id från localStorage, för att knyta ett affiliateklick till ordern. */
  visitorId: string | null;
  /** Rabattkod som kommit via länk (t.ex. påminnelse om övergiven korg) och ska läggas på automatiskt. */
  code: string | null;
  /** Vilken köpruta kunden såg (A/B-test), sparas på ordern. */
  variant: string | null;
  /** Varifrån kunden kom (lib/attribution), sparas på ordern. */
  source: { ch: Channel; d: string | null; first: Channel | null };
  /** Butikens språk = marknad (valuta, leveransland, fraktsätt). */
  locale: Locale;
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
    const plan = x.plan === "sub" ? "sub" : x.plan === "gift" && x.kind !== "bundle" ? "gift" : "once";
    return {
      kind: x.kind === "bundle" ? "bundle" : "product",
      slug: clean(x.slug, 120),
      qty: plan === "gift" ? 1 : qty,
      plan,
      intervalDays: (SUB_INTERVALS as readonly number[]).includes(interval) ? (interval as SubInterval) : 30,
    };
  });
  if (lines.filter((l) => l.plan !== "gift").length === 0) throw new Error("Varukorgen är tom.");
  const email = clean(b.email, 200).toLowerCase();
  const visitorId = clean(b.visitorId, 100) || null;
  const code = clean(b.code, 40).toUpperCase().replace(/[^A-Z0-9_-]/g, "") || null;
  const variant = clean(b.variant, 10).replace(/[^a-z0-9]/gi, "") || null;
  const s = (b.source ?? {}) as Record<string, unknown>;
  const source = { ch: isChannel(s.ch) ? s.ch : "unknown", d: clean(s.d, 150) || null, first: isChannel(s.first) ? s.first : null } as CheckoutRequest["source"];
  const locale = isLocale(b.locale) ? b.locale : defaultLocale;
  return { locale, lines, email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : null, visitorId, code, variant, source };
}

/** Felmeddelanden som visas för kunden i kassan. */
const errors: Record<Locale, { bundleGone: string; productGone: string; bundleSoldOut: (n: string) => string; soldOut: (n: string) => string; gift: (n: string) => string }> = {
  sv: {
    bundleGone: "Ett paket i varukorgen finns inte längre.",
    productGone: "En produkt i varukorgen finns inte längre.",
    bundleSoldOut: (n) => `${n} är tillfälligt slut.`,
    soldOut: (n) => `${n} är slutsåld i det antal du valt.`,
    gift: (n) => `Gåvan ${n} kräver ett flerpack med prenumeration i varukorgen.`,
  },
  fi: {
    bundleGone: "Ostoskorissa oleva paketti ei ole enää saatavilla.",
    productGone: "Ostoskorissa oleva tuote ei ole enää saatavilla.",
    bundleSoldOut: (n) => `${n} on tilapäisesti loppu.`,
    soldOut: (n) => `${n} on loppuunmyyty valitsemassasi määrässä.`,
    gift: (n) => `Lahja ${n} edellyttää ostoskorissa olevaa monipakkauksen kestotilausta.`,
  },
  da: {
    bundleGone: "En pakke i kurven findes ikke længere.",
    productGone: "Et produkt i kurven findes ikke længere.",
    bundleSoldOut: (n) => `${n} er midlertidigt udsolgt.`,
    soldOut: (n) => `${n} er udsolgt i det antal, du har valgt.`,
    gift: (n) => `Gaven ${n} kræver en flerpakning med abonnement i kurven.`,
  },
  nl: {
    bundleGone: "Een pakket in je winkelwagen is niet meer beschikbaar.",
    productGone: "Een product in je winkelwagen is niet meer beschikbaar.",
    bundleSoldOut: (n) => `${n} is tijdelijk uitverkocht.`,
    soldOut: (n) => `${n} is uitverkocht in het gekozen aantal.`,
    gift: (n) => `Het cadeau ${n} vereist een multipack met abonnement in je winkelwagen.`,
  },
};

/** Sätter pris på varje rad utifrån katalogen. Okända eller slutsålda varor ger fel. */
export async function priceLines(lines: CheckoutLine[], locale: Locale = defaultLocale): Promise<PricedLine[]> {
  const currency = markets[locale].currency;
  const e = errors[locale];
  const out: PricedLine[] = [];
  for (const line of lines) {
    if (line.kind === "bundle") {
      const bundle = await getBundle(line.slug, locale);
      if (!bundle) throw new Error(e.bundleGone);
      const soldOut = bundle.items.some((i) => i.product.trackStock && i.product.stock < i.qty * line.qty);
      if (soldOut) throw new Error(e.bundleSoldOut(bundle.name));
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
    const product = await getProduct(line.slug, locale);
    if (!product) throw new Error(e.productGone);
    if (!isInStock(product) || (product.trackStock && product.stock < line.qty)) {
      throw new Error(e.soldOut(product.name));
    }
    if (line.plan === "gift") {
      // Gåvan kräver ett flerpack i samma korg som ger rätt till just den gåvan
      let qualifies = false;
      for (const other of lines) {
        if (other.kind !== "product" || other.plan !== "sub") continue;
        const p = await getProduct(other.slug, locale);
        if (p && p.offerEnabled && other.qty >= p.offerPackQty && offerGiftSlugs(p).includes(line.slug)) qualifies = true;
      }
      if (!qualifies) throw new Error(e.gift(product.name));
      out.push({ ...line, qty: 1, name: product.name, unitPrice: 0, image: product.images[0] ?? null, freeShipping: true });
      continue;
    }
    const unitPrice =
      line.plan === "sub"
        ? subscriptionUnitPrice(product.price, site.subscriptionDiscount, currency)
        : tieredUnitPrice(product, line.qty, currency);
    out.push({ ...line, name: product.name, unitPrice, image: product.images[0] ?? null, freeShipping: line.plan === "sub" });
  }
  return out;
}

export const subtotalOf = (priced: PricedLine[]) => priced.reduce((s, l) => s + l.unitPrice * l.qty, 0);

/** Belopp i minsta enheten (öre/cent). SEK, EUR och DKK har alla två decimaler. */
export const minor = (amount: number) => Math.round(amount * 100);

/** Bygger Stripe-raderna. Prenumerationsrader blir återkommande, resten engångsköp. */
export function buildLineItems(priced: PricedLine[], origin: string, locale: Locale = defaultLocale): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const t = lineNames[locale];
  return priced.map((l) => ({
    quantity: l.qty,
    price_data: {
      currency: markets[locale].currency.toLowerCase(),
      unit_amount: minor(l.unitPrice),
      tax_behavior: "inclusive",
      product_data: {
        name: l.plan === "sub" ? t.sub(l.name, l.intervalDays ?? 30) : l.plan === "gift" ? t.gift(l.name) : l.name,
        images: l.image ? [`${origin}${l.image}`] : [],
        metadata: { slug: l.slug, kind: l.kind, plan: l.plan },
      },
      ...(l.plan === "sub" ? { recurring: { interval: "day" as const, interval_count: l.intervalDays ?? 30 } } : {}),
    },
  }));
}

/** Radnamn hos Stripe (kvitto och kassa) per språk. */
const lineNames: Record<Locale, { sub: (name: string, days: number) => string; gift: (name: string) => string; freeShipping: string; free: string; shipping: string }> = {
  sv: { sub: (n, d) => `${n} – prenumeration var ${d}:e dag`, gift: (n) => `Gåva – ${n}`, freeShipping: "Fri frakt – spårbart brev", free: "fri frakt", shipping: "Frakt" },
  fi: { sub: (n, d) => `${n} – kestotilaus ${d} päivän välein`, gift: (n) => `Lahja – ${n}`, freeShipping: "Ilmainen toimitus – kirje seurannalla", free: "ilmainen toimitus", shipping: "Toimitus" },
  da: { sub: (n, d) => `${n} – abonnement hver ${d}. dag`, gift: (n) => `Gave – ${n}`, freeShipping: "Fri fragt – sporbart brev", free: "fri fragt", shipping: "Fragt" },
  nl: { sub: (n, d) => `${n} – abonnement elke ${d} dagen`, gift: (n) => `Cadeau – ${n}`, freeShipping: "Gratis verzending – brief met track & trace", free: "gratis verzending", shipping: "Verzending" },
};
export const shippingLineName = (locale: Locale, label: string) => `${lineNames[locale].shipping} – ${label}`;

/** Fraktsättet på prenumerationsordrar (alltid fraktfria). */
export const freeShippingLabel = (locale: Locale) => lineNames[locale].freeShipping;

/** Radnamnet hos Stripe utan prenumerations- eller gåvotillägg, på alla språk (för order_items). */
export const stripLineSuffix = (name: string) =>
  name
    .replace(/ – (prenumeration var \d+:e dag|kestotilaus \d+ päivän välein|abonnement hver \d+\. dag|abonnement elke \d+ dagen).*$/, "")
    .replace(/^(Gåva|Lahja|Gave|Cadeau) – /, "");

/**
 * Fraktalternativ för marknaden som Stripe visar i kassan. Är alla rader fraktfria
 * (prenumerationer, paket) blir det ett enda kostnadsfritt alternativ.
 */
export function buildShippingOptions(priced: PricedLine[], locale: Locale = defaultLocale): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  const subtotal = subtotalOf(priced);
  const allFree = priced.every((l) => l.freeShipping);
  const rates = ratesFor(locale);
  const currency = markets[locale].currency.toLowerCase();
  const t = lineNames[locale];
  const [min, max] = markets[locale].deliveryDays;
  const estimate = {
    minimum: { unit: "business_day" as const, value: min },
    maximum: { unit: "business_day" as const, value: max },
  };
  if (allFree) {
    return [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: t.freeShipping,
          fixed_amount: { amount: 0, currency },
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
        display_name: cost === 0 ? `${r.label} – ${t.free}` : r.label,
        fixed_amount: { amount: minor(cost), currency },
        delivery_estimate: estimate,
        metadata: { method: r.method },
      },
    };
  });
}
