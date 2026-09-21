import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { catalogCandidates, getOne, listCatalogs, MAX_CARDS, MIN_CARDS } from "@/lib/catalog-ads";
import { mediaUrl } from "@/lib/media";
import { adsConfigured } from "@/lib/meta-ads";
import { primaryImage } from "@/lib/products";
import { Card } from "../../_components/fields";
import { CatalogBuilder, type CatalogView } from "./CatalogBuilder";

/** Bilder delas och laddas upp här, och kampanjen skapas mot Meta. */
export const maxDuration = 300;

const fmt = (iso: string) => new Date(iso).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" });

export default async function CatalogPage({ searchParams }: PageProps<"/admin/annonser/katalog">) {
  await requireAdmin();
  const sp = await searchParams;
  const openId = typeof sp.id === "string" ? sp.id : null;
  const [{ inStock, outOfStock }, catalogs, open] = await Promise.all([catalogCandidates(), listCatalogs(), openId ? getOne(openId) : Promise.resolve(null)]);

  const toOption = (p: (typeof inStock)[number]) => ({
    slug: p.slug,
    name: p.name.replace(/ \|.*$/, ""),
    sku: p.sku,
    image: mediaUrl(primaryImage(p)),
    stock: p.stock,
    trackStock: p.trackStock,
  });
  const view = (c: (typeof catalogs)[number]): CatalogView => ({
    id: c.id,
    label: c.label,
    status: c.status,
    adId: c.adId,
    primaryText: c.primaryText,
    headline: c.headline,
    createdAt: c.createdAt,
    cards: c.cards.map((card) => ({ id: card.id, position: card.position, slug: card.slug, headline: card.headline, description: card.description, url: card.url })),
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/annonser" className="text-sm text-muted hover:underline">
          ← Annonser
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium">Katalog</h1>
        <p className="mt-1 text-sm text-muted">
          Karusellannons av egna bilder. Ladda upp ett kort i taget eller en bred bild som delas, koppla varje kort till en produkt, bestäm ordningen
          och godkänn texten. Titel, beskrivning och länk per kort hämtas från produkten. Bara varor i lager kan väljas.
        </p>
      </div>

      {!adsConfigured() ? (
        <Card title="Meta är inte kopplat">
          <p className="text-sm text-muted">Kataloger kan byggas ändå, men kampanjen kan inte skapas förrän META_ADS_TOKEN och META_AD_ACCOUNT_ID finns i miljön.</p>
        </Card>
      ) : null}

      {inStock.length < MIN_CARDS ? (
        <Card title="För få produkter i lager">
          <p className="text-sm text-muted">
            En karusell behöver minst {MIN_CARDS} produkter som finns i lager. Just nu finns {inStock.length}.
          </p>
        </Card>
      ) : (
        <Card title={open ? `Redigera: ${open.label}` : "Ny katalog"}>
          <CatalogBuilder
            catalog={open ? view(open) : null}
            inStock={inStock.map(toOption)}
            outOfStock={outOfStock.map(toOption)}
            maxCards={MAX_CARDS}
            minCards={MIN_CARDS}
            budget={10}
          />
        </Card>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-medium">Kataloger ({catalogs.length})</h2>
          {open ? (
            <Link href="/admin/annonser/katalog" className="text-sm underline underline-offset-2">
              Ny katalog
            </Link>
          ) : null}
        </div>
        {catalogs.length === 0 ? (
          <p className="text-sm text-muted">Inga kataloger ännu.</p>
        ) : (
          <ul className="space-y-2">
            {catalogs.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {c.label}
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${c.status === "published" ? "bg-primary-soft text-primary" : "bg-sand text-muted"}`}>
                      {c.status === "published" ? "publicerad (pausad)" : "utkast"}
                    </span>
                  </p>
                  <p className="text-xs text-muted">
                    {c.cards.length} kort · {fmt(c.createdAt)}
                    {c.primaryText ? " · text godkänd" : " · text saknas"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {c.cards.slice(0, 5).map((card) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={card.id} src={card.url} alt="" className="h-9 w-9 rounded-lg border-2 border-white object-cover" />
                    ))}
                  </div>
                  <Link href={`/admin/annonser/katalog?id=${c.id}`} className="h-9 rounded-full border border-line px-3 text-sm leading-9 hover:bg-sand">
                    Öppna
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
