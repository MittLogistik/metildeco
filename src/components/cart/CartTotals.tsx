"use client";

import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";

/** Delsumma, rabatt, frakt och totalsumma – samma uträkning i låda och kassa. */
export function CartTotals() {
  const cart = useCart();
  return (
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
        <dd className="tabular-nums">{cart.shipping === 0 ? "Fri" : `från ${formatPrice(cart.shipping)}`}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
        <dt>Att betala</dt>
        <dd className="tabular-nums">{formatPrice(cart.total)}</dd>
      </div>
      <p className="text-xs text-muted">Inkl. moms. Fraktsätt och eventuell rabattkod väljs i betalsteget.</p>
    </dl>
  );
}
