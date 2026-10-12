"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, type ResolvedLine } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { subscriptionUnitPrice } from "@/lib/products";
import { useI18n } from "@/i18n/client";
import { cart as cartMessages } from "@/i18n/messages/cart";
import { MinusIcon, PlusIcon } from "@/components/icons";

/** En rad i varukorgen med antal, pris och växel mellan engångsköp och prenumeration. */
export function CartLineRow({ line, onNavigate, compact = false }: { line: ResolvedLine; onNavigate?: () => void; compact?: boolean }) {
  const cart = useCart();
  const { locale, r } = useI18n();
  const t = cartMessages[locale];
  const fmt = (n: number) => formatPrice(n, cart.currency);
  const isSub = line.plan === "sub";
  const subUnit = line.product ? subscriptionUnitPrice(line.product.price, site.subscriptionDiscount, cart.currency) : null;
  const size = compact ? "h-20 w-20" : "h-24 w-24";

  if (line.plan === "gift") {
    return (
      <li className="flex gap-4 py-4">
        <div className={`relative ${size} shrink-0 overflow-hidden rounded-xl bg-sand`}>
          <Image src={line.image} alt="" fill sizes="96px" className="object-contain p-1" />
          <span className="absolute left-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-fg">{t.gift}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <Link href={r.product(line.slug)} onClick={onNavigate} className="line-clamp-2 text-sm font-medium hover:underline">
              {line.name}
            </Link>
            <button type="button" onClick={() => cart.remove(line.key)} className="shrink-0 text-xs text-muted hover:text-foreground">
              {t.remove}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted">{t.giftNote}</p>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-sm text-muted">{t.pcs(1)}</span>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">{fmt(0)}</p>
              <p className="text-xs text-muted line-through tabular-nums">{fmt(line.listPrice)}</p>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="flex gap-4 py-4">
      <div className={`relative ${size} shrink-0 overflow-hidden rounded-xl bg-sand`}>
        <Image src={line.image} alt="" fill sizes="96px" className="object-contain p-1" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={line.kind === "bundle" ? r.bundle(line.slug) : r.product(line.slug)}
            onClick={onNavigate}
            className="line-clamp-2 text-sm font-medium hover:underline"
          >
            {line.name}
          </Link>
          <button type="button" onClick={() => cart.remove(line.key)} className="shrink-0 text-xs text-muted hover:text-foreground">
            {t.remove}
          </button>
        </div>

        {line.kind === "product" && subUnit !== null ? (
          <div className="mt-2">
            <div className="inline-flex rounded-full border border-line bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => cart.setPlan(line.key, "once")}
                aria-pressed={!isSub}
                className={`rounded-full px-3 py-1 ${!isSub ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}
              >
                {t.once}
              </button>
              <button
                type="button"
                onClick={() => cart.setPlan(line.key, "sub", line.intervalDays ?? 30)}
                aria-pressed={isSub}
                className={`rounded-full px-3 py-1 ${isSub ? "bg-primary text-primary-fg" : "text-primary hover:bg-primary-soft"}`}
              >
                {t.subscribeToggle(site.subscriptionDiscount)}
              </button>
            </div>
            {isSub ? (
              <div className="mt-1.5 flex items-center gap-1 text-xs">
                <span className="text-muted">{t.deliveryEvery}</span>
                {([30, 60, 90] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => cart.setPlan(line.key, "sub", d)}
                    aria-pressed={line.intervalDays === d}
                    className={`rounded-full px-2 py-0.5 ${line.intervalDays === d ? "bg-primary-soft font-semibold text-primary" : "text-muted hover:text-foreground"}`}
                  >
                    {t.dayN(d)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-xs text-muted">{t.subHint(fmt(subUnit))}</p>
            )}
          </div>
        ) : line.discountLabel ? (
          <span className="mt-1 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
            {line.discountLabel}
          </span>
        ) : null}

        <div className="mt-2.5 flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-line bg-white">
            <button type="button" aria-label={t.decrease} onClick={() => cart.setQty(line.key, line.qty - 1)} className="p-1.5 hover:bg-sand">
              <MinusIcon size={14} />
            </button>
            <span className="min-w-6 text-center text-sm tabular-nums">{line.qty}</span>
            <button type="button" aria-label={t.increase} onClick={() => cart.setQty(line.key, line.qty + 1)} className="p-1.5 hover:bg-sand">
              <PlusIcon size={14} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">{fmt(line.lineTotal)}</p>
            {line.unitPrice < line.listPrice ? (
              <p className="text-xs text-muted line-through tabular-nums">{fmt(line.listPrice * line.qty)}</p>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
