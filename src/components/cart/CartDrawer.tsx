"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { CartLineRow } from "./CartLineRow";
import { CartTotals } from "./CartTotals";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { buttonClass } from "@/components/ui";
import { CloseIcon } from "@/components/icons";
import { PaymentMethods, subscriptionPaymentIds } from "@/components/PaymentMethods";

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
    <div className={`fixed inset-0 z-50 ${cart.isOpen ? "" : "pointer-events-none"}`} aria-hidden={!cart.isOpen}>
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
                  style={{ width: `${Math.min(100, (cart.subtotal / (cart.subtotal + cart.freeShippingRemaining || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {cart.resolved.map((line) => (
                <CartLineRow key={line.key} line={line} onNavigate={cart.close} compact />
              ))}
            </ul>

            <footer className="border-t border-line px-5 py-4">
              <CartTotals />
              <Link href={routes.checkout} onClick={cart.close} className={buttonClass("primary", "lg", "mt-4 w-full")}>
                Till kassan
              </Link>
              <button type="button" onClick={cart.close} className="mt-2 w-full py-2 text-sm text-muted hover:text-foreground">
                Fortsätt handla
              </button>
              <PaymentMethods size="sm" className="mt-2" only={cart.resolved.some((l) => l.plan === "sub") ? subscriptionPaymentIds : undefined} />
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
