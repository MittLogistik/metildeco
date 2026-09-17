import type { Metadata } from "next";
import Link from "next/link";
import { articleCategories, articles } from "@/lib/articles";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Journalen – guider om örtextrakt, svampextrakt och kvalitet",
  description:
    "Guider och fördjupning om råvaror, extraktionsgrad, standardisering och rutiner – skrivet av Metilde. Utan genvägar och utan löften vi inte kan hålla.",
  alternates: { canonical: `${site.url}${routes.articles}` },
};

export default async function ArticlesPage({ searchParams }: PageProps<"/sv/artiklar">) {
  const sp = await searchParams;
  const category = typeof sp.kategori === "string" ? sp.kategori : null;
  const list = category ? articles.filter((a) => a.category === category) : articles;
  const [first, ...rest] = list;

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Journalen" }]} />
      <SectionHeading
        as="h1"
        eyebrow="Journalen"
        title="Guider och fördjupning"
        intro="Bakgrund om råvaror, extrakt och rutiner – utan genvägar och utan löften vi inte kan hålla."
        className="mt-6"
      />
      <nav aria-label="Kategori" className="mt-8 flex gap-2 overflow-x-auto border-y border-line py-4 scrollbar-none">
        <Link href={routes.articles} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${!category ? "bg-primary text-primary-fg" : "border border-line hover:border-foreground/40"}`}>
          Alla inlägg
        </Link>
        {articleCategories.map((c) => (
          <Link
            key={c}
            href={`${routes.articles}?kategori=${encodeURIComponent(c)}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${category === c ? "bg-primary text-primary-fg" : "border border-line hover:border-foreground/40"}`}
          >
            {c}
          </Link>
        ))}
      </nav>

      {!first ? (
        <p className="py-20 text-center text-muted">Inga artiklar i den här kategorin ännu.</p>
      ) : (
        <>
          <div className="mt-10">
            <ArticleCard article={first} large />
          </div>
          {rest.length > 0 ? (
            <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : null}
        </>
      )}
      <p className="mt-16 max-w-3xl text-xs leading-relaxed text-muted">
        Innehållet är allmän information om råvaror och rutiner och ersätter inte rådgivning från vård eller apotek.
        Kosttillskott ersätter inte en varierad kost.
      </p>
    </Container>
  );
}
