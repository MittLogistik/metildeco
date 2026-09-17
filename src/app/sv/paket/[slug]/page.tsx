import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bundleInStock, bundles, getBundle } from "@/lib/bundles";
import { formatPrice } from "@/lib/format";
import { primaryImage } from "@/lib/products";
import { routes } from "@/lib/routes";
import { company, site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BundleCard } from "@/components/BundleCard";
import { BundleBuyButton } from "@/components/cart/AddToCart";
import { CheckIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { ProductGallery } from "@/components/ProductGallery";
import { TrustBar } from "@/components/TrustBar";
import { Container, Eyebrow } from "@/components/ui";

export function generateStaticParams() {
  return bundles.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sv/paket/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getBundle(slug);
  if (!bundle) return { title: "Paketet hittades inte" };
  return {
    title: bundle.seoTitle ?? `${bundle.name} – spara ${bundle.discount} %`,
    description: bundle.seoDescription ?? bundle.short,
    alternates: { canonical: `${site.url}${routes.bundle(slug)}` },
  };
}

export default async function BundlePage({ params }: PageProps<"/sv/paket/[slug]">) {
  const { slug } = await params;
  const bundle = getBundle(slug);
  if (!bundle) notFound();
  const inStock = bundleInStock(bundle);
  const others = bundles.filter((b) => b.slug !== slug).slice(0, 3);
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
      priceCurrency: site.currency,
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: company.legalName },
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container className="py-6 sm:py-10">
        <Breadcrumbs items={[{ href: routes.products, label: "Produkter" }, { href: `${routes.products}?typ=paket`, label: "Paket" }, { label: bundle.name }]} />
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <ProductGallery media={bundle.images.map((src) => ({ type: "image" as const, src }))} name={bundle.name} bg={bundle.bg} />
          <div>
            <Eyebrow>Paket · spara {bundle.discount} %</Eyebrow>
            <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{bundle.name}</h1>
            <p className="mt-4 text-lg text-muted">{bundle.short}</p>

            <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted">Detta ingår</h2>
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
                  <span className="text-sm text-muted tabular-nums">{formatPrice(it.product.price * it.qty)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted">
                <dt>Värde styckvis</dt>
                <dd className="line-through tabular-nums">{formatPrice(bundle.value)}</dd>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <dt>Paketpris</dt>
                <dd className="tabular-nums">{formatPrice(bundle.price)}</dd>
              </div>
              <div className="flex justify-between text-success">
                <dt>Du sparar</dt>
                <dd className="tabular-nums">
                  {formatPrice(bundle.value - bundle.price)} ({bundle.discount} %)
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <BundleBuyButton slug={bundle.slug} inStock={inStock} price={bundle.price} />
            </div>
            <ul className="mt-4 space-y-1.5 text-sm text-muted">
              <li className="flex items-center gap-2">
                <CheckIcon size={15} className="text-primary" /> {bundle.freeShipping ? "Fri frakt på detta paket" : `Fri frakt över ${site.freeShippingOver} kr`}
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon size={15} className="text-primary" /> Skickas inom 1–2 dagar
              </li>
            </ul>
            <div className="mt-8 border-t border-line pt-6">
              <TrustBar compact />
            </div>
          </div>
        </div>

        {bundle.description.length > 0 ? (
          <section className="mt-16 max-w-3xl border-t border-line pt-12">
            <h2 className="font-display text-2xl font-medium">Beskrivning</h2>
            {bundle.description.map((d, i) => (
              <p key={i} className="mt-4 leading-relaxed text-muted">
                {d}
              </p>
            ))}
          </section>
        ) : null}

        {others.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-medium">Fler paket</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
              {others.map((b) => (
                <BundleCard key={b.slug} bundle={b} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}
