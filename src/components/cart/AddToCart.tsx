"use client";

import { useState } from "react";
import { useCart, type Plan } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { tieredUnitPrice, unitCount, type Product } from "@/lib/products";
import { Button } from "@/components/ui";
import { CheckIcon, MinusIcon, PlusIcon } from "@/components/icons";

/** Köpsektion på produktsidan: köpplan, antal och lägg i varukorg. */
export function ProductBuyBox({ product, inStock }: { product: Product; inStock: boolean }) {
  const cart = useCart();
  const [plan, setPlan] = useState<Plan>("once");
  const [interval, setInterval] = useState<30 | 60 | 90>(30);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const subPrice = Math.round(product.price * (1 - site.subscriptionDiscount / 100));
  const unit = plan === "sub" ? subPrice : tieredUnitPrice(product, qty);
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
        <legend className="sr-only">Köpplan</legend>
        <PlanOption
          active={plan === "once"}
          onClick={() => setPlan("once")}
          title="Engångsköp"
          price={formatPrice(product.price)}
          note="Betala en gång, ingen bindning"
        />
        <PlanOption
          active={plan === "sub"}
          onClick={() => setPlan("sub")}
          title={`Prenumerera – spara ${site.subscriptionDiscount} %`}
          price={formatPrice(subPrice)}
          note="Fri frakt, valfritt intervall, avsluta när du vill"
          highlight
        />
      </fieldset>

      {plan === "sub" ? (
        <div>
          <p className="mb-2 text-sm font-medium">
            Leverans <span className="font-normal text-muted">– hur ofta vill du ha din leverans?</span>
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
                Var {d}:e dag
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {product.tieredPricing && plan === "once" ? (
        <div>
          <p className="mb-2 text-sm font-medium">
            Välj antal <span className="font-normal text-muted">– fler förpackningar, lägre pris</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((n) => {
              const u = tieredUnitPrice(product, n);
              const save = (product.price - u) * n;
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
                  <p className="text-sm font-semibold">{n} st</p>
                  {perPack ? <p className="text-xs text-muted">{perPack * n} kapslar</p> : null}
                  <p className="mt-1 text-sm tabular-nums">{formatPrice(u)}/st</p>
                  {save > 0 ? <p className="text-xs font-medium text-success">Spara {formatPrice(save)}</p> : null}
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
            aria-label="Minska antal"
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
            aria-label="Öka antal"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="rounded-full p-2 hover:bg-sand"
          >
            <PlusIcon size={16} />
          </button>
        </div>
        <Button size="lg" className="w-full sm:flex-1" onClick={add} disabled={!inStock}>
          {!inStock ? (
            "Slutsåld"
          ) : added ? (
            <>
              <CheckIcon size={18} /> Tillagd
            </>
          ) : (
            <>
              Lägg i varukorgen · {formatPrice(total)}
              {total < listTotal ? (
                <span className="text-primary-fg/70 line-through tabular-nums">{formatPrice(listTotal)}</span>
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
  highlight,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  price: string;
  note: string;
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
      {highlight ? (
        <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-fg">
          Populärt
        </span>
      ) : null}
    </button>
  );
}

/** Liten köpknapp på produktkort. */
export function QuickAddButton({ slug, disabled, label = "Köp" }: { slug: string; disabled?: boolean; label?: string }) {
  const cart = useCart();
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
      {disabled ? "Slutsåld" : label}
    </Button>
  );
}

export function BundleBuyButton({ slug, inStock, price }: { slug: string; inStock: boolean; price: number }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
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
      {!inStock ? "Tillfälligt slut" : added ? "Tillagd i varukorgen" : `Lägg paketet i varukorgen · ${formatPrice(price)}`}
    </Button>
  );
}
