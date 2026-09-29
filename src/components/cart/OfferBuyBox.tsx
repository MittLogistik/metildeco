"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { unitCount, type Product } from "@/lib/products";
import { Button } from "@/components/ui";
import { CheckIcon } from "@/components/icons";

export type GiftOption = { slug: string; name: string; price: number; image: string };

type OptionId = "sub1" | "pack" | "once";

/**
 * Köprutan i erbjudandeläget (variant B): tre alternativ ovanpå varandra, byggda för mobil.
 *  1. Prenumerera på 1 förpackning: 15 % rabatt och fri frakt.
 *  2. Prenumerera på ett flerpack: 15 % rabatt, fri frakt och en gåva (värdet visas).
 *  3. Köp 1 gång till ordinarie pris.
 * Besparingen räknas mot fullt värde (ordinarie pris × antal + gåvans pris).
 */
export function OfferBuyBox({ product, inStock, gifts }: { product: Product; inStock: boolean; gifts: GiftOption[] }) {
  const cart = useCart();
  const packQty = Math.max(2, product.offerPackQty);
  const [option, setOption] = useState<OptionId>(gifts.length ? "pack" : "sub1");
  const [giftSlug, setGiftSlug] = useState<string | null>(gifts[0]?.slug ?? null);
  const [added, setAdded] = useState(false);
  const gift = gifts.find((g) => g.slug === giftSlug) ?? null;
  const perPack = unitCount(product);

  const subUnit = Math.round(product.price * (1 - site.subscriptionDiscount / 100));
  const packInterval: 30 | 60 | 90 = packQty >= 3 ? 90 : 60;
  const packTotal = subUnit * packQty;
  const packValue = product.price * packQty + (gift?.price ?? 0);
  const packSave = packValue - packTotal;
  const packPct = packValue > 0 ? Math.round((packSave / packValue) * 100) : 0;
  const oneSave = product.price - subUnit;

  const totals: Record<OptionId, { pay: number; list: number }> = {
    sub1: { pay: subUnit, list: product.price },
    pack: { pay: packTotal, list: packValue },
    once: { pay: product.price, list: product.price },
  };
  const current = totals[option];

  const add = () => {
    if (option === "sub1") cart.addProduct(product.slug, 1, "sub", 30);
    else if (option === "pack") cart.addOffer(product.slug, packQty, packInterval, gift?.slug ?? null);
    else cart.addProduct(product.slug, 1, "once");
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-3">
      <fieldset className="space-y-2.5">
        <legend className="sr-only">Välj köpalternativ</legend>

        <OptionCard
          active={option === "sub1"}
          onClick={() => setOption("sub1")}
          badge="Populärt"
          title="Prenumerera på 1 förpackning"
          sub={`1 månads förbrukning${perPack ? ` · ${perPack} kapslar` : ""}`}
          price={subUnit}
          list={product.price}
          save={`Spara ${site.subscriptionDiscount} % (${formatPrice(oneSave)})`}
          points={["Fri frakt på varje leverans", "Levereras var 30:e dag", "Pausa eller avsluta när du vill"]}
        />

        <OptionCard
          active={option === "pack"}
          onClick={() => setOption("pack")}
          badge="Bäst värde"
          badgeTone="accent"
          title={`Prenumerera på ${packQty} förpackningar`}
          sub={`${packQty} månaders förbrukning${perPack ? ` · ${perPack * packQty} kapslar` : ""}`}
          price={packTotal}
          list={packValue}
          save={`Spara ${packPct} % (${formatPrice(packSave)})`}
          points={[
            gift ? `Gåva: ${shortName(gift.name)} (värde ${formatPrice(gift.price)})` : "Fri frakt på varje leverans",
            `Levereras var ${packInterval}:e dag`,
            gift ? "Fri frakt · pausa eller avsluta när du vill" : "Pausa eller avsluta när du vill",
          ]}
          thumbs={
            <div className="flex items-center gap-1">
              <Thumb src={product.images[0] ?? "/media/placeholder.svg"} count={packQty} />
              {gift ? (
                <>
                  <span className="text-xs font-semibold text-muted">+</span>
                  <Thumb src={gift.image} gift />
                </>
              ) : null}
            </div>
          }
        >
          {gifts.length > 1 && option === "pack" ? (
            <div className="mt-3 border-t border-primary/15 pt-3">
              <p className="mb-1.5 text-xs font-medium">Välj din gåva</p>
              <div className="flex flex-wrap gap-1.5">
                {gifts.map((g) => (
                  <button
                    key={g.slug}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGiftSlug(g.slug);
                    }}
                    aria-pressed={giftSlug === g.slug}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                      giftSlug === g.slug ? "border-primary bg-primary text-primary-fg" : "border-line bg-white hover:border-foreground/40"
                    }`}
                  >
                    <span className="relative h-5 w-5 overflow-hidden rounded-full bg-sand">
                      <Image src={g.image} alt="" fill sizes="20px" className="object-contain" />
                    </span>
                    {shortName(g.name)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </OptionCard>

        <OptionCard
          active={option === "once"}
          onClick={() => setOption("once")}
          title="Köp 1 förpackning, en gång"
          sub="Ordinarie pris, ingen bindning"
          price={product.price}
          list={null}
          save={null}
          points={[`Fri frakt över ${site.freeShippingOver} kr`]}
        />
      </fieldset>

      <Button size="lg" className="w-full" onClick={add} disabled={!inStock}>
        {!inStock ? (
          "Slutsåld"
        ) : added ? (
          <>
            <CheckIcon size={18} /> Tillagd i varukorgen
          </>
        ) : (
          <>
            Lägg i varukorgen · {formatPrice(current.pay)}
            {current.pay < current.list ? <span className="text-primary-fg/70 line-through tabular-nums">{formatPrice(current.list)}</span> : null}
          </>
        )}
      </Button>
      <p className="text-xs text-muted">
        {option === "once" ? "Betala en gång. Vill du ha rabatt och fri frakt kan du byta till prenumeration i varukorgen." : "Ingen bindningstid. Du ändrar, pausar eller avslutar prenumerationen på Mitt konto."}
        {option === "pack" && gift ? " Gåvan följer med i första leveransen." : ""}
      </p>
    </div>
  );
}

const shortName = (name: string) => name.replace(/\s*\|.*$/, "");

function Thumb({ src, count, gift }: { src: string; count?: number; gift?: boolean }) {
  return (
    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-sand">
      <Image src={src} alt="" fill sizes="44px" className="object-contain p-0.5" />
      {count && count > 1 ? <span className="absolute bottom-0.5 right-0.5 rounded-full bg-foreground px-1 text-[10px] font-semibold text-white">×{count}</span> : null}
      {gift ? <span className="absolute bottom-0.5 right-0.5 rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-fg">0 kr</span> : null}
    </span>
  );
}

function OptionCard({
  active,
  onClick,
  badge,
  badgeTone = "primary",
  title,
  sub,
  price,
  list,
  save,
  points,
  thumbs,
  children,
}: {
  active: boolean;
  onClick: () => void;
  badge?: string;
  badgeTone?: "primary" | "accent";
  title: string;
  sub: string;
  price: number;
  list: number | null;
  save: string | null;
  points: string[];
  thumbs?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="radio"
      aria-checked={active}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative cursor-pointer rounded-2xl border p-3.5 transition-colors ${active ? "border-primary bg-primary-soft" : "border-line bg-white hover:border-foreground/40"}`}
    >
      {badge ? (
        <span className={`absolute -top-2.5 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeTone === "accent" ? "bg-accent text-white" : "bg-primary text-primary-fg"}`}>
          {badge}
        </span>
      ) : null}
      <div className="flex items-start gap-3">
        <span className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${active ? "border-primary bg-primary" : "border-foreground/30"}`}>
          {active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{title}</p>
              <p className="mt-0.5 text-xs text-muted">{sub}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-base font-semibold tabular-nums leading-tight">{formatPrice(price)}</p>
              {list !== null && list > price ? <p className="text-xs text-muted line-through tabular-nums">{formatPrice(list)}</p> : null}
            </div>
          </div>
          {save ? <p className="mt-1 text-xs font-semibold text-success">{save}</p> : null}
          <div className="mt-2 flex items-end justify-between gap-3">
            <ul className="space-y-1 text-xs">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-1.5">
                  <CheckIcon size={13} className="mt-0.5 shrink-0 text-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {thumbs}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
