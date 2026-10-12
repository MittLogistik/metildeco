import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bundleInStock } from "@/lib/bundles";
import { getBundle, getBundles } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { primaryImage } from "@/lib/products";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { freeShippingOver } from "@/lib/shipping";
import { alternates, getI18n } from "@/i18n/server";
import { catalog } from "@/i18n/messages/catalog";
import { company, site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BundleCard } from "@/components/BundleCard";
import { BundleBuyButton } from "@/components/cart/AddToCart";
import { CheckIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PaymentMethods } from "@/components/PaymentMethods";
import { ProductGallery } from "@/components/ProductGallery";
import { TrustBar } from "@/components/TrustBar";
import { Container, Eyebrow } from "@/components/ui";

/** Paketen som säljs på språket (lang kommer från föräldern [lang]). */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale: Locale = isLocale(params.lang) ? params.lang : "sv";
  return (await getBundles(locale)).map((b) => ({ slug: b.slug }));
}

/** Språken där paketet säljs (hreflang). */
const localesWith = async (slug: string): Promise<Locale[]> =>
  (await Promise.all(locales.map(async (l) => ((await getBundle(slug, l)) ? l : null)))).filter((l): l is Locale => l !== null);

export async function generateMetadata({ params }: PageProps<"/[lang]/paket/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, r } = await getI18n();
  const t = catalog[locale];
  const bundle = await getBundle(slug, locale);
  if (!bundle) return { title: t.bundleNotFound };
  return {
    title: bundle.seoTitle ?? t.bundleSeoTitle(bundle.name, bundle.discount),
    description: bundle.seoDescription ?? bundle.short,
    alternates: alternates(r.bundle(slug), { only: await localesWith(slug) }),
  };
}

export default async function BundlePage({ params }: PageProps<"/[lang]/paket/[slug]">) {
  const { slug } = await params;
  const { locale, market, r: routes } = await getI18n();
  const t = catalog[locale];
  const currency = market.currency;
  const bundle = await getBundle(slug, locale);
  if (!bundle) notFound();
  const inStock = bundleInStock(bundle);
  const others = (await getBundles(locale)).filter((b) => b.slug !== slug).slice(0, 3);
  const url = `${site.url}${routes.bundle(slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bundle.name,
    description: bundle.short,
    image: bundle.images.map((src) => `${site.url}${src}`),
    sku: bundle.sku ?? undefined,
    brand: { "@type": "Brand", name: "Metilde" },
    url,
    offers: {
      "@type": "Offer",
      url,
      price: bundle.price.toFixed(2),
      priceCurrency: currency,
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: company.legalName },
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container className="py-6 sm:py-10">
        <Breadcrumbs items={[{ href: routes.products, label: t.products }, { href: `${routes.products}?typ=paket`, label: t.bundles }, { label: bundle.name }]} />
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <ProductGallery media={bundle.images.map((src) => ({ type: "image" as const, src }))} name={bundle.name} bg={bundle.bg} />
          <div>
            <Eyebrow>{t.bundleEyebrow(bundle.discount)}</Eyebrow>
            <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{bundle.name}</h1>
            <p className="mt-4 text-lg text-muted">{bundle.short}</p>

            <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted">{t.included}</h2>
            <ul className="mt-3 divide-y divide-line rounded-card border border-line">
              {bundle.items.map((it) => (
                <li key={it.product.slug} className="flex items-center gap-4 p-3">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl" style={{ backgroundColor: it.product.bg }}>
                    <Image src={primaryImage(it.product)} alt="" fill sizes="56px" className="object-contain p-1" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link href={routes.product(it.product.slug)} className="block text-sm font-medium hover:underline">
                      {it.qty} × {it.product.name}
                    </Link>
                    <span className="block text-xs text-muted">{it.blurb ?? it.product.short}</span>
                  </span>
                  <span className="text-sm text-muted tabular-nums">{formatPrice(it.product.price * it.qty, currency)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted">
                <dt>{t.valueSeparately}</dt>
                <dd className="tabular-nums">{formatPrice(bundle.value, currency)}</dd>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <dt>{t.bundlePrice}</dt>
                <dd className="tabular-nums">{formatPrice(bundle.price, currency)}</dd>
              </div>
              <div className="flex justify-between text-success">
                <dt>{t.youSave}</dt>
                <dd className="tabular-nums">
                  {formatPrice(bundle.value - bundle.price, currency)} ({bundle.discount} %)
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <BundleBuyButton slug={bundle.slug} inStock={inStock} price={bundle.price} />
            </div>
            <ul className="mt-4 space-y-1.5 text-sm text-muted">
              <li className="flex items-center gap-2">
                <CheckIcon size={15} className="text-primary" /> {bundle.freeShipping ? t.bundleFreeShipping : t.freeShippingOver(formatPrice(freeShippingOver(locale), currency))}
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon size={15} className="text-primary" /> {t.sameDay}
              </li>
            </ul>
            <div className="mt-8 border-t border-line pt-6">
              <TrustBar compact />
            </div>
            <PaymentMethods size="sm" className="mt-6" label={t.securePayment} />
          </div>
        </div>

        {bundle.description.length > 0 ? (
          <section className="mt-16 max-w-3xl border-t border-line pt-12">
            <h2 className="font-display text-2xl font-medium">{t.description}</h2>
            {bundle.description.map((d, i) => (
              <p key={i} className="mt-4 leading-relaxed text-muted">
                {d}
              </p>
            ))}
          </section>
        ) : null}

        {others.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-medium">{t.moreBundles}</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
              {others.map((b) => (
                <BundleCard key={b.slug} bundle={b} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}
