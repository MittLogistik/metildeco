import type { Metadata } from "next";
import Link from "next/link";
import { bundles } from "@/lib/bundles";
import { categories, isInStock, products } from "@/lib/products";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BundleCard } from "@/components/BundleCard";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Alla produkter – ört- och svampextrakt",
  description:
    "Hela Metildes sortiment av standardiserade örtextrakt och svampextrakt: Tongkat Ali, Fadogia Agrestis, Blue Lotus, Lion's Mane, Cordyceps med mera. Tillverkat i Sverige.",
  alternates: { canonical: `${site.url}${routes.products}` },
};

type Sort = "utvald" | "pris-lag" | "pris-hog" | "namn";

const sorts: { id: Sort; label: string }[] = [
  { id: "utvald", label: "Utvald" },
  { id: "pris-lag", label: "Pris: lägst först" },
  { id: "pris-hog", label: "Pris: högst först" },
  { id: "namn", label: "Namn A–Ö" },
];

export default async function ProductsPage({ searchParams }: PageProps<"/sv/produkter">) {
  const sp = await searchParams;
  const category = typeof sp.kategori === "string" ? sp.kategori : null;
  const sort: Sort = (sorts.find((s) => s.id === sp.sortera)?.id ?? "utvald") as Sort;
  const showBundles = sp.typ === "paket";

  let list = category ? products.filter((p) => p.category === category) : products;
  list = [...list];
  switch (sort) {
    case "pris-lag":
      list.sort((a, b) => a.price - b.price);
      break;
    case "pris-hog":
      list.sort((a, b) => b.price - a.price);
      break;
    case "namn":
      list.sort((a, b) => a.name.localeCompare(b.name, "sv"));
      break;
    default:
      list.sort((a, b) => Number(isInStock(b)) - Number(isInStock(a)) || a.sortOrder - b.sortOrder);
  }

  const href = (params: Record<string, string | null>) => {
    const q = new URLSearchParams();
    const merged = { kategori: category, sortera: sort === "utvald" ? null : sort, typ: showBundles ? "paket" : null, ...params };
    for (const [k, v] of Object.entries(merged)) if (v) q.set(k, v);
    const s = q.toString();
    return s ? `${routes.products}?${s}` : routes.products;
  };

  const title = showBundles ? "Paket" : category ?? "Alla produkter";

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={category || showBundles ? [{ href: routes.products, label: "Produkter" }, { label: title }] : [{ label: "Produkter" }]} />
      <h1 className="mt-6 font-display text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Standardiserade extrakt i vegansk kapsel, tillverkade i Sverige och tredjepartstestade batch för batch.
      </p>

      <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Kategori" className="flex gap-2 overflow-x-auto scrollbar-none lg:flex-wrap">
          <Link
            href={href({ kategori: null, typ: null })}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${!category && !showBundles ? "bg-primary text-primary-fg" : "border border-line hover:border-foreground/40"}`}
          >
            Alla
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={href({ kategori: c, typ: null })}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${category === c ? "bg-primary text-primary-fg" : "border border-line hover:border-foreground/40"}`}
            >
              {c}
            </Link>
          ))}
          {bundles.length > 0 ? (
            <Link
              href={href({ kategori: null, typ: "paket" })}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${showBundles ? "bg-primary text-primary-fg" : "border border-line hover:border-foreground/40"}`}
            >
              Paket
            </Link>
          ) : null}
        </nav>
        {!showBundles ? (
          <div className="flex shrink-0 items-center gap-2 text-sm">
            <span className="text-muted">Sortera:</span>
            <div className="flex gap-1">
              {sorts.map((s) => (
                <Link
                  key={s.id}
                  href={href({ sortera: s.id === "utvald" ? null : s.id })}
                  className={`rounded-full px-3 py-1.5 ${sort === s.id ? "bg-sand font-medium" : "text-muted hover:text-foreground"}`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {showBundles ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {bundles.map((b) => (
            <BundleCard key={b.slug} bundle={b} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="py-20 text-center text-muted">Inga produkter i den här kategorin just nu.</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted">{list.length} produkter</p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 4} />
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
