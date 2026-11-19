import Image from "next/image";
import Link from "next/link";
import { bundleInStock, type Bundle } from "@/lib/bundles";
import { formatPrice } from "@/lib/format";
import { defaultLocale, markets, type Locale } from "@/lib/i18n";
import { routesOf } from "@/lib/routes";
import { catalog } from "@/i18n/messages/catalog";
import { blackWeek } from "@/i18n/messages/blackweek";
import { Badge } from "@/components/ui";

/** Fungerar i både server- och klientkomponenter, därför språket som prop (svenska som standard). */
export function BundleCard({ bundle, locale = defaultLocale }: { bundle: Bundle; locale?: Locale }) {
  const t = catalog[locale];
  const routes = routesOf(locale);
  const currency = markets[locale].currency;
  const inStock = bundleInStock(bundle);
  // Kampanj (Black Week): paketpriset är sänkt under det ordinarie
  const campaignOff = bundle.price < bundle.regularPrice ? Math.round((1 - bundle.price / bundle.regularPrice) * 100) : 0;
  const bw = blackWeek[locale];
  return (
    <article className="group flex flex-col">
      <Link href={routes.bundle(bundle.slug)} className="block">
        <div className="relative aspect-square overflow-hidden rounded-card" style={{ backgroundColor: bundle.bg || "#f2efe8" }}>
          <Image
            src={bundle.images[0] ?? "/media/placeholder.svg"}
            alt={bundle.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] ${inStock ? "" : "opacity-60"}`}
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {!inStock ? (
              <Badge tone="danger">{t.bundleSoldOut}</Badge>
            ) : campaignOff > 0 ? (
              <Badge tone="campaign">{`${bw.name} ${bw.badge(campaignOff)}`}</Badge>
            ) : bundle.discount > 0 ? (
              <Badge tone="primary">{t.save(bundle.discount)}</Badge>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="mt-3.5 flex flex-1 flex-col">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{t.bundleItems(bundle.items.length)}</p>
        <h3 className="mt-1 text-sm font-medium leading-snug">
          <Link href={routes.bundle(bundle.slug)} className="hover:underline">
            {bundle.name}
          </Link>
        </h3>
        <div className="mt-auto pt-3">
          <p className={`text-base font-semibold tabular-nums ${campaignOff > 0 ? "text-sale" : ""}`}>
            {formatPrice(bundle.price, currency)}
            {campaignOff > 0 ? <span className="ml-1.5 text-xs font-normal text-muted line-through">{formatPrice(bundle.regularPrice, currency)}</span> : null}
          </p>
          {bundle.value > bundle.price ? (
            <p className="text-xs text-muted tabular-nums">
              {t.boughtSeparately(formatPrice(bundle.value, currency))}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
