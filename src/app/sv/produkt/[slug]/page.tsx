import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductContent } from "@/content/product-content";
import { formatPrice } from "@/lib/format";
import { getProduct, getProducts } from "@/lib/catalog";
import { imagesFor, isInStock, isLowStock, relatedProducts } from "@/lib/products";
import { routes } from "@/lib/routes";
import { cheapestSwedenRate } from "@/lib/shipping";
import { company, site } from "@/lib/site";
import { Accordion } from "@/components/Accordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductBuyBox } from "@/components/cart/AddToCart";
import { CheckIcon, FlaskIcon, LeafIcon, ShieldIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { MetaViewContent } from "@/components/consent/MetaEvents";
import { Newsletter } from "@/components/Newsletter";
import { PaymentMethods } from "@/components/PaymentMethods";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery, type Media } from "@/components/ProductGallery";
import { Stars } from "@/components/Stars";
import { TrustBar } from "@/components/TrustBar";
import { Container, Eyebrow } from "@/components/ui";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sv/produkt/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produkten hittades inte" };
  const content = getProductContent(slug);
  return {
    title: `${product.name} – ${formatPrice(product.price)}`,
    description: content?.intro ?? product.short,
    alternates: { canonical: `${site.url}${routes.product(slug)}` },
    openGraph: {
      title: product.name,
      description: product.short,
      images: imagesFor(product).slice(0, 1).map((src) => ({ url: src })),
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/sv/produkt/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const content = getProductContent(slug);
  const inStock = isInStock(product);
  const lowStock = isLowStock(product);
  const images = imagesFor(product);
  const media: Media[] = images.map((src) => ({ type: "image" as const, src }));
  if (product.videoUrl) {
    media.splice(1, 0, { type: "video", src: product.videoUrl, poster: product.videoPosterUrl ?? images[0]! });
  }
  const related = relatedProducts(product, await getProducts(), 4);
  const url = `${site.url}${routes.product(slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: content?.intro ?? product.short,
    image: images.map((src) => `${site.url}${src}`),
    sku: product.sku ?? undefined,
    gtin: product.gtin ?? undefined,
    mpn: product.mpn ?? undefined,
    brand: { "@type": "Brand", name: product.brand },
    category: product.category,
    url,
    ...(site.showRatings && product.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url,
      price: product.price.toFixed(2),
      priceCurrency: site.currency,
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: company.legalName },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: cheapestSwedenRate.price, currency: site.currency },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "SE" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "SE",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <MetaViewContent id={product.slug} name={product.name} price={product.price} category={product.category} />
      <Container className="py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { href: routes.products, label: "Produkter" },
            { href: routes.category(product.category), label: product.category },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <ProductGallery media={media} name={product.name} bg={product.bg} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Eyebrow>{product.category}</Eyebrow>
              {product.tags.includes("Vegansk") ? (
                <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">Vegansk</span>
              ) : null}
            </div>
            <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
            {site.showRatings && product.reviews > 0 ? (
              <div className="mt-3">
                <Stars rating={product.rating} count={product.reviews} size={15} />
              </div>
            ) : null}
            <p className="mt-4 text-lg text-muted">{product.short}</p>

            <ul className="mt-5 space-y-2 text-sm">
              {product.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-primary" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-baseline gap-3">
              <p className="text-3xl font-semibold tabular-nums">{formatPrice(product.price)}</p>
              {product.oldPrice ? <p className="text-lg text-muted line-through tabular-nums">{formatPrice(product.oldPrice)}</p> : null}
              <p className="text-sm text-muted">inkl. moms</p>
            </div>

            <div className="mt-6">
              <ProductBuyBox product={product} inStock={inStock} />
            </div>

            <div className="mt-5 space-y-1.5 text-sm">
              <p className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${inStock ? "bg-success" : "bg-danger"}`} />
                {!inStock ? "Slutsåld – fler är på väg" : lowStock ? `I lager – endast ${product.stock} kvar` : "I lager – skickas samma dag vid order före 12"}
              </p>
              <p className="text-muted">
                Frakt från {formatPrice(cheapestSwedenRate.price)}, fri frakt över {formatPrice(cheapestSwedenRate.freeOver ?? site.freeShippingOver)}.{" "}
                <Link href={routes.shipping} className="underline underline-offset-2 hover:text-foreground">
                  Leveranstid 1–3 arbetsdagar
                </Link>
                .{" "}
                <Link href={routes.returns} className="underline underline-offset-2 hover:text-foreground">
                  30 dagars öppet köp
                </Link>
                .
              </p>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <TrustBar compact />
            </div>
            <PaymentMethods size="sm" className="mt-6" label="Trygg betalning med" />
          </div>
        </div>

        {/* Beskrivning */}
        <section className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-medium">Produkt i korthet</h2>
            <p className="mt-4 leading-relaxed text-muted">{product.description[0]}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-medium">Beskrivning</h2>
            {product.description.slice(1).map((d, i) => (
              <p key={i} className="mt-4 leading-relaxed text-muted">
                {d}
              </p>
            ))}
            {product.description.length < 2 && content ? <p className="mt-4 leading-relaxed text-muted">{content.intro}</p> : null}
          </div>
        </section>
      </Container>

      {content ? (
        <>
          {/* Produktens berättelse */}
          <section className="mt-16 bg-sand-soft">
            <Container className="py-16 sm:py-20">
              <div className="mx-auto max-w-3xl text-center">
                <p className="font-display text-base italic text-muted">{content.eyebrow}</p>
                <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{content.headline}</h2>
                <p className="mt-6 text-lg leading-relaxed text-muted">{content.intro}</p>
                <dl className="mt-10 grid grid-cols-3 gap-4">
                  {content.highlights.map((h) => (
                    <div key={h.label} className="rounded-2xl bg-white p-4 shadow-card">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{h.label}</dt>
                      <dd className="mt-1 font-display text-xl font-medium sm:text-2xl">{h.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-16 space-y-16">
                {content.story.map((s, i) => {
                  const img = product.storyImages[i] ?? null;
                  const flip = i % 2 === 1;
                  return (
                    <div key={s.heading} className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
                      {img ? (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-sand">
                          <Image src={img} alt={s.heading} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                        </div>
                      ) : (
                        <div className="hidden aspect-[4/3] items-center justify-center rounded-card bg-primary-soft text-primary lg:flex">
                          <LeafIcon size={64} />
                        </div>
                      )}
                      <div className="max-w-lg">
                        <h3 className="font-display text-3xl font-medium">{s.heading}</h3>
                        <p className="mt-4 leading-relaxed text-muted">{s.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>

          {/* Fakta, innehåll, användning */}
          <Container className="py-16 sm:py-20">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h3 className="font-display text-3xl font-medium">Fakta</h3>
                <dl className="mt-6 divide-y divide-line border-y border-line">
                  {content.specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-3 text-sm">
                      <dt className="text-muted">{s.label}</dt>
                      <dd className="font-medium">{s.value}</dd>
                    </div>
                  ))}
                  {product.sku ? (
                    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-3 text-sm">
                      <dt className="text-muted">Artikelnummer</dt>
                      <dd className="font-medium">{product.sku}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
              <div className="space-y-10">
                <div>
                  <h3 className="font-display text-3xl font-medium">Innehåll</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{content.ingredients}</p>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-medium">Så använder du den</h3>
                  <ol className="mt-4 space-y-2 text-sm">
                    {content.usage.map((u, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand text-xs font-semibold">{i + 1}</span>
                        <span className="pt-0.5">{u}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="mt-20">
              <h3 className="text-center font-display text-3xl font-medium">Så säkrar vi kvaliteten</h3>
              <ul className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
                {[
                  { icon: LeafIcon, t: "Verifierad råvara", d: "Botanisk kontroll av art och växtdel innan råvaran godkänns." },
                  { icon: FlaskIcon, t: "Tredjepartstestat", d: "Analys av tungmetaller och mikrobiologi på varje batch." },
                  { icon: ShieldIcon, t: "Ren sammansättning", d: "Inga onödiga tillsatser, färgämnen eller fyllnadsmedel." },
                ].map((it) => (
                  <li key={it.t} className="rounded-card border border-line p-6 text-center">
                    <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <it.icon size={24} />
                    </span>
                    <h4 className="mt-4 font-display text-lg font-medium">{it.t}</h4>
                    <p className="mt-2 text-sm text-muted">{it.d}</p>
                  </li>
                ))}
              </ul>
            </div>

            {content.faq.length > 0 ? (
              <div className="mx-auto mt-20 max-w-3xl">
                <h3 className="text-center font-display text-3xl font-medium">Vanliga frågor</h3>
                <div className="mt-8">
                  <Accordion items={content.faq} name="pdp-faq" />
                </div>
              </div>
            ) : null}

            <p className="mx-auto mt-12 max-w-3xl text-center text-xs leading-relaxed text-muted">
              Kosttillskott ersätter inte en varierad kost och en hälsosam livsstil. Rekommenderat dagligt intag bör inte
              överskridas. Förvaras utom räckhåll för små barn.
            </p>
          </Container>
        </>
      ) : null}

      {related.length > 0 ? (
        <Container className="pb-16">
          <h2 className="font-display text-2xl font-medium">Du kanske också gillar</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      ) : null}

      <Newsletter />
    </>
  );
}
