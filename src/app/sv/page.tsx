import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { getCatalog } from "@/lib/catalog";
import { aggregateRating, categoriesOf, isInStock } from "@/lib/products";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { goalProductCount, goals } from "@/content/goals";
import { ArticleCard } from "@/components/ArticleCard";
import { BundleCard } from "@/components/BundleCard";
import { ArrowRight, CheckIcon, StarIcon } from "@/components/icons";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { TrustBar } from "@/components/TrustBar";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Metilde – Rena botaniska kosttillskott tillverkade i Sverige",
  description:
    "Tongkat Ali, Fadogia Agrestis, Blue Lotus och funktionella svampar som standardiserade extrakt utan onödiga tillsatser. Tredjepartstestat, tillverkat i Sverige. Fri frakt över 499 kr.",
  alternates: { canonical: `${site.url}/sv` },
};

export default async function HomePage() {
  const { products, bundles } = await getCatalog();
  const categories = categoriesOf(products);
  const hero = products.find((p) => p.slug === "tongkat-ali-elite") ?? products[0]!;
  const inStock = products.filter(isInStock);
  const featured = [...inStock, ...products.filter((p) => !isInStock(p))].slice(0, 8);
  const rating = site.showRatings ? aggregateRating(products) : null;
  const latest = articles.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-sand-soft">
        <Container className="grid gap-10 py-12 lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="max-w-xl">
            {site.campaign ? (
              <Link href={site.campaign.href} className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-semibold text-accent">
                {site.campaign.label} <ArrowRight size={14} />
              </Link>
            ) : (
              <Eyebrow>Tillverkat i Sverige · Tredjepartstestat</Eyebrow>
            )}
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Rena botaniska extrakt <span className="text-primary">för en stark vardag</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Standardiserade ört- och svampextrakt i vegansk kapsel – utan bindemedel, fyllnadsmedel eller färgämnen.
              Varje batch analyseras av oberoende labb innan den packas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={routes.products} size="lg">
                Handla nu
              </ButtonLink>
              <ButtonLink href={routes.goals} size="lg" variant="outline">
                Handla efter mål
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {rating ? (
                <li className="flex items-center gap-1.5">
                  <StarIcon size={15} className="text-star" />
                  <span>
                    <strong className="font-semibold text-foreground">{rating.avg.toFixed(1).replace(".", ",")} / 5</strong> ·{" "}
                    {rating.count} omdömen
                  </span>
                </li>
              ) : null}
              <li className="flex items-center gap-1.5">
                <CheckIcon size={15} className="text-primary" /> Fri frakt över {site.freeShippingOver} kr
              </li>
              <li className="flex items-center gap-1.5">
                <CheckIcon size={15} className="text-primary" /> 30 dagars öppet köp
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
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">Bästsäljare</span>
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
            Alla produkter
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
            <SectionHeading eyebrow="Sortimentet" title="Populära just nu" />
            <Link href={routes.products} className="hidden items-center gap-1 text-sm font-medium hover:underline sm:inline-flex">
              Alla produkter <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 4} />
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <ButtonLink href={routes.products} variant="outline">
              Visa alla produkter
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
                eyebrow="Paket"
                title="Kombinera och spara"
                intro="Färdiga kombinationer av våra mest efterfrågade extrakt – alltid med fri frakt."
              />
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
              {bundles.slice(0, 3).map((b) => (
                <BundleCard key={b.slug} bundle={b} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Så jobbar vi */}
      <section className="bg-primary text-primary-fg">
        <Container className="grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow className="text-primary-fg/70">Så jobbar vi</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              Du ska veta exakt vad som finns i varje kapsel
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-primary-fg/80">
              Vi anger alltid latinskt namn, växtdel, extraktstyrka och mängd per kapsel. Inga fyllnadsmedel, inga
              flytmedel, inga färgämnen – och batchnumret på förpackningen hör ihop med ett specifikt analysprotokoll.
            </p>
            <ButtonLink href={routes.quality} variant="white" className="mt-8">
              Läs om vår kvalitetsgaranti
            </ButtonLink>
          </div>
          <dl className="grid grid-cols-2 gap-6">
            {[
              ["Standardiserat", "Samma innehåll i varje batch – mätt på markörsubstans eller extraktstyrka."],
              ["Testat", "Identitet, tungmetaller och mikrobiologi analyseras av oberoende laboratorium."],
              ["Veganskt", "Växtbaserat kapselskal (HPMC eller pullulan). Glutenfritt, utan GMO."],
              ["Svenskt", "Tillverkat i små batcher i Sverige enligt europeiska tillverkningskrav."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl bg-white/10 p-5">
                <dt className="font-display text-lg font-medium">{t}</dt>
                <dd className="mt-1.5 text-sm text-primary-fg/75">{d}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Handla efter mål */}
      <section>
        <Container className="py-16">
          <SectionHeading
            eyebrow="Personligt"
            title="Handla efter mål"
            intro="Välj vad du vill fokusera på så visar vi de produkter i sortimentet som passar. Kombinera gärna flera mål."
          />
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {goals.map((g) => {
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
                      {n} {n === 1 ? "produkt" : "produkter"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Journalen */}
      {latest.length > 0 ? (
        <section className="bg-sand-soft">
          <Container className="py-16">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow="Journalen" title="Guider och fördjupning" />
              <Link href={routes.articles} className="hidden items-center gap-1 text-sm font-medium hover:underline sm:inline-flex">
                Alla artiklar <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {latest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <Newsletter />
    </>
  );
}
