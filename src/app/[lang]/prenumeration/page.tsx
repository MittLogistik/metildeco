import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { isInStock, subscriptionUnitPrice } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { roundPrice } from "@/lib/i18n";
import { alternates, getI18n } from "@/i18n/server";
import { subscription } from "@/i18n/messages/subscription";
import { site } from "@/lib/site";
import { Accordion } from "@/components/Accordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, r } = await getI18n();
  const t = subscription[locale];
  return {
    title: t.title(site.subscriptionDiscount),
    description: t.description(site.subscriptionDiscount),
    alternates: alternates(r.subscription, { key: "subscription" }),
  };
}

export default async function SubscriptionPage() {
  const { locale, market, r: routes } = await getI18n();
  const t = subscription[locale];
  const currency = market.currency;
  const pct = site.subscriptionDiscount;
  const products = await getProducts(locale);
  const example = products.find((p) => p.slug === "tongkat-ali-elite") ?? products[0]!;
  const subPrice = subscriptionUnitPrice(example.price, pct, currency);
  // Leveranser per år med en förpackning per leverans och ett intervall som räcker hela förpackningen (60 kapslar = 60 dagar)
  const yearly = roundPrice((example.price - subPrice) * 6, currency);
  const popular = products.filter(isInStock).slice(0, 4);

  return (
    <>
      <section className="bg-sand-soft">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={[{ label: t.breadcrumb }]} />
          <div className="mt-6 max-w-2xl">
            <Eyebrow>{t.eyebrow(pct)}</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
              {t.h1}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {t.lead(pct)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={routes.products} size="lg">
                {t.start}
              </ButtonLink>
              <ButtonLink href="#sa-fungerar-det" size="lg" variant="outline">
                {t.how}
              </ButtonLink>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {t.checks.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckIcon size={15} className="text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Container className="py-16" id="sa-fungerar-det">
        <SectionHeading eyebrow={t.stepsEyebrow} title={t.how} intro={t.stepsIntro} />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map(([title, d], i) => (
            <li key={title} className="rounded-card border border-line p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg">{i + 1}</span>
              <h3 className="mt-4 font-display text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </Container>

      <section className="bg-sand-soft">
        <Container className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow={t.exampleEyebrow}
              title={t.exampleTitle}
              intro={t.exampleIntro(pct)}
            />
            <ul className="mt-6 space-y-2 text-sm">
              {t.exampleChecks(pct, formatPrice(0, currency)).map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <CheckIcon size={15} className="text-primary" /> {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-white p-6 shadow-card sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{t.example(example.name)}</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt>{t.oneTime}</dt>
                <dd className="tabular-nums">{t.perDelivery(formatPrice(example.price, currency))}</dd>
              </div>
              <div className="flex justify-between font-medium">
                <dt>{t.subscriptionLabel}</dt>
                <dd className="tabular-nums">
                  <span className="mr-2 text-muted line-through">{formatPrice(example.price, currency)}</span>
                  {t.perDelivery(formatPrice(subPrice, currency))}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>{t.shipping}</dt>
                <dd className="tabular-nums">{formatPrice(0, currency)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                <dt>{t.yearly}</dt>
                <dd className="tabular-nums">{formatPrice(yearly, currency)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted">{t.exampleNote}</p>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <SectionHeading eyebrow={t.benefitsEyebrow} title={t.benefitsTitle} />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.benefits(pct).map(([title, d]) => (
            <li key={title} className="rounded-card bg-sand-soft p-6">
              <h3 className="font-display text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </Container>

      <Container className="pb-16">
        <SectionHeading eyebrow={t.popularEyebrow} title={t.popularTitle} />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {popular.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} />
          ))}
        </div>
      </Container>

      <Container className="pb-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-medium">{t.faqTitle}</h2>
          <div className="mt-8">
            <Accordion items={t.faq} name="sub-faq" />
          </div>
        </div>
      </Container>
    </>
  );
}
