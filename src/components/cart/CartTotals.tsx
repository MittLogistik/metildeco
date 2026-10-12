"use client";

import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/i18n/client";
import { cart as cartMessages } from "@/i18n/messages/cart";

/** Delsumma, rabatt, frakt och totalsumma – samma uträkning i låda och kassa. */
export function CartTotals() {
  const cart = useCart();
  const { locale } = useI18n();
  const t = cartMessages[locale];
  const fmt = (n: number) => formatPrice(n, cart.currency);
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">{t.subtotal}</dt>
        <dd className="tabular-nums">{fmt(cart.listTotal)}</dd>
      </div>
      {cart.discount > 0 ? (
        <div className="flex justify-between text-success">
          <dt>{t.discount}</dt>
          <dd className="tabular-nums">−{fmt(cart.discount)}</dd>
        </div>
      ) : null}
      <div className="flex justify-between">
        <dt className="text-muted">{t.shipping}</dt>
        <dd className="tabular-nums">{cart.shipping === 0 ? t.free : t.shippingFrom(fmt(cart.shipping))}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
        <dt>{t.toPay}</dt>
        <dd className="tabular-nums">{fmt(cart.total)}</dd>
      </div>
      <p className="text-xs text-muted">{t.totalsNote}</p>
    </dl>
  );
}
