import type { Metadata } from "next";
import { CheckIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { campaign } from "@/i18n/messages/campaign";
import { getI18n } from "@/i18n/server";
import { isAdSafe, MUSHROOMS } from "@/lib/ad-safe";
import { getCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { freeShippingOver } from "@/lib/shipping";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, r } = await getI18n();
  const t = campaign[locale];
  return { title: t.metaTitle, description: t.metaDescription, alternates: { canonical: `${site.url}${r.campaign}` } };
}

/**
 * Målsida för Google Ads. Visar bara produkter som klarar lib/ad-safe – inga paket, inga länkar
 * till kategorier eller sidor som nämner otillåtna ämnen. Samma sida för alla besökare.
 */
export default async function CampaignPage() {
  const { locale, market, r } = await getI18n();
  const t = campaign[locale];
  const { products } = await getCatalog(locale);
  const safe = products.filter(isAdSafe);
  const mushrooms = safe.filter((p) => MUSHROOMS.has(p.slug));
  const plants = safe.filter((p) => !MUSHROOMS.has(p.slug));
  const freeOver = formatPrice(freeShippingOver(locale), market.currency);

  const grid = (list: typeof safe) => (
    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {list.map((p, i) => (
        <ProductCard key={p.slug} product={p} locale={locale} priority={i < 4} />
      ))}
    </div>
  );

  return (
    <>
      <section className="bg-sand-soft">
        <Container className="py-12 sm:py-16">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">{t.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{t.intro}</p>
          <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2 lg:flex lg:gap-6">
            {t.usps(freeOver).map((u) => (
              <li key={u} className="flex items-center gap-2">
                <CheckIcon size={15} className="text-primary" /> {u}
              </li>
            ))}
          </ul>
          <ButtonLink href="#produkter" className="mt-8">
            {t.cta}
          </ButtonLink>
        </Container>
      </section>

      <Container id="produkter" className="scroll-mt-20 py-12 sm:py-16">
        {mushrooms.length > 0 ? (
          <section>
            <SectionHeading title={t.mushrooms} intro={t.mushroomsIntro} />
            {grid(mushrooms)}
          </section>
        ) : null}
        {plants.length > 0 ? (
          <section className="mt-16">
            <SectionHeading title={t.plants} intro={t.plantsIntro} />
            {grid(plants)}
          </section>
        ) : null}
      </Container>

      <section className="border-y border-line bg-sand-soft">
        <Container className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium">{t.subTitle}</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">{t.subText}</p>
          </div>
          <ButtonLink href={r.subscription} variant="secondary">
            {t.subLink}
          </ButtonLink>
        </Container>
      </section>

      <Container className="py-10">
        <p className="max-w-3xl text-xs leading-relaxed text-muted">{t.disclaimer}</p>
      </Container>
    </>
  );
}
