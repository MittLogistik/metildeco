import Link from "next/link";
import { catalogVariants } from "@/content/ad-catalog";
import { requireAdmin } from "@/lib/auth";
import { catalogCandidates, listCatalogs, MAX_CARDS, MIN_CARDS } from "@/lib/catalog-ads";
import { mediaUrl } from "@/lib/media";
import { adsConfigured } from "@/lib/meta-ads";
import { primaryImage } from "@/lib/products";
import { Card } from "../../_components/fields";
import { CatalogBuilder } from "./CatalogBuilder";
import { CatalogList } from "./CatalogList";

/** Bakgrund, kort och text per variant tar en stund. */
export const maxDuration = 300;

export default async function CatalogPage() {
  await requireAdmin();
  const [{ inStock, outOfStock }, catalogs] = await Promise.all([catalogCandidates(), listCatalogs()]);
  const toOption = (p: (typeof inStock)[number]) => ({
    slug: p.slug,
    name: p.name.replace(/ \|.*$/, ""),
    sku: p.sku,
    image: mediaUrl(primaryImage(p)),
    stock: p.stock,
    trackStock: p.trackStock,
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/annonser" className="text-sm text-muted hover:underline">
          ← Annonser
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium">Katalog</h1>
        <p className="mt-1 text-sm text-muted">
          Karusellannonser där bakgrunden löper sammanhängande över korten. Bakgrunden genereras en gång och skärs i kvadrater, produktens riktiga
          packshot läggs i sitt kort och en kort faktarad ritas av oss. Bara produkter som finns i lager kommer med.
        </p>
      </div>

      {!adsConfigured() ? (
        <Card title="Meta är inte kopplat">
          <p className="text-sm text-muted">Kataloger kan byggas ändå, men de kan inte bli annonser förrän META_ADS_TOKEN och META_AD_ACCOUNT_ID finns i miljön.</p>
        </Card>
      ) : null}

      {inStock.length < MIN_CARDS ? (
        <Card title="För få produkter i lager">
          <p className="text-sm text-muted">En karusell behöver minst {MIN_CARDS} produkter som finns i lager. Just nu finns {inStock.length}.</p>
        </Card>
      ) : (
        <Card title="Bygg en katalog">
          <CatalogBuilder
            inStock={inStock.map(toOption)}
            outOfStock={outOfStock.map(toOption)}
            variants={catalogVariants.map((v) => ({ id: v.id, label: v.label, description: v.description }))}
            maxCards={MAX_CARDS}
            minCards={MIN_CARDS}
          />
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-xl font-medium">Kataloger ({catalogs.length})</h2>
        <CatalogList
          catalogs={catalogs.map((c) => ({
            id: c.id,
            label: c.label,
            variantId: c.variantId,
            status: c.status,
            adId: c.adId,
            primaryText: c.primaryText,
            headline: c.headline,
            createdAt: c.createdAt,
            cards: c.cards.map((card) => ({ position: card.position, slug: card.slug, headline: card.headline, description: card.description, url: card.url, score: card.score })),
          }))}
          budget={10}
        />
      </section>
    </div>
  );
}
