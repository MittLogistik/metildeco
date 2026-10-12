"use client";

import { useState } from "react";
import { useCart, type Plan } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { subscriptionUnitPrice, tieredUnitPrice, unitCount, type Product } from "@/lib/products";
import { useI18n } from "@/i18n/client";
import { cart as cartMessages } from "@/i18n/messages/cart";

const useLabels = () => cartMessages[useI18n().locale];
import { Button } from "@/components/ui";
import { CheckIcon, MinusIcon, PlusIcon } from "@/components/icons";

/** Köpsektion på produktsidan: köpplan, antal och lägg i varukorg. */
export function ProductBuyBox({ product, inStock }: { product: Product; inStock: boolean }) {
  const cart = useCart();
  const [plan, setPlan] = useState<Plan>("once");
  const [interval, setInterval] = useState<30 | 60 | 90>(30);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const t = useLabels();
  const currency = cart.currency;
  const fmt = (n: number) => formatPrice(n, currency);

  const subPrice = subscriptionUnitPrice(product.price, site.subscriptionDiscount, currency);
  const unit = plan === "sub" ? subPrice : tieredUnitPrice(product, qty, currency);
  const total = unit * qty;
  const listTotal = product.price * qty;
  const perPack = unitCount(product);

  const add = () => {
    cart.addProduct(product.slug, qty, plan, interval);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-4">
      <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <legend className="sr-only">{t.planLegend}</legend>
        <PlanOption
          active={plan === "once"}
          onClick={() => setPlan("once")}
          title={t.once}
          price={fmt(product.price)}
          note={t.onceNote}
        />
        <PlanOption
          active={plan === "sub"}
          onClick={() => setPlan("sub")}
          title={t.subTitle(site.subscriptionDiscount)}
          price={fmt(subPrice)}
          note={t.subNote}
          badge={t.freeShipping}
          highlight
        />
      </fieldset>

      {plan === "sub" ? (
        <div>
          <p className="mb-2 text-sm font-medium">
            {t.delivery} <span className="font-normal text-muted">{t.deliveryHint}</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {([30, 60, 90] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setInterval(d)}
                aria-pressed={interval === d}
                className={`rounded-2xl border p-3 text-center text-sm transition-colors ${
                  interval === d ? "border-primary bg-primary-soft font-semibold" : "border-line hover:border-foreground/40"
                }`}
              >
                {t.everyDays(d)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {product.tieredPricing && plan === "once" ? (
        <div>
          <p className="mb-2 text-sm font-medium">
            {t.chooseQty} <span className="font-normal text-muted">{t.chooseQtyHint}</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((n) => {
              const u = tieredUnitPrice(product, n, currency);
              const save = Math.round((product.price - u) * n * 100) / 100;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQty(n)}
                  aria-pressed={qty === n}
                  className={`rounded-2xl border p-3 text-left transition-colors ${
                    qty === n ? "border-primary bg-primary-soft" : "border-line hover:border-foreground/40"
                  }`}
                >
                  <p className="text-sm font-semibold">{t.pcs(n)}</p>
                  {perPack ? <p className="text-xs text-muted">{t.capsules(perPack * n)}</p> : null}
                  <p className="mt-1 text-sm tabular-nums">{fmt(u)}{t.perPcs}</p>
                  {save > 0 ? <p className="text-xs font-medium text-success">{t.save(fmt(save))}</p> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="inline-flex h-13 items-center justify-between rounded-full border border-line px-2 sm:w-36">
          <button
            type="button"
            aria-label={t.decrease}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="rounded-full p-2 hover:bg-sand"
          >
            <MinusIcon size={16} />
          </button>
          <span className="min-w-8 text-center text-base font-medium tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            aria-label={t.increase}
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="rounded-full p-2 hover:bg-sand"
          >
            <PlusIcon size={16} />
          </button>
        </div>
        <Button size="lg" className="w-full sm:flex-1" onClick={add} disabled={!inStock}>
          {!inStock ? (
            t.soldOut
          ) : added ? (
            <>
              <CheckIcon size={18} /> {t.added}
            </>
          ) : (
            <>
              {t.addToCart} · {fmt(total)}
              {total < listTotal ? (
                <span className="text-primary-fg/70 line-through tabular-nums">{fmt(listTotal)}</span>
              ) : null}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function PlanOption({
  active,
  onClick,
  title,
  price,
  note,
  badge,
  highlight,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  price: string;
  note: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative rounded-2xl border p-3.5 text-left transition-colors ${
        active ? "border-primary bg-primary-soft" : "border-line hover:border-foreground/40"
      }`}
    >
      <span className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
            active ? "border-primary bg-primary" : "border-foreground/30"
          }`}
        >
          {active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{title}</span>
          <span className="block text-sm tabular-nums">{price}</span>
          <span className="block text-xs text-muted">{note}</span>
        </span>
      </span>
      {highlight && badge ? (
        <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-fg">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

/** Liten köpknapp på produktkort. */
export function QuickAddButton({ slug, disabled, label }: { slug: string; disabled?: boolean; label?: string }) {
  const cart = useCart();
  const t = useLabels();
  return (
    <Button
      size="sm"
      variant={disabled ? "secondary" : "primary"}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        cart.addProduct(slug, 1, "once");
      }}
    >
      {disabled ? t.soldOut : (label ?? t.buy)}
    </Button>
  );
}

export function BundleBuyButton({ slug, inStock, price }: { slug: string; inStock: boolean; price: number }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const t = useLabels();
  return (
    <Button
      size="lg"
      className="w-full"
      disabled={!inStock}
      onClick={() => {
        cart.addBundle(slug, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
    >
      {!inStock ? t.tempOut : added ? t.addedToCart : `${t.addBundle} · ${formatPrice(price, cart.currency)}`}
    </Button>
  );
}
