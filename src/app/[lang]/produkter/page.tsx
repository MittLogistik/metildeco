import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { categoriesOf, isInStock } from "@/lib/products";
import { alternates, getI18n } from "@/i18n/server";
import { catalog } from "@/i18n/messages/catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BundleCard } from "@/components/BundleCard";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, r } = await getI18n();
  const t = catalog[locale];
  return { title: t.listTitle, description: t.listDescription, alternates: alternates(r.products, { key: "products" }) };
}

type Sort = "utvald" | "pris-lag" | "pris-hog" | "namn";

const sortIds: Sort[] = ["utvald", "pris-lag", "pris-hog", "namn"];

export default async function ProductsPage({ searchParams }: PageProps<"/[lang]/produkter">) {
  const sp = await searchParams;
  const { locale, market, r: routes } = await getI18n();
  const t = catalog[locale];
  const sorts = sortIds.map((id) => ({ id, label: t.sorts[id] }));
  // Kategorin i adressen är kategorins namn på sidans språk (samma som på produkterna)
  const { products, bundles } = await getCatalog(locale);
  const categories = categoriesOf(products);
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
      list.sort((a, b) => a.name.localeCompare(b.name, market.intl));
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

  const title = showBundles ? t.bundles : category ?? t.allProducts;

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={category || showBundles ? [{ href: routes.products, label: t.products }, { label: title }] : [{ label: t.products }]} />
      <h1 className="mt-6 font-display text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted">
        {t.listIntro}
      </p>

      <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label={t.categoryNav} className="flex gap-2 overflow-x-auto scrollbar-none lg:flex-wrap">
          <Link
            href={href({ kategori: null, typ: null })}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${!category && !showBundles ? "bg-primary text-primary-fg" : "border border-line hover:border-foreground/40"}`}
          >
            {t.all}
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
              {t.bundles}
            </Link>
          ) : null}
        </nav>
        {!showBundles ? (
          <div className="-mx-4 flex min-w-0 items-center gap-2 overflow-x-auto px-4 text-sm scrollbar-none lg:mx-0 lg:shrink-0 lg:px-0">
            <span className="shrink-0 text-muted">{t.sortLabel}</span>
            <div className="flex gap-1.5">
              {sorts.map((s) => (
                <Link
                  key={s.id}
                  href={href({ sortera: s.id === "utvald" ? null : s.id })}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] ${sort === s.id ? "border-foreground bg-foreground font-medium text-white" : "border-line text-muted hover:text-foreground"}`}
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
            <BundleCard key={b.slug} bundle={b} locale={locale} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="py-20 text-center text-muted">{t.emptyCategory}</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted">{t.productCount(list.length)}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 4} locale={locale} />
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
