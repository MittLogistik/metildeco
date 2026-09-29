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
import { routes } from "@/lib/routes";
import { company, site } from "@/lib/site";
import { track } from "@/lib/track";
import { metaTrack } from "@/components/consent/MetaPixel";
import { visitorId } from "@/components/affiliate/ClickTracker";
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
          router.replace(routes.checkout);
        });
    } else if (kod) {
      router.replace(routes.checkout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (cart.resolved.length === 0 && !restoring) {
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

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

  const pay = async () => {
    if (!emailOk) {
      setError("Ange din e-postadress så vi kan skicka orderbekräftelsen.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setEmail(email.trim().toLowerCase());
    track("begin_checkout");
    metaTrack("InitiateCheckout", { value: cart.subtotal, currency: "SEK", num_items: cart.count, content_ids: cart.resolved.map((l) => metaContentId(l.kind, l.slug, l.product?.sku ?? l.bundle?.sku)), content_type: "product" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Bara giltiga rader: en gåva utan sitt flerpack skickas inte med
          lines: cart.resolved.map((l) => ({ kind: l.kind, slug: l.slug, qty: l.qty, plan: l.plan, intervalDays: l.intervalDays })),
          visitorId: visitorId(),
          email: email.trim().toLowerCase(),
          code: code || null,
          variant: storedVariant(),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Kunde inte starta betalningen.");
      setCode("");
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
      {restoring ? <p className="mt-3 text-sm text-muted">Hämtar din sparade varukorg …</p> : null}

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
          <label className="mt-5 block text-sm">
            <span className="mb-1.5 block font-medium">E-postadress</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="du@exempel.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
            <span className="mt-1 block text-xs text-muted">Orderbekräftelsen och spårningen skickas hit.</span>
          </label>
          {code ? (
            <p className="mt-3 rounded-xl bg-primary-soft px-3 py-2 text-sm">
              Rabattkoden <strong className="font-mono">{code}</strong> läggs på i betalsteget.{" "}
              <button type="button" className="underline underline-offset-2" onClick={() => setCode("")}>
                Ta bort
              </button>
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
              {error}
            </p>
          ) : null}
          <Button size="lg" className="mt-5 w-full" onClick={pay} disabled={submitting || restoring}>
            {submitting ? "Förbereder säker betalning …" : "Till betalning"}
          </Button>
          <p className="mt-3 flex items-start gap-2 text-xs text-muted">
            <LockIcon size={14} className="mt-0.5 shrink-0" />
            <span>Adress, fraktsätt och betalning fylls i på nästa sida hos Stripe.{code ? "" : " Rabattkod anges där."}</span>
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
            . Säljare: {company.legalName}, org.nr {company.orgNumber}. Lämnar du kassan kan vi påminna dig om varukorgen per e-post.
          </p>
        </aside>
      </div>
    </Container>
  );
}
