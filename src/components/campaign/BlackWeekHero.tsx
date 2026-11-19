import Image from "next/image";
import Link from "next/link";
import { blackWeek, campaignEndLabel } from "@/i18n/messages/blackweek";
import type { Campaign } from "@/lib/campaign";
import { formatPrice } from "@/lib/format";
import { markets, type Locale } from "@/lib/i18n";
import { primaryImage, type Product } from "@/lib/products";
import { routesOf } from "@/lib/routes";
import { ArrowRight } from "@/components/icons";
import { Container } from "@/components/ui";
import { BlockCountdown } from "./Countdown";

/**
 * Startsidans banner under Black Week: svart yta, rabatten i stort format, nedräkning och
 * tre produkter med kampanjpris. Visas ovanför den vanliga heron och försvinner när kampanjen slutar.
 */
export function BlackWeekHero({ campaign, locale, products, hasBundles }: { campaign: Campaign; locale: Locale; products: Product[]; hasBundles: boolean }) {
  const t = blackWeek[locale];
  const market = markets[locale];
  const r = routesOf(locale);
  const picks = products.slice(0, 3);
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Diskret ljuskägla bakom produkterna */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/2 h-[42rem] w-[42rem] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(40%_0_0/0.55),transparent)]" />
      <Container className="relative grid gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(63%_0.22_27)]" />
            {t.name}
          </p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            {t.heroTitle(campaign.percent)}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{t.heroLead(campaignEndLabel(campaign.end, market.intl))}</p>
          <div className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/50">{t.endsIn}</p>
            <BlockCountdown end={campaign.end} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={r.products}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-black transition-colors hover:bg-white/85"
            >
              {t.heroCta} <ArrowRight size={18} />
            </Link>
            {hasBundles ? (
              <Link
                href={`${r.products}?typ=paket`}
                className="inline-flex h-13 items-center justify-center rounded-full border border-white/30 px-7 text-base font-medium transition-colors hover:border-white"
              >
                {t.heroSub}
              </Link>
            ) : null}
          </div>
          <p className="mt-5 text-xs text-white/45">{t.terms}</p>
        </div>

        {picks.length > 0 ? (
          <ul className={`mx-auto grid w-full gap-3 sm:gap-4 ${picks.length >= 3 ? "grid-cols-3" : picks.length === 2 ? "max-w-md grid-cols-2" : "max-w-56 grid-cols-1"}`}>
            {picks.map((p, i) => (
              <li key={p.slug} className={i === 1 && picks.length >= 3 ? "lg:-translate-y-6" : ""}>
                <Link href={r.product(p.slug)} className="group block">
                  <span className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-white/[0.07] ring-1 ring-white/10 transition group-hover:ring-white/30">
                    <Image src={primaryImage(p)} alt={p.name} fill sizes="(max-width: 1024px) 33vw, 15vw" className="object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-black">{t.badge(campaign.percent)}</span>
                  </span>
                  <span className="mt-2 block truncate text-xs text-white/70 sm:text-sm">{p.name.split("|")[0]!.trim()}</span>
                  <span className="block text-sm font-semibold tabular-nums sm:text-base">
                    {formatPrice(p.price, market.currency)}
                    {p.oldPrice ? <span className="ml-1.5 text-xs font-normal text-white/45 line-through">{formatPrice(p.oldPrice, market.currency)}</span> : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
