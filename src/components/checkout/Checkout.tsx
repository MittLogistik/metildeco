"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { shippingCost, swedenRates } from "@/lib/shipping";
import { company } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LockIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { Button, ButtonLink, Container } from "@/components/ui";

const field =
  "h-12 w-full rounded-xl border border-line bg-white px-3.5 text-base placeholder:text-muted-soft focus:border-primary focus:outline-none";

/**
 * Kassa – kontaktuppgifter, leveransadress och fraktsätt. Betalningen sker hos
 * Stripe Checkout (kort, Apple Pay, Google Pay); priserna räknas om på servern.
 */
export function Checkout() {
  const cart = useCart();
  const [method, setMethod] = useState(swedenRates[0]?.method ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rate = swedenRates.find((r) => r.method === method) ?? swedenRates[0]!;
  const allFree = cart.resolved.length > 0 && cart.resolved.every((l) => l.freeShipping);
  const shipping = allFree ? 0 : shippingCost(rate, cart.subtotal);
  const total = cart.subtotal + shipping;
  const hasSub = cart.resolved.some((l) => l.plan === "sub");

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

  const submit = async (form: HTMLFormElement) => {
    setSubmitting(true);
    setError(null);
    const f = new FormData(form);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: cart.lines.map((l) => ({ kind: l.kind, slug: l.slug, qty: l.qty, plan: l.plan, intervalDays: l.intervalDays })),
          customer: {
            email: f.get("email"),
            firstName: f.get("firstName"),
            lastName: f.get("lastName"),
            phone: f.get("phone"),
            address: f.get("address"),
            zip: f.get("zip"),
            city: f.get("city"),
            country: f.get("country"),
          },
          shippingMethod: method,
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

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Kassa" }]} />
      <h1 className="mt-6 font-display text-4xl font-medium tracking-tight">Kassa</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <form
          className="space-y-10"
          onSubmit={(e) => {
            e.preventDefault();
            void submit(e.currentTarget);
          }}
        >
          <section>
            <h2 className="font-display text-xl font-medium">1. Kontaktuppgifter</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2">
                <span className="mb-1.5 block font-medium">E-post</span>
                <input name="email" type="email" required autoComplete="email" inputMode="email" className={field} />
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block font-medium">Förnamn</span>
                <input name="firstName" required autoComplete="given-name" className={field} />
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block font-medium">Efternamn</span>
                <input name="lastName" required autoComplete="family-name" className={field} />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="mb-1.5 block font-medium">Telefon</span>
                <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className={field} />
                <span className="mt-1.5 block text-xs text-muted">Används bara för leveransavisering.</span>
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium">2. Leveransadress</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className="text-sm sm:col-span-3">
                <span className="mb-1.5 block font-medium">Adress</span>
                <input name="address" required autoComplete="street-address" className={field} />
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block font-medium">Postnummer</span>
                <input name="zip" required autoComplete="postal-code" inputMode="numeric" className={field} />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="mb-1.5 block font-medium">Ort</span>
                <input name="city" required autoComplete="address-level2" className={field} />
              </label>
              <label className="text-sm sm:col-span-3">
                <span className="mb-1.5 block font-medium">Land</span>
                <select name="country" className={field} defaultValue="SE">
                  <option value="SE">Sverige</option>
                </select>
                <span className="mt-1.5 block text-xs text-muted">Fler länder aktiveras när butiken går live på fler marknader.</span>
              </label>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-medium">3. Fraktsätt</h2>
            {allFree ? (
              <p className="mt-3 rounded-xl bg-primary-soft p-4 text-sm">
                Din order innehåller bara prenumerationer eller paket med fri frakt – ingen fraktkostnad tillkommer.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {swedenRates.map((r) => {
                  const cost = shippingCost(r, cart.subtotal);
                  const active = r.method === method;
                  return (
                    <li key={r.method}>
                      <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${active ? "border-primary bg-primary-soft" : "border-line"}`}>
                        <input type="radio" name="shipping" value={r.method} checked={active} onChange={() => setMethod(r.method)} className="accent-primary" />
                        <span className="flex-1">
                          <span className="block text-sm font-medium">{r.label}</span>
                          <span className="block text-xs text-muted">{r.description}</span>
                        </span>
                        <span className="text-sm font-medium tabular-nums">{cost === 0 ? "Fri" : formatPrice(cost)}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl font-medium">4. Betalning</h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <LockIcon size={16} /> Du slutför betalningen på nästa sida hos Stripe – kort, Apple Pay eller Google Pay.
            </p>
            {hasSub ? (
              <p className="mt-3 rounded-xl bg-sand-soft p-4 text-sm text-muted">
                Prenumerationen dras automatiskt med det intervall du valt och kan avslutas när som helst utan bindningstid.
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
                {error}
              </p>
            ) : null}
            <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
              {submitting ? "Förbereder säker betalning …" : `Till betalning · ${formatPrice(total)}`}
            </Button>
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
          </section>
        </form>

        <aside className="rounded-card border border-line bg-sand-soft p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-medium">Din order</h2>
          <ul className="mt-4 divide-y divide-line">
            {cart.resolved.map((line) => (
              <li key={line.key} className="flex gap-3 py-3">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                  <Image src={line.image} alt="" fill sizes="64px" className="object-contain p-1" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm font-medium">{line.name}</span>
                  <span className="block text-xs text-muted">
                    {line.plan === "sub" ? `Prenumeration – var ${line.intervalDays ?? 30}:e dag` : "Engångsköp"}
                  </span>
                  <span className="mt-1.5 inline-flex items-center rounded-full border border-line bg-white">
                    <button type="button" aria-label="Minska antal" onClick={() => cart.setQty(line.key, line.qty - 1)} className="p-1.5">
                      <MinusIcon size={12} />
                    </button>
                    <span className="min-w-5 text-center text-xs tabular-nums">{line.qty}</span>
                    <button type="button" aria-label="Öka antal" onClick={() => cart.setQty(line.key, line.qty + 1)} className="p-1.5">
                      <PlusIcon size={12} />
                    </button>
                  </span>
                </span>
                <span className="text-sm font-medium tabular-nums">{formatPrice(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Delsumma</dt>
              <dd className="tabular-nums">{formatPrice(cart.listTotal)}</dd>
            </div>
            {cart.discount > 0 ? (
              <div className="flex justify-between text-success">
                <dt>Rabatt</dt>
                <dd className="tabular-nums">−{formatPrice(cart.discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted">Frakt</dt>
              <dd className="tabular-nums">{shipping === 0 ? "Fri" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
              <dt>Att betala</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
            <p className="text-xs text-muted">Inkl. moms. Priser i SEK. Rabattkod anges i betalsteget.</p>
          </dl>
        </aside>
      </div>
    </Container>
  );
}
