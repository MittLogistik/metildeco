import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { metaIdsFor, saveOrderFromSession } from "@/lib/orders";
import { hasPage } from "@/lib/routes";
import { company } from "@/lib/site";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { alternates, getI18n } from "@/i18n/server";
import { checkout } from "@/i18n/messages/checkout";
import { ClearCart } from "@/components/checkout/ClearCart";
import { MetaPurchase } from "@/components/consent/MetaEvents";
import { GooglePurchase } from "@/components/consent/GoogleTag";
import { CheckIcon } from "@/components/icons";
import { ButtonLink, Container } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, r } = await getI18n();
  return {
    title: checkout[locale].thanks.metaTitle,
    alternates: alternates(r.thanks, { key: "thanks" }),
    robots: { index: false, follow: false },
  };
}

export default async function ThankYouPage({ searchParams }: PageProps<"/[lang]/tack">) {
  const { locale, market, r } = await getI18n();
  const t = checkout[locale].thanks;
  const { session_id } = await searchParams;
  const id = typeof session_id === "string" ? session_id : null;

  if (!id || !stripeConfigured()) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl font-medium">{t.notFoundTitle}</h1>
        <p className="mt-2 text-muted">{t.notFoundText}</p>
        <ButtonLink href={r.home} className="mt-6">
          {t.home}
        </ButtonLink>
      </Container>
    );
  }

  // Sparar ordern om webhooken inte redan gjort det (idempotent), och hämtar den annars.
  let saved: Awaited<ReturnType<typeof saveOrderFromSession>> = null;
  try {
    saved = await saveOrderFromSession(id);
  } catch (e) {
    console.error("[tack] kunde inte spara ordern", e instanceof Error ? e.message : e);
  }

  const session = await stripe().checkout.sessions.retrieve(id, { expand: ["line_items"] });
  const paid = session.payment_status === "paid" || session.status === "complete";
  const email = session.customer_details?.email ?? "";
  const isSub = session.mode === "subscription";
  const isGiftCard = session.metadata?.kind === "giftcard";

  if (!paid) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl font-medium">{t.unpaidTitle}</h1>
        <p className="mt-2 text-muted">{t.unpaidText}</p>
        <ButtonLink href={r.checkout} className="mt-6">
          {t.backToCheckout}
        </ButtonLink>
      </Container>
    );
  }

  // Beloppen visas i orderns valuta (den kunden betalade i), inte sidans.
  const currency = (saved?.order.currency || session.currency || market.currency).toUpperCase();
  const fmt = (n: number) => formatPrice(n, currency);
  const orderNumber = saved?.order.order_number ?? session.id.replace(/^cs_(test|live)_/, "").slice(-8).toUpperCase();
  const lines = saved
    ? saved.items.map((i) => ({ key: i.product_slug + i.plan, label: `${i.qty} × ${i.name}${i.plan.startsWith("sub") ? t.subSuffix : ""}`, total: i.line_total }))
    : (session.line_items?.data ?? []).map((l) => ({ key: l.id, label: `${l.quantity} × ${l.description}`, total: (l.amount_total ?? 0) / 100 }));
  const shipping = saved ? saved.order.shipping : (session.shipping_cost?.amount_total ?? 0) / 100;
  const discount = saved ? saved.order.discount : (session.total_details?.amount_discount ?? 0) / 100;
  const total = saved ? saved.order.total : (session.amount_total ?? 0) / 100;
  let metaIds: string[] = [];
  try {
    const cartMeta = JSON.parse(session.metadata?.cart ?? "[]") as { k?: string; s?: string }[];
    metaIds = await metaIdsFor(cartMeta.filter((m) => m.s).map((m) => ({ k: m.k === "bundle" ? ("bundle" as const) : ("product" as const), s: m.s! })));
  } catch {
    metaIds = saved?.items.map((i) => i.product_slug) ?? [];
  }
  const showAccount = hasPage("account", locale);

  return (
    <Container className="py-12 sm:py-16">
      <ClearCart />
      {saved ? <MetaPurchase sessionId={session.id} value={saved.order.total} currency={currency} ids={metaIds} subscription={saved.order.has_subscription} /> : null}
      {saved ? <GooglePurchase orderNumber={orderNumber} value={saved.order.total} currency={currency} email={email} /> : null}
      <div className="mx-auto max-w-2xl">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <CheckIcon size={28} />
        </span>
        <h1 className="mt-5 font-display text-4xl font-medium tracking-tight">{isGiftCard ? t.giftCardTitle : t.title}</h1>
        <p className="mt-3 text-lg text-muted">
          {isGiftCard ? (
            <>
              {t.giftCardBefore}
              <strong className="text-foreground">{email}</strong>
              {session.metadata?.gift_recipient ? (
                <>
                  {t.giftCardAnd}
                  <strong className="text-foreground">{session.metadata.gift_recipient}</strong>
                </>
              ) : null}
              {t.giftCardAfter}
            </>
          ) : (
            <>
              {t.receivedBefore(isSub)}
              <strong className="text-foreground">{email}</strong>
              {t.receivedAfter}
            </>
          )}
        </p>

        <section className="mt-10 rounded-card border border-line p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{t.orderNumber}</span>
            <span className="font-mono font-medium">{orderNumber}</span>
          </div>
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-4 py-3 text-sm">
                <span>{l.label}</span>
                <span className="tabular-nums">{fmt(l.total)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
            {discount > 0 ? (
              <div className="flex justify-between text-success">
                <dt>{t.discount}</dt>
                <dd className="tabular-nums">−{fmt(discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted">{t.shipping}</dt>
              <dd className="tabular-nums">{shipping === 0 ? t.free : fmt(shipping)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>{t.paid}</dt>
              <dd className="tabular-nums">{fmt(total)}</dd>
            </div>
          </dl>
        </section>

        {isSub ? (
          <p className="mt-6 rounded-2xl bg-sand-soft p-5 text-sm text-muted">
            {t.subRenew}{" "}
            {showAccount ? (
              <>
                {t.subManageAccount}
                <Link href={r.account} className="underline">
                  {t.account}
                </Link>
                {t.orEmail}
              </>
            ) : (
              t.subManageEmail
            )}
            <a href={`mailto:${company.email}`} className="underline">
              {company.email}
            </a>
            .
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={r.products}>{t.continueShopping}</ButtonLink>
          <Link href={r.contact} className="inline-flex h-11 items-center px-2 text-sm font-medium underline underline-offset-2">
            {t.contact}
          </Link>
        </div>
      </div>
    </Container>
  );
}
