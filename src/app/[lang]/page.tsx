import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articlesFor } from "@/lib/articles";
import { getCatalog } from "@/lib/catalog";
import { aggregateRating, categoriesOf, isInStock } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { hasPage } from "@/lib/routes";
import { freeShippingOver } from "@/lib/shipping";
import { alternates, getI18n } from "@/i18n/server";
import { home } from "@/i18n/messages/home";
import { site } from "@/lib/site";
import { goalProductCount, goals } from "@/content/goals";
import { ArticleCard } from "@/components/ArticleCard";
import { BundleCard } from "@/components/BundleCard";
import { ArrowRight, CheckIcon, StarIcon } from "@/components/icons";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { TrustBar } from "@/components/TrustBar";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, market, r } = await getI18n();
  const t = home[locale];
  return {
    title: t.title,
    description: t.description(formatPrice(freeShippingOver(locale), market.currency)),
    alternates: alternates(r.home),
  };
}

export default async function HomePage() {
  const { locale, market, r: routes } = await getI18n();
  const t = home[locale];
  const { products, bundles } = await getCatalog(locale);
  // Mål, journalen och quiz finns bara på svenska
  const showGoals = hasPage("goals", locale);
  const showArticles = hasPage("articles", locale);
  const categories = categoriesOf(products);
  const hero = products.find((p) => p.slug === "tongkat-ali-elite") ?? products[0]!;
  const inStock = products.filter(isInStock);
  const featured = [...inStock, ...products.filter((p) => !isInStock(p))].slice(0, 8);
  const rating = site.showRatings ? aggregateRating(products) : null;
  const latest = showArticles ? articlesFor(locale).slice(0, 3) : [];
  const ratingValue = rating ? new Intl.NumberFormat(market.intl, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(rating.avg) : "";

  return (
    <>
      {/* Hero */}
      <section className="bg-sand-soft">
        <Container className="grid gap-10 py-12 lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="max-w-xl">
            {site.campaign && locale === "sv" ? (
              <Link href={site.campaign.href} className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent">
                {site.campaign.label} <ArrowRight size={14} />
              </Link>
            ) : (
              <Eyebrow>{t.heroEyebrow}</Eyebrow>
            )}
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {t.heroTitle} <span className="text-primary">{t.heroTitleAccent}</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {t.heroLead}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={routes.products} size="lg">
                {t.shopNow}
              </ButtonLink>
              {showGoals ? (
                <ButtonLink href={routes.goals} size="lg" variant="outline">
                  {t.findExtract}
                </ButtonLink>
              ) : null}
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {rating ? (
                <li className="flex items-center gap-1.5">
                  <StarIcon size={15} className="text-star" />
                  <span>
                    <strong className="font-semibold text-foreground">{ratingValue} / 5</strong> ·{" "}
                    {t.reviews(rating.count)}
                  </span>
                </li>
              ) : null}
              <li className="flex items-center gap-1.5">
                <CheckIcon size={15} className="text-primary" /> {t.freeShippingOver(formatPrice(freeShippingOver(locale), market.currency))}
              </li>
              <li className="flex items-center gap-1.5">
                <CheckIcon size={15} className="text-primary" /> {t.returnRight}
              </li>
            </ul>
          </div>
          <div className="relative">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-square lg:aspect-[4/5]"
              style={{ backgroundColor: hero.bg }}
            >
              <Image
                src={hero.storyHeroImage ?? hero.images[0] ?? "/media/placeholder.svg"}
                alt={hero.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <Link
              href={routes.product(hero.slug)}
              className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-card backdrop-blur transition-colors hover:bg-white sm:left-auto sm:w-80"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl" style={{ backgroundColor: hero.bg }}>
                <Image src={hero.images[0] ?? "/media/placeholder.svg"} alt="" fill sizes="56px" className="object-contain p-1" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">{t.original}</span>
                <span className="block truncate text-sm font-medium">{hero.name}</span>
                <span className="block text-xs text-muted">{hero.short}</span>
              </span>
              <ArrowRight size={18} className="ml-auto shrink-0 text-muted" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Kategorier */}
      <section className="border-b border-line">
        <Container className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
          <Link href={routes.products} className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-fg">
            {t.allProducts}
          </Link>
          {categories.map((c) => (
            <Link key={c} href={routes.category(c)} className="shrink-0 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-foreground/40">
              {c}
            </Link>
          ))}
        </Container>
      </section>

      {/* Produkter */}
      <section>
        <Container className="py-16">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow={t.rangeEyebrow} title={t.rangeTitle} />
            <Link href={routes.products} className="hidden items-center gap-1 text-sm font-medium hover:underline sm:inline-flex">
              {t.allProducts} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 4} locale={locale} />
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <ButtonLink href={routes.products} variant="outline">
              {t.showAll}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Löften */}
      <section className="bg-sand-soft">
        <Container className="py-16">
          <TrustBar />
        </Container>
      </section>

      {/* Paket */}
      {bundles.length > 0 ? (
        <section>
          <Container className="py-16">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow={t.bundlesEyebrow}
                title={t.bundlesTitle}
                intro={t.bundlesIntro}
              />
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
              {bundles.slice(0, 3).map((b) => (
                <BundleCard key={b.slug} bundle={b} locale={locale} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Så jobbar vi */}
      <section className="bg-primary text-primary-fg">
        <Container className="grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow className="text-primary-fg/70">{t.howEyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              {t.howTitle}
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-primary-fg/80">
              {t.howText}
            </p>
            <ButtonLink href={routes.quality} variant="white" className="mt-8">
              {t.howCta}
            </ButtonLink>
          </div>
          <dl className="grid grid-cols-2 gap-6">
            {t.pillars.map(([title, d]) => (
              <div key={title} className="rounded-2xl bg-white/10 p-5 odd:last:col-span-2">
                <dt className="font-display text-lg font-medium">{title}</dt>
                <dd className="mt-1.5 text-sm text-primary-fg/75">{d}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Hitta ditt extrakt (bara där målsidan finns) */}
      {showGoals ? (
        <section>
          <Container className="py-16">
            <SectionHeading
              eyebrow={t.goalsEyebrow}
              title={t.findExtract}
              intro={t.goalsIntro}
            />
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {goals.filter((g) => goalProductCount(g.id, products) > 0).map((g) => {
                const n = goalProductCount(g.id, products);
                return (
                  <li key={g.id}>
                    <Link
                      href={`${routes.goals}?mal=${g.id}`}
                      className="flex h-full flex-col rounded-2xl border border-line p-5 transition-colors hover:border-primary hover:bg-primary-soft"
                    >
                      <span className="font-display text-lg font-medium">{g.label}</span>
                      <span className="mt-1 text-sm text-muted">{g.description}</span>
                      <span className="mt-auto pt-3 text-xs font-medium text-primary">
                        {t.productCount(n)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Journalen */}
      {latest.length > 0 ? (
        <section className="bg-sand-soft">
          <Container className="py-16">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow={t.journalEyebrow} title={t.journalTitle} />
              <Link href={routes.articles} className="hidden items-center gap-1 text-sm font-medium hover:underline sm:inline-flex">
                {t.allArticles} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {latest.map((a) => (
                <ArticleCard key={a.id} article={a} locale={locale} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <Newsletter />
    </>
  );
}
