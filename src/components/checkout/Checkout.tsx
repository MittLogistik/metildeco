"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CartLineRow } from "@/components/cart/CartLineRow";
import { CartTotals } from "@/components/cart/CartTotals";
import { cartStore, type CartLine } from "@/components/cart/cartStore";
import { clientValues, useClientValue } from "./clientStore";
import { storedVariant } from "@/lib/experiment-client";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { subscriptionUnitPrice } from "@/lib/products";
import { useI18n } from "@/i18n/client";
import { checkout as checkoutMessages } from "@/i18n/messages/checkout";
import { track } from "@/lib/track";
import { metaTrack } from "@/components/consent/MetaPixel";
import { storedSource, visitorId } from "@/components/affiliate/ClickTracker";
import { checkoutSource } from "@/lib/attribution";
import { metaContentId } from "@/lib/consent";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LockIcon } from "@/components/icons";
import { PaymentMethods, subscriptionPaymentIds } from "@/components/PaymentMethods";
import { TrustBar } from "@/components/TrustBar";
import { Button, ButtonLink, Container } from "@/components/ui";

const field = "h-12 w-full rounded-xl border border-line bg-white px-3.5 text-base placeholder:text-muted-soft focus:border-primary focus:outline-none";

/**
 * Kassa: kunden ser sin korg, anger sin e-post, kan byta till prenumeration och går sedan med
 * ett klick till Stripe Checkout, som samlar in adress, telefon, fraktval och betalning.
 * E-posten gör att korgen kan sparas och påminnas om. Länken ?korg=<id>&kod=<kod> från ett
 * påminnelsemejl fyller på korgen igen och lägger på rabattkoden i betalsteget.
 */
export function Checkout() {
  const cart = useCart();
  const { locale, r } = useI18n();
  const t = checkoutMessages[locale];
  const fmt = (n: number) => formatPrice(n, cart.currency);
  const router = useRouter();
  const params = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const email = useClientValue("email");
  const code = useClientValue("code");
  const restoring = useClientValue("restoring") === "1";
  const setEmail = (v: string) => clientValues.set("email", v);
  const setCode = (v: string) => clientValues.set("code", v);
  const hasSub = cart.resolved.some((l) => l.plan === "sub");
  const onceLines = cart.resolved.filter((l) => l.plan === "once" && l.kind === "product");

  // Ta emot korg och kod från en påminnelselänk (?korg=<id>&kod=<kod>)
  useEffect(() => {
    const korg = params.get("korg");
    const kod = params.get("kod");
    if (kod) clientValues.set("code", kod.toUpperCase());
    if (korg) {
      clientValues.set("restoring", "1");
      fetch(`/api/cart/${encodeURIComponent(korg)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { lines?: { kind: "product" | "bundle"; slug: string; qty: number; plan: "once" | "sub" | "gift"; intervalDays: number | null }[]; email?: string } | null) => {
          if (data?.lines?.length) {
            const lines: CartLine[] = data.lines.map((l) => ({
              key: l.kind === "bundle" ? `bundle:${l.slug}` : l.plan === "gift" ? `gift:${l.slug}` : l.plan === "sub" ? `product:${l.slug}:sub:${l.intervalDays ?? 30}` : `product:${l.slug}:once`,
              kind: l.kind,
              slug: l.slug,
              qty: l.qty,
              plan: l.plan,
              intervalDays: l.plan === "sub" ? ((l.intervalDays === 60 || l.intervalDays === 90 ? l.intervalDays : 30) as 30 | 60 | 90) : undefined,
            }));
            cartStore.set(lines);
          }
          if (data?.email) clientValues.set("email", data.email);
        })
        .catch(() => undefined)
        .finally(() => {
          clientValues.set("restoring", "");
          router.replace(r.checkout);
        });
    } else if (kod) {
      router.replace(r.checkout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (cart.resolved.length === 0 && !restoring) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl font-medium">{t.emptyTitle}</h1>
        <p className="mt-2 text-muted">{t.emptyText}</p>
        <ButtonLink href={r.products} className="mt-6">
          {t.explore}
        </ButtonLink>
      </Container>
    );
  }

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

  const pay = async () => {
    if (!emailOk) {
      setError(t.emailRequired);
      return;
    }
    setSubmitting(true);
    setError(null);
    setEmail(email.trim().toLowerCase());
    track("begin_checkout");
    metaTrack("InitiateCheckout", { value: cart.subtotal, currency: cart.currency, num_items: cart.count, content_ids: cart.resolved.map((l) => metaContentId(l.kind, l.slug, l.product?.sku ?? l.bundle?.sku)), content_type: "product" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Språket avgör marknad, valuta, priser och leveransland på servern
          locale,
          // Bara giltiga rader: en gåva utan sitt flerpack skickas inte med
          lines: cart.resolved.map((l) => ({ kind: l.kind, slug: l.slug, qty: l.qty, plan: l.plan, intervalDays: l.intervalDays })),
          visitorId: visitorId(),
          source: checkoutSource(storedSource()),
          email: email.trim().toLowerCase(),
          code: code || null,
          variant: storedVariant(),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? t.payFailed);
      setCode("");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.genericError);
      setSubmitting(false);
    }
  };

  // Samma styckpris som korgen och servern räknar för prenumeration
  const subSavings = onceLines.reduce(
    (s, l) => s + (l.listPrice - subscriptionUnitPrice(l.listPrice, site.subscriptionDiscount, cart.currency)) * l.qty,
    0,
  );

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: t.title }]} />
      <h1 className="mt-6 font-display text-4xl font-medium tracking-tight">{t.title}</h1>
      {restoring ? <p className="mt-3 text-sm text-muted">{t.restoring}</p> : null}

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        <section>
          <h2 className="sr-only">{t.cartHeading}</h2>
          <ul className="divide-y divide-line border-y border-line">
            {cart.resolved.map((line) => (
              <CartLineRow key={line.key} line={line} />
            ))}
          </ul>

          {onceLines.length > 0 ? (
            <div className="mt-6 rounded-card bg-primary-soft p-5">
              <h2 className="font-display text-lg font-medium">{t.convertTitle}</h2>
              <p className="mt-1 text-sm text-muted">
                {t.convertBefore(site.subscriptionDiscount)}
                <strong className="text-foreground">{fmt(subSavings)}</strong>
                {t.convertAfter}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onceLines.forEach((l) => cart.setPlan(l.key, "sub", 30))}
              >
                {t.convertAll}
              </Button>
            </div>
          ) : null}

          <div className="mt-8 border-t border-line pt-6">
            <TrustBar compact />
          </div>
        </section>

        <aside className="rounded-card border border-line bg-sand-soft p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-medium">{t.summary}</h2>
          <div className="mt-4">
            <CartTotals />
          </div>
          <label className="mt-5 block text-sm">
            <span className="mb-1.5 block font-medium">{t.email}</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
            <span className="mt-1 block text-xs text-muted">{t.emailHint}</span>
          </label>
          {code ? (
            <p className="mt-3 rounded-xl bg-primary-soft px-3 py-2 text-sm">
              {t.codeBefore}
              <strong className="font-mono">{code}</strong>
              {t.codeAfter}{" "}
              <button type="button" className="underline underline-offset-2" onClick={() => setCode("")}>
                {t.remove}
              </button>
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
              {error}
            </p>
          ) : null}
          <Button size="lg" className="mt-5 w-full" onClick={pay} disabled={submitting || restoring}>
            {submitting ? t.submitting : t.pay}
          </Button>
          <p className="mt-3 flex items-start gap-2 text-xs text-muted">
            <LockIcon size={14} className="mt-0.5 shrink-0" />
            <span>
              {t.stripeNote}
              {code ? "" : t.codeThere}
            </span>
          </p>
          <PaymentMethods
            size="sm"
            className="mt-3"
            only={hasSub ? subscriptionPaymentIds : undefined}
            label={hasSub ? t.subPayLabel : t.payWith}
          />
          <p className="mt-3 text-xs text-muted">
            {t.legalBefore}
            <Link href={r.terms} className="underline">
              {t.terms}
            </Link>
            {t.and}
            <Link href={r.privacy} className="underline">
              {t.privacy}
            </Link>
            . {t.reminder}
          </p>
        </aside>
      </div>
    </Container>
  );
}
