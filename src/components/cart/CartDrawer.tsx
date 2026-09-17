"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { buttonClass } from "@/components/ui";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/icons";

export function CartDrawer() {
  const cart = useCart();

  useEffect(() => {
    if (!cart.isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cart.isOpen, cart]);

  return (
    <div
      className={`fixed inset-0 z-50 ${cart.isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!cart.isOpen}
    >
      <button
        type="button"
        aria-label="Stäng varukorgen"
        onClick={cart.close}
        className={`absolute inset-0 bg-foreground/40 transition-opacity ${cart.isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Din varukorg"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-float transition-transform duration-300 ${
          cart.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl">Din varukorg</h2>
          <button type="button" onClick={cart.close} aria-label="Stäng varukorgen" className="rounded-full p-2 hover:bg-sand">
            <CloseIcon />
          </button>
        </header>

        {cart.resolved.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted">Din varukorg är tom.</p>
            <Link href={routes.products} onClick={cart.close} className={buttonClass("primary")}>
              Utforska sortimentet
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line bg-sand-soft px-5 py-3 text-sm">
              {cart.freeShippingRemaining > 0 ? (
                <p>
                  <strong>{formatPrice(cart.freeShippingRemaining)}</strong> kvar till fri frakt
                </p>
              ) : (
                <p className="text-success">Du har fri frakt på den här ordern</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(100, (cart.subtotal / (cart.subtotal + cart.freeShippingRemaining || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {cart.resolved.map((line) => (
                <li key={line.key} className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                    <Image src={line.image} alt="" fill sizes="80px" className="object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={line.kind === "bundle" ? routes.bundle(line.slug) : routes.product(line.slug)}
                      onClick={cart.close}
                      className="line-clamp-2 text-sm font-medium hover:underline"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">
                      {line.plan === "sub" ? `Prenumeration – var ${line.intervalDays ?? 30}:e dag` : "Engångsköp"}
                    </p>
                    {line.discountLabel ? (
                      <span className="mt-1 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                        {line.discountLabel}
                      </span>
                    ) : null}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          aria-label="Minska antal"
                          onClick={() => cart.setQty(line.key, line.qty - 1)}
                          className="p-1.5 hover:bg-sand"
                        >
                          <MinusIcon size={14} />
                        </button>
                        <span className="min-w-6 text-center text-sm tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          aria-label="Öka antal"
                          onClick={() => cart.setQty(line.key, line.qty + 1)}
                          className="p-1.5 hover:bg-sand"
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums">{formatPrice(line.lineTotal)}</p>
                        {line.unitPrice < line.listPrice ? (
                          <p className="text-xs text-muted line-through tabular-nums">
                            {formatPrice(line.listPrice * line.qty)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line px-5 py-4">
              <dl className="space-y-1.5 text-sm">
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
                  <dd className="tabular-nums">{cart.shipping === 0 ? "Fri" : formatPrice(cart.shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
                  <dt>Att betala</dt>
                  <dd className="tabular-nums">{formatPrice(cart.total)}</dd>
                </div>
              </dl>
              <p className="mt-1 text-xs text-muted">Inkl. moms. Frakt beräknas för Sverige.</p>
              <Link href={routes.checkout} onClick={cart.close} className={buttonClass("primary", "lg", "mt-4 w-full")}>
                Till kassan
              </Link>
              <button type="button" onClick={cart.close} className="mt-2 w-full py-2 text-sm text-muted hover:text-foreground">
                Fortsätt handla
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
