import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { articles, getArticle, type ArticleBlock } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { getProduct } from "@/lib/products";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/ui";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sv/artiklar/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Artikeln hittades inte" };
  return {
    title: a.seoTitle ?? a.title,
    description: a.seoDescription ?? a.excerpt,
    alternates: { canonical: `${site.url}${routes.article(slug)}` },
    openGraph: { type: "article", title: a.title, description: a.excerpt, images: a.coverImage ? [{ url: a.coverImage }] : [] },
  };
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "heading":
      return <h2>{block.text}</h2>;
    case "paragraph":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote>
          <p>{block.text}</p>
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
      const list = block.slugs.map(getProduct).filter((p) => p !== undefined);
      if (list.length === 0) return null;
      return (
        <aside className="my-12 rounded-card bg-sand-soft p-6 not-prose sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Ur sortimentet</p>
          <h3 className="mt-2 font-display text-2xl font-medium">{block.heading ?? "Produkter i artikeln"}</h3>
          {block.intro ? <p className="mt-2 text-sm text-muted">{block.intro}</p> : null}
          <div className={`mt-6 grid gap-6 ${list.length > 1 ? "grid-cols-2 sm:grid-cols-3" : "max-w-xs"}`}>
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </aside>
      );
    }
  }
}

export default async function ArticlePage({ params }: PageProps<"/sv/artiklar/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const more = articles.filter((a) => a.slug !== slug).slice(0, 3);

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
    mainEntityOfPage: `${site.url}${routes.article(slug)}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ href: routes.articles, label: "Journalen" }, { label: article.title }]} />
        <article className="mx-auto mt-8 max-w-3xl">
          <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {article.category} <span className="mx-1.5 text-muted-soft">·</span>
              <span className="font-medium normal-case tracking-normal text-muted">{article.readMinutes} min läsning</span>
            </p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">{article.title}</h1>
            {article.publishedAt ? (
              <p className="mt-4 text-sm text-muted">
                Publicerad <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
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
              <Block key={i} block={b} />
            ))}
          </div>
          <p className="mt-12 rounded-2xl bg-sand-soft p-5 text-xs leading-relaxed text-muted">
            Innehållet är allmän information om råvaror och rutiner och ersätter inte rådgivning från vård eller apotek.
            Kosttillskott ersätter inte en varierad kost.
          </p>
        </article>

        {more.length > 0 ? (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-medium">Fler artiklar</h2>
            <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}
