import type { Metadata } from "next";
import Link from "next/link";
import { articleCategoriesFor, articlesFor } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container, SectionHeading } from "@/components/ui";
import { articlesMessages } from "@/i18n/messages/articles";
import { alternates, getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, r } = await getI18n();
  const t = articlesMessages[locale];
  return { title: t.metaTitle, description: t.metaDescription, alternates: alternates(r.articles, { key: "articles" }) };
}

export default async function ArticlesPage({ searchParams }: PageProps<"/[lang]/artiklar">) {
  const { locale, r } = await getI18n();
  const t = articlesMessages[locale];
  const sp = await searchParams;
  const category = typeof sp.kategori === "string" ? sp.kategori : null;
  const all = articlesFor(locale);
  const list = category ? all.filter((a) => a.category === category) : all;
  const [first, ...rest] = list;

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: t.journal }]} />
      <SectionHeading as="h1" eyebrow={t.journal} title={t.title} intro={t.intro} className="mt-6" />
      <nav aria-label={t.categoryNav} className="mt-8 flex gap-2 overflow-x-auto border-y border-line py-4 scrollbar-none">
        <Link href={r.articles} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${!category ? "bg-primary text-primary-fg" : "border border-line hover:border-foreground/40"}`}>
          {t.allPosts}
        </Link>
        {articleCategoriesFor(locale).map((c) => (
          <Link
            key={c}
            href={`${r.articles}?kategori=${encodeURIComponent(c)}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${category === c ? "bg-primary text-primary-fg" : "border border-line hover:border-foreground/40"}`}
          >
            {c}
          </Link>
        ))}
      </nav>

      {!first ? (
        <p className="py-20 text-center text-muted">{t.empty}</p>
      ) : (
        <>
          <div className="mt-10">
            <ArticleCard article={first} large locale={locale} />
          </div>
          {rest.length > 0 ? (
            <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} locale={locale} />
              ))}
            </div>
          ) : null}
        </>
      )}
      <p className="mt-16 max-w-3xl text-xs leading-relaxed text-muted">{t.disclaimer}</p>
    </Container>
  );
}
