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
 * Kassa – kontaktuppgifter, leveransadress, fraktsätt och ordersammanfattning.
 * Betalning (Stripe) kopplas på i nästa steg; tills dess visas en tydlig notis.
 */
export function Checkout() {
  const cart = useCart();
  const [method, setMethod] = useState(swedenRates[0]?.method ?? "");
  const rate = swedenRates.find((r) => r.method === method) ?? swedenRates[0]!;
  const allFree = cart.resolved.length > 0 && cart.resolved.every((l) => l.freeShipping);
  const shipping = allFree ? 0 : shippingCost(rate, cart.subtotal);
  const total = cart.subtotal + shipping;

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

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Kassa" }]} />
      <h1 className="mt-6 font-display text-4xl font-medium tracking-tight">Kassa</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <form
          className="space-y-10"
          onSubmit={(e) => {
            e.preventDefault();
            window.alert("Betalning aktiveras i nästa steg av bygget. Ordern är inte skickad.");
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
              <p className="mt-3 rounded-xl bg-primary-soft p-4 text-sm">Din order innehåller bara prenumerationer eller paket med fri frakt – ingen fraktkostnad tillkommer.</p>
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
            <div className="mt-4 rounded-xl border border-dashed border-line p-5 text-sm text-muted">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <LockIcon size={16} /> Säker betalning med kort, Apple Pay och Google Pay
              </p>
              <p className="mt-2">Betalningen kopplas på i nästa steg av bygget (Stripe). Kassan är just nu en förhandsvisning av flödet.</p>
            </div>
            <Button type="submit" size="lg" className="mt-6 w-full">
              Slutför köp · {formatPrice(total)}
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
                  <span className="block text-xs text-muted">{line.plan === "sub" ? "Prenumeration – var 30:e dag" : "Engångsköp"}</span>
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
            <p className="text-xs text-muted">Inkl. 12 % moms. Priser i SEK.</p>
          </dl>
        </aside>
      </div>
    </Container>
  );
}
