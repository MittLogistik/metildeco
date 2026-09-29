"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { unitCount, type Product } from "@/lib/products";
import { artworkFor, isCutout, packArtworkFor } from "@/content/offer-artwork";
import { Button } from "@/components/ui";
import { CheckIcon } from "@/components/icons";

export type GiftOption = { slug: string; name: string; price: number; image: string };

type OptionId = "sub1" | "pack" | "once";
type Point = { text: string; tone?: "gift" };

const shortName = (name: string) => name.replace(/\s*\|.*$/, "");

/**
 * Köprutan i erbjudandeläget (variant B): tre kort ovanpå varandra.
 *  1. Prenumerera på 1 förpackning: 15 % rabatt och fri frakt.
 *  2. Prenumerera på ett flerpack: 15 % rabatt, fri frakt och en gåva.
 *  3. Köp 1 gång till ordinarie pris.
 * Varje kort har produktbilden till vänster (flerpacket som en bild med gåvan framför),
 * texten i mitten och pris med besparing till höger. Bilderna ligger direkt på kortets färg:
 * friställda PNG:er som de är, vanliga bilder med vit bakgrund blandas bort (multiply).
 */
export function OfferBuyBox({ product, inStock, gifts }: { product: Product; inStock: boolean; gifts: GiftOption[] }) {
  const cart = useCart();
  const packQty = Math.max(2, product.offerPackQty);
  const [option, setOption] = useState<OptionId>(gifts.length ? "pack" : "sub1");
  const [giftSlug, setGiftSlug] = useState<string | null>(gifts[0]?.slug ?? null);
  const [added, setAdded] = useState(false);
  const gift = gifts.find((g) => g.slug === giftSlug) ?? null;
  const perPack = unitCount(product);
  const single = artworkFor(product.slug, product.images[0] ?? "/media/placeholder.svg");
  const pack = packArtworkFor(product.slug);

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
      <div role="radiogroup" aria-label="Välj köpalternativ" className="space-y-3">
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
          points={[{ text: "Fri frakt · var 30:e dag" }, { text: "Avsluta när du vill" }]}
          visual={<Art src={single} className="h-[60px] w-11 sm:h-[68px] sm:w-12" />}
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
            ...(gift ? [{ text: `+ ${shortName(gift.name)} på köpet (värde ${formatPrice(gift.price)})`, tone: "gift" as const }] : []),
            { text: `Fri frakt · var ${packInterval}:e dag` },
            { text: "Avsluta när du vill" },
          ]}
          visual={
            <span className="relative block h-[68px] w-[68px] sm:h-[84px] sm:w-[84px]">
              {pack ? (
                <Art src={pack} className="absolute inset-0" />
              ) : (
                <>
                  <Art src={single} className="absolute left-0 top-2 h-[72px] w-12 opacity-80" />
                  <Art src={single} className="absolute right-0 top-2 h-[72px] w-12 opacity-80" />
                  <Art src={single} className="absolute left-1/2 top-0 h-[82px] w-14 -translate-x-1/2" />
                </>
              )}
              {gift ? (
                <span className="absolute -bottom-1 -right-1 block h-10 w-7 drop-shadow-md sm:h-[48px] sm:w-9">
                  <Art src={artworkFor(gift.slug, gift.image)} className="absolute inset-0" />
                </span>
              ) : null}
              <span className="absolute -left-1 bottom-0 rounded-full bg-foreground px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">×{packQty}</span>
            </span>
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
                    <span className="relative h-5 w-4">
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
          title="Köp 1 förpackning"
          sub="Engångsköp, ordinarie pris"
          price={product.price}
          list={null}
          save={null}
          points={[{ text: `Fri frakt över ${site.freeShippingOver} kr` }]}
          visual={<Art src={single} className="h-[60px] w-11 sm:h-[68px] sm:w-12" />}
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
      <p className="text-center text-xs text-muted">
        {option === "once"
          ? "Betala en gång. Rabatt och fri frakt får du med prenumeration."
          : `Ingen bindningstid. Ändra, pausa eller avsluta på Mitt konto.${option === "pack" && gift ? " Gåvan följer med första leveransen." : ""}`}
      </p>
    </div>
  );
}

/** Produktbild utan egen bakgrund. Bilder med vit bakgrund blandas in i kortets färg. */
function Art({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span className={`block ${className.includes("absolute") ? "" : "relative "}${className}`}>
      <Image src={src} alt="" fill sizes="120px" className={`object-contain ${isCutout(src) ? "" : "mix-blend-multiply"}`} />
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
  visual,
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
  visual: React.ReactNode;
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
      className={`relative cursor-pointer rounded-2xl border-2 p-3 transition-all ${
        active ? "border-primary bg-primary-soft shadow-sm" : "border-line bg-white hover:border-foreground/30"
      }`}
    >
      {badge ? (
        <span className={`absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeTone === "accent" ? "bg-accent text-white" : "bg-primary text-primary-fg"}`}>
          {badge}
        </span>
      ) : null}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-primary bg-primary" : "border-foreground/25 bg-white"}`}>
          {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
        </span>
        <div className="flex w-[68px] shrink-0 justify-center sm:w-[84px]">{visual}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{title}</p>
          <p className="text-xs text-muted">{sub}</p>
          {pct && save ? (
            <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-bold text-success">
              Spara {pct} % · {formatPrice(save)}
            </p>
          ) : null}
          <ul className="mt-1.5 space-y-0.5 text-xs">
            {points.map((p) => (
              <li key={p.text} className={`flex items-start gap-1.5 ${p.tone === "gift" ? "font-semibold text-success" : "text-foreground/80"}`}>
                <CheckIcon size={12} className={`mt-0.5 shrink-0 ${p.tone === "gift" ? "text-success" : "text-primary"}`} />
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
          {children}
        </div>
        <div className="shrink-0 self-start text-right">
          <p className="text-base font-bold tabular-nums leading-tight">{formatPrice(price)}</p>
          {list !== null && list > price ? <p className="text-[11px] text-muted line-through tabular-nums">{formatPrice(list)}</p> : null}
        </div>
      </div>
    </div>
  );
}
