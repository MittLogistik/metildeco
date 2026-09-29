"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { unitCount, type Product } from "@/lib/products";
import { artworkFor } from "@/content/offer-artwork";
import { Button } from "@/components/ui";
import { CheckIcon } from "@/components/icons";

export type GiftOption = { slug: string; name: string; price: number; image: string };

type OptionId = "sub1" | "pack" | "once";
type Point = { text: string; tone?: "gift" };

const shortName = (name: string) => name.replace(/\s*\|.*$/, "");

/**
 * Köprutan i erbjudandeläget (variant B): tre kompakta kort ovanpå varandra.
 *  1. Prenumerera på 1 förpackning: 15 % rabatt och fri frakt.
 *  2. Prenumerera på ett flerpack: 15 % rabatt, fri frakt och en gåva.
 *  3. Köp 1 gång till ordinarie pris.
 * Innehållet står som rader i kortet ("3 × Tongkat Ali Elite", "Gåva: …") och syns som
 * små burkar under priset. Besparingen räknas mot fullt värde inkl. gåvans pris.
 */
export function OfferBuyBox({ product, inStock, gifts }: { product: Product; inStock: boolean; gifts: GiftOption[] }) {
  const cart = useCart();
  const packQty = Math.max(2, product.offerPackQty);
  const [option, setOption] = useState<OptionId>(gifts.length ? "pack" : "sub1");
  const [giftSlug, setGiftSlug] = useState<string | null>(gifts[0]?.slug ?? null);
  const [added, setAdded] = useState(false);
  const gift = gifts.find((g) => g.slug === giftSlug) ?? null;
  const perPack = unitCount(product);
  const productImage = artworkFor(product.slug, product.images[0] ?? "/media/placeholder.svg");
  const name = shortName(product.name);

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
      <div role="radiogroup" aria-label="Välj köpalternativ" className="space-y-2.5">
        <OptionCard
          active={option === "sub1"}
          onClick={() => setOption("sub1")}
          badge="Populärt"
          title="Prenumerera på 1 förpackning"
          sub={`1 månads förbrukning${perPack ? ` · ${perPack} kapslar` : ""}`}
          pct={site.subscriptionDiscount}
          price={subUnit}
          list={product.price}
          save={oneSave}
          points={[{ text: `1 × ${name}` }, { text: "Fri frakt · levereras var 30:e dag" }, { text: "Pausa eller avsluta när du vill" }]}
          tiles={<Tile src={productImage} />}
        />

        <OptionCard
          active={option === "pack"}
          onClick={() => setOption("pack")}
          badge="Bäst värde"
          badgeTone="accent"
          title={`Prenumerera på ${packQty} förpackningar`}
          sub={`${packQty} månaders förbrukning${perPack ? ` · ${perPack * packQty} kapslar` : ""}`}
          pct={packPct}
          price={packTotal}
          list={packValue}
          save={packSave}
          points={[
            { text: `${packQty} × ${name}` },
            ...(gift ? [{ text: `Gåva: ${shortName(gift.name)} (värde ${formatPrice(gift.price)})`, tone: "gift" as const }] : []),
            { text: `Fri frakt · levereras var ${packInterval}:e dag` },
            { text: "Pausa eller avsluta när du vill" },
          ]}
          tiles={
            <>
              <Tile src={productImage} badge={`×${packQty}`} />
              {gift ? <Tile src={artworkFor(gift.slug, gift.image)} badge="Gåva" gift /> : null}
            </>
          }
        >
          {gifts.length > 1 && option === "pack" ? (
            <div className="mt-2.5">
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
                      <Image src={artworkFor(g.slug, g.image)} alt="" fill sizes="20px" className="object-contain" />
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
          points={[{ text: `1 × ${name}` }, { text: `Fri frakt över ${site.freeShippingOver} kr` }]}
          tiles={<Tile src={productImage} />}
        />
      </div>

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
        {option === "once"
          ? "Betala en gång. Vill du ha rabatt och fri frakt kan du byta till prenumeration i varukorgen."
          : `Ingen bindningstid. Du ändrar, pausar eller avslutar på Mitt konto.${option === "pack" && gift ? " Gåvan följer med i första leveransen." : ""}`}
      </p>
    </div>
  );
}

/** Liten bildruta under priset: burken, med antal eller gåvomärkning i hörnet. */
function Tile({ src, badge, gift }: { src: string; badge?: string; gift?: boolean }) {
  return (
    <span className="relative h-[52px] w-11 shrink-0 overflow-visible rounded-lg bg-white/70">
      <Image src={src} alt="" fill sizes="56px" className="object-contain p-0.5" />
      {badge ? (
        <span className={`absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none shadow ${gift ? "bg-primary text-primary-fg" : "bg-foreground text-white"}`}>{badge}</span>
      ) : null}
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
  pct,
  price,
  list,
  save,
  points,
  tiles,
  children,
}: {
  active: boolean;
  onClick: () => void;
  badge?: string;
  badgeTone?: "primary" | "accent";
  title: string;
  sub: string;
  pct?: number;
  price: number;
  list: number | null;
  save: number | null;
  points: Point[];
  tiles?: React.ReactNode;
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
      className={`relative cursor-pointer rounded-2xl border-2 px-3.5 py-3 transition-colors ${active ? "border-primary bg-primary-soft" : "border-line bg-white hover:border-foreground/30"}`}
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
          <p className="text-sm font-semibold leading-tight">{title}</p>
          <p className="mt-0.5 text-xs text-muted">{sub}</p>
          <ul className="mt-2 space-y-1 text-xs">
            {points.map((p) => (
              <li key={p.text} className={`flex items-start gap-1.5 ${p.tone === "gift" ? "font-semibold text-success" : ""}`}>
                <CheckIcon size={13} className={`mt-0.5 shrink-0 ${p.tone === "gift" ? "text-success" : "text-primary"}`} />
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
          {children}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          <div>
            <p className="text-lg font-semibold tabular-nums leading-tight">{formatPrice(price)}</p>
            {list !== null && list > price ? <p className="text-xs text-muted line-through tabular-nums">{formatPrice(list)}</p> : null}
            {pct && save ? (
              <p className="mt-1 flex items-center justify-end gap-1 text-[11px] font-medium text-success">
                <span className="rounded-full bg-success/15 px-1.5 py-0.5 font-bold">−{pct} %</span>
                {formatPrice(save)}
              </p>
            ) : null}
          </div>
          {tiles ? <div className="flex items-center gap-1.5">{tiles}</div> : null}
        </div>
      </div>
    </div>
  );
}
