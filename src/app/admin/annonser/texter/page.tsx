import Link from "next/link";
import { angles, productHooks } from "@/content/ad-copy";
import { copyAiConfigured, writeAdCopy, type AdCopy } from "@/lib/ad-writer";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { minAdScore, qaConfigured, reviewAd } from "@/lib/ad-qa";
import { primaryImage } from "@/lib/products";
import { site } from "@/lib/site";
import { Card } from "../../_components/fields";

/** Fem texter skrivs och granskas – det tar en stund. */
export const maxDuration = 300;

type Result = AdCopy & { angleId: string; score: number | null; issues: string[] };

export default async function AdCopyPreviewPage({ searchParams }: PageProps<"/admin/annonser/texter">) {
  await requireAdmin();
  const sp = await searchParams;
  const catalog = await getCatalog();
  const products = catalog.products.filter((p) => p.isActive);
  const slug = typeof sp.slug === "string" ? sp.slug : "";
  const product = products.find((p) => p.slug === slug);
  const notes: string[] = [];
  const mediaBase = site.indexable ? site.url : "https://metildeco.vercel.app";

  let results: Result[] = [];
  if (product) {
    const hooks = productHooks[product.slug] ?? [product.short];
    results = await Promise.all(
      angles.map(async (angle, i) => {
        const copy = await writeAdCopy({ product, angle, hook: hooks[i % hooks.length]!, notes });
        // Samma granskning som stoppar en riktig annons, fast utan bild
        const review = qaConfigured()
          ? await reviewAd({ primaryText: copy.primaryText, headline: copy.headline, description: copy.description, imageUrl: `${mediaBase}${primaryImage(product)}`, product }).catch(() => null)
          : null;
        return { ...copy, angleId: angle.id, score: review?.score ?? null, issues: review?.issues ?? [] };
      }),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/annonser" className="text-sm text-muted hover:underline">
          ← Annonser
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium">Annonstexter</h1>
        <p className="mt-1 text-sm text-muted">
          Så här skriver AI texterna till nästa kampanj – en per vinkel, med emojis och säljande ton. Samma texter används när du skapar en
          kampanj. Ladda om sidan för nya förslag.
        </p>
      </div>

      {!copyAiConfigured() ? (
        <Card title="AI-texter är avstängda">
          <p className="text-sm text-muted">Lägg OPENAI_API_KEY i miljön (eller ta bort AD_COPY_AI=false) så skrivs texterna av AI. Utan nyckel används mallarna i ad-copy.ts.</p>
        </Card>
      ) : null}

      <nav className="flex flex-wrap gap-1">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/annonser/texter?slug=${p.slug}`}
            className={`rounded-full px-3 py-1.5 text-xs ${p.slug === slug ? "bg-foreground text-white" : "border border-line bg-white text-muted hover:text-foreground"}`}
          >
            {p.name.replace(/ \|.*$/, "")}
          </Link>
        ))}
      </nav>

      {!product ? (
        <p className="text-sm text-muted">Välj en produkt för att se förslagen.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((r) => (
            <Card key={r.angleId}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-muted">{r.angleId}</span>
                <span className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${r.source === "ai" ? "bg-primary-soft text-primary" : "bg-sand text-muted"}`}>
                    {r.source === "ai" ? "AI" : "Mall"}
                  </span>
                  {r.score !== null ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${r.score >= minAdScore() ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>{r.score} p</span>
                  ) : null}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm">{r.primaryText}</p>
              <p className="mt-3 border-t border-line pt-3 text-sm font-semibold">{r.headline}</p>
              {r.description ? <p className="text-xs text-muted">{r.description}</p> : null}
              {r.issues.length ? <p className="mt-2 text-xs text-danger">{r.issues.join(" · ")}</p> : null}
            </Card>
          ))}
        </div>
      )}

      {notes.length ? (
        <Card title="Noteringar">
          <ul className="space-y-1 text-xs text-muted">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
