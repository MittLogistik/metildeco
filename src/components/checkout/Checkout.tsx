"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CartLineRow } from "@/components/cart/CartLineRow";
import { CartTotals } from "@/components/cart/CartTotals";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { company, site } from "@/lib/site";
import { track } from "@/lib/track";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LockIcon } from "@/components/icons";
import { PaymentMethods, subscriptionPaymentIds } from "@/components/PaymentMethods";
import { TrustBar } from "@/components/TrustBar";
import { Button, ButtonLink, Container } from "@/components/ui";

/**
 * Kassa: kunden ser sin korg, kan byta till prenumeration och går sedan med ett
 * klick till Stripe Checkout, som samlar in adress, telefon, fraktval och betalning.
 */
export function Checkout() {
  const cart = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasSub = cart.resolved.some((l) => l.plan === "sub");
  const onceLines = cart.resolved.filter((l) => l.plan === "once" && l.kind === "product");

  if (cart.resolved.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl font-medium">Din varukorg är tom</h1>
        <p className="mt-2 text-muted">Lägg till något från sortimentet så fortsätter vi här.</p>
        <ButtonLink href={routes.products} className="mt-6">
          Utforska sortimentet
        </ButtonLink>
      </Container>
    );
  }

  const pay = async () => {
    setSubmitting(true);
    setError(null);
    track("begin_checkout");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: cart.lines.map((l) => ({ kind: l.kind, slug: l.slug, qty: l.qty, plan: l.plan, intervalDays: l.intervalDays })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Kunde inte starta betalningen.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel. Försök igen.");
      setSubmitting(false);
    }
  };

  const subSavings = onceLines.reduce((s, l) => s + Math.round(l.listPrice * site.subscriptionDiscount / 100) * l.qty, 0);

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Kassa" }]} />
      <h1 className="mt-6 font-display text-4xl font-medium tracking-tight">Kassa</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        <section>
          <h2 className="sr-only">Din varukorg</h2>
          <ul className="divide-y divide-line border-y border-line">
            {cart.resolved.map((line) => (
              <CartLineRow key={line.key} line={line} />
            ))}
          </ul>

          {onceLines.length > 0 ? (
            <div className="mt-6 rounded-card bg-primary-soft p-5">
              <h2 className="font-display text-lg font-medium">Gör om ordern till prenumeration</h2>
              <p className="mt-1 text-sm text-muted">
                Samma produkter levererade automatiskt. {site.subscriptionDiscount} % rabatt på varje leverans, alltid fri frakt,
                och du pausar eller avslutar när du vill. Du sparar <strong className="text-foreground">{formatPrice(subSavings)}</strong> direkt.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onceLines.forEach((l) => cart.setPlan(l.key, "sub", 30))}
              >
                Byt allt till prenumeration
              </Button>
            </div>
          ) : null}

          <div className="mt-8 border-t border-line pt-6">
            <TrustBar compact />
          </div>
        </section>

        <aside className="rounded-card border border-line bg-sand-soft p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-medium">Sammanfattning</h2>
          <div className="mt-4">
            <CartTotals />
          </div>
          {error ? (
            <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
              {error}
            </p>
          ) : null}
          <Button size="lg" className="mt-5 w-full" onClick={pay} disabled={submitting}>
            {submitting ? "Förbereder säker betalning …" : "Till betalning"}
          </Button>
          <p className="mt-3 flex items-start gap-2 text-xs text-muted">
            <LockIcon size={14} className="mt-0.5 shrink-0" />
            <span>Adress, fraktsätt och betalning fylls i på nästa sida hos Stripe.</span>
          </p>
          <PaymentMethods
            size="sm"
            className="mt-3"
            only={hasSub ? subscriptionPaymentIds : undefined}
            label={hasSub ? "Prenumerationer betalas med" : "Betala med"}
          />
          <p className="mt-3 text-xs text-muted">
            Genom att slutföra köpet godkänner du våra{" "}
            <Link href={routes.terms} className="underline">
              köpvillkor
            </Link>{" "}
            och{" "}
            <Link href={routes.privacy} className="underline">
              integritetspolicy
            </Link>
            . Säljare: {company.legalName}, org.nr {company.orgNumber}.
          </p>
        </aside>
      </div>
    </Container>
  );
}
