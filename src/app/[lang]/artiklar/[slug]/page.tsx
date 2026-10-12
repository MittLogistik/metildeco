import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { articlesFor, getArticle, type ArticleBlock } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { getProducts } from "@/lib/catalog";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import type { Routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { articlesMessages } from "@/i18n/messages/articles";
import { alternates, getI18n } from "@/i18n/server";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/ui";

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return isLocale(params.lang) ? articlesFor(params.lang).map((a) => ({ slug: a.slug })) : [];
}

/** Språken där artikeln finns (för hreflang). */
const languagesOf = (slug: string): Locale[] => locales.filter((l) => getArticle(slug, l));

export async function generateMetadata({ params }: PageProps<"/[lang]/artiklar/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, r } = await getI18n();
  const a = getArticle(slug, locale);
  if (!a) return { title: articlesMessages[locale].notFound };
  return {
    title: a.seoTitle ?? a.title,
    description: a.seoDescription ?? a.excerpt,
    alternates: alternates(r.article(slug), { key: "articles", only: languagesOf(slug) }),
    openGraph: { type: "article", title: a.title, description: a.excerpt, images: a.coverImage ? [{ url: a.coverImage }] : [] },
  };
}

/** Artiklarnas text har länkar i markdown-form: [text](product:slug), [text](/sv/...) eller [text](https://...), och *kursiv*. */
function Inline({ text, r }: { text: string; r: Routes }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*([^*\n]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[3] !== undefined) {
      out.push(<em key={k++}>{m[3]}</em>);
    } else {
      // Produktlänkar leder till produkten på artikelns språk
      const href = m[2].startsWith("product:") ? r.product(m[2].slice(8)) : m[2];
      out.push(
        href.startsWith("/") ? (
          <Link key={k++} href={href}>
            {m[1]}
          </Link>
        ) : (
          <a key={k++} href={href} target="_blank" rel="noopener">
            {m[1]}
          </a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

function Block({ block, products, r, locale }: { block: ArticleBlock; products: Product[]; r: Routes; locale: Locale }) {
  const t = articlesMessages[locale];
  switch (block.type) {
    case "heading":
      return <h2>{block.text}</h2>;
    case "paragraph":
      return (
        <p>
          <Inline text={block.text} r={r} />
        </p>
      );
    case "list":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>
              <Inline text={it} r={r} />
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote>
          <p>
            <Inline text={block.text} r={r} />
          </p>
          {block.source ? <footer className="mt-2 text-sm not-italic text-muted">– {block.source}</footer> : null}
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-10">
          <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-sand">
            <Image src={block.src} alt={block.caption ?? ""} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          </div>
          {block.caption ? <figcaption className="mt-2 text-center text-sm text-muted">{block.caption}</figcaption> : null}
        </figure>
      );
    case "products": {
      const list = block.slugs.map((s) => products.find((p) => p.slug === s)).filter((p) => p !== undefined);
      if (list.length === 0) return null;
      return (
        <aside className="my-12 rounded-card bg-sand-soft p-6 not-prose sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{t.fromRange}</p>
          <h3 className="mt-2 font-display text-2xl font-medium">{block.heading ?? t.productsInArticle}</h3>
          {block.intro ? <p className="mt-2 text-sm text-muted">{block.intro}</p> : null}
          <div className={`mt-6 grid gap-6 ${list.length > 1 ? "grid-cols-2 sm:grid-cols-3" : "max-w-xs"}`}>
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} locale={locale} />
            ))}
          </div>
        </aside>
      );
    }
  }
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/artiklar/[slug]">) {
  const { slug } = await params;
  const { locale, r } = await getI18n();
  const t = articlesMessages[locale];
  const article = getArticle(slug, locale);
  if (!article) notFound();
  const more = articlesFor(locale).filter((a) => a.slug !== slug).slice(0, 3);
  const products = await getProducts(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [`${site.url}${article.coverImage}`] : undefined,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: "Metilde" },
    publisher: { "@type": "Organization", name: "Metilde", logo: { "@type": "ImageObject", url: `${site.url}/logo-mark.png` } },
    inLanguage: locale,
    mainEntityOfPage: `${site.url}${r.article(slug)}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ href: r.articles, label: t.journal }, { label: article.title }]} />
        <article className="mx-auto mt-8 max-w-3xl">
          <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {article.category} <span className="mx-1.5 text-muted-soft">·</span>
              <span className="font-medium normal-case tracking-normal text-muted">{t.readMinutes(article.readMinutes)}</span>
            </p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">{article.title}</h1>
            {article.publishedAt ? (
              <p className="mt-4 text-sm text-muted">
                {t.published} <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
              </p>
            ) : null}
          </header>
          {article.coverImage ? (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-card bg-sand">
              <Image src={article.coverImage} alt={article.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>
          ) : null}
          <p className="mt-8 text-xl leading-relaxed text-muted">{article.lead}</p>
          <div className="prose-metilde mt-8">
            {article.blocks.map((b, i) => (
              <Block key={i} block={b} products={products} r={r} locale={locale} />
            ))}
          </div>
          <p className="mt-12 rounded-2xl bg-sand-soft p-5 text-xs leading-relaxed text-muted">{t.disclaimer}</p>
        </article>

        {more.length > 0 ? (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-medium">{t.more}</h2>
            <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((a) => (
                <ArticleCard key={a.id} article={a} locale={locale} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}
