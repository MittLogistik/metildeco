import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { groupScore, listCreativeGroups, scenes } from "@/lib/ad-images";
import { minImageScore, qaConfigured } from "@/lib/ad-qa";
import { getCatalog } from "@/lib/catalog";
import { higgsfieldConfigured } from "@/lib/higgsfield";
import { site } from "@/lib/site";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, Field, Input, Select } from "../../_components/fields";
import { generateAdImages, setGroupActive, uploadAdImage } from "../actions";

export default async function AdImagesPage({ searchParams }: PageProps<"/admin/annonser/bilder">) {
  await requireAdmin();
  const sp = await searchParams;
  const catalog = await getCatalog();
  const products = catalog.products.filter((p) => p.isActive);
  const slug = typeof sp.slug === "string" && products.some((p) => p.slug === sp.slug) ? sp.slug : (products[0]?.slug ?? "");
  const product = products.find((p) => p.slug === slug);
  const groups = slug ? await listCreativeGroups(slug, false) : [];
  const usedScenes = new Set(groups.map((g) => g.sceneId));
  const mediaBase = site.indexable ? site.url : "https://metildeco.vercel.app";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Annonsbilder</h1>
          <p className="mt-1 text-sm text-muted">
            Scener genereras runt produktens riktiga packshot via Higgsfield, i 1:1 för flödet och 9:16 för stories. Motorn använder alla aktiva bilder när den bygger annonser.{" "}
            <Link href="/admin/annonser" className="underline">
              Till kampanjerna
            </Link>
          </p>
        </div>
        <nav className="flex flex-wrap gap-1">
          {products.map((p) => (
            <Link key={p.slug} href={`/admin/annonser/bilder?slug=${p.slug}`} className={`rounded-full px-3 py-1.5 text-xs ${p.slug === slug ? "bg-foreground text-white" : "border border-line bg-white text-muted hover:text-foreground"}`}>
              {p.name.replace(/ \|.*$/, "")}
            </Link>
          ))}
        </nav>
      </div>

      {!qaConfigured() ? (
        <Card title="AI-granskning är inte kopplad">
          <p className="text-sm text-muted">Lägg ANTHROPIC_API_KEY eller OPENAI_API_KEY i miljön så granskas varje bild mot packshoten och varje annons för hälsopåståenden innan de används. Utan nyckel används bilderna ogranskade.</p>
        </Card>
      ) : null}
      {!higgsfieldConfigured() ? (
        <Card title="Higgsfield är inte kopplat">
          <p className="text-sm text-muted">Lägg HF_CREDENTIALS (key-id:key-secret) i miljön för att kunna generera scener. Egna bilder kan laddas upp ändå.</p>
        </Card>
      ) : null}

      {product ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title={`Generera scener för ${product.name}`}>
            <ActionForm action={generateAdImages} className="space-y-4">
              <input type="hidden" name="slug" value={product.slug} />
              <Field label="Scener" hint="Redan genererade scener är markerade. Välj inga så tas nästa tre oanvända.">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {scenes.map((s) => (
                    <label key={s.id} className="flex items-center gap-2">
                      <input type="checkbox" name="scene" value={s.id} className="h-4 w-4" />
                      <span>
                        {s.label}
                        {usedScenes.has(s.id) ? <span className="ml-1 text-xs text-muted">(finns)</span> : null}
                      </span>
                    </label>
                  ))}
                </div>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Format">
                  <Select name="formats" options={[{ value: "1:1,9:16", label: "Flöde 1:1 + Story 9:16" }, { value: "1:1", label: "Bara flöde 1:1" }, { value: "3:4,9:16", label: "Flöde 3:4 + Story 9:16" }]} />
                </Field>
                <Field label="Packshot hämtas från" hint="Måste vara nåbar för Higgsfield.">
                  <Input name="media_base" defaultValue={mediaBase} />
                </Field>
              </div>
              <p className="text-xs text-muted">Kostar cirka 0,02 USD per bild. Tar ungefär en halv minut per scen.</p>
              <SubmitButton>Generera</SubmitButton>
            </ActionForm>
          </Card>

          <Card title="Ladda upp egen bild">
            <ActionForm action={uploadAdImage} className="space-y-4">
              <input type="hidden" name="slug" value={product.slug} />
              <Field label="Bildfil" hint="JPG eller PNG. Flöde: 1080×1080 eller 1080×1350. Story: 1080×1920.">
                <input type="file" name="file" accept="image/*" required className="block w-full text-sm" />
              </Field>
              <Field label="Format">
                <Select name="format" options={[{ value: "1:1", label: "Flöde 1:1" }, { value: "3:4", label: "Flöde 4:5 / 3:4" }, { value: "9:16", label: "Story 9:16" }]} />
              </Field>
              <SubmitButton variant="outline">Ladda upp</SubmitButton>
            </ActionForm>
          </Card>
        </div>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-xl font-medium">Bilder ({groups.length})</h2>
        {groups.length === 0 ? <p className="text-sm text-muted">Inga bilder ännu för den här produkten.</p> : null}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <li key={g.groupId} className={`rounded-2xl border border-line bg-white p-3 ${(g.feed ?? g.story)?.active ? "" : "opacity-50"}`}>
              <div className="flex gap-2">
                {g.feed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.feed.url} alt="" className="aspect-square w-2/3 rounded-lg object-cover" />
                ) : null}
                {g.story ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.story.url} alt="" className="aspect-[9/16] w-1/3 rounded-lg object-cover" />
                ) : null}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {g.label}
                    {groupScore(g) !== null ? (
                      <span
                        title={[g.feed?.image_review, g.story?.image_review].filter(Boolean).map((r) => `${r!.score}: ${r!.issues.join("; ") || r!.notes}`).join("\n")}
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${groupScore(g)! >= minImageScore() ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
                      >
                        {groupScore(g)} p
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted">
                    {g.kind === "upload" ? "Egen bild" : "Higgsfield"} · {g.feed ? g.feed.format : ""}
                    {g.story ? " + 9:16" : ""} · {g.createdAt.slice(0, 10)}
                  </p>
                  {(g.feed?.image_review ?? g.story?.image_review)?.issues.length ? <p className="mt-1 text-xs text-danger">{(g.feed?.image_review ?? g.story?.image_review)!.issues.join(" · ")}</p> : null}
                </div>
                <ActionForm action={setGroupActive} inline>
                  <input type="hidden" name="group_id" value={g.groupId} />
                  <input type="hidden" name="slug" value={g.groupId && product ? product.slug : ""} />
                  <input type="hidden" name="active" value={(g.feed ?? g.story)?.active ? "0" : "1"} />
                  <SubmitButton variant="outline">{(g.feed ?? g.story)?.active ? "Dölj" : "Aktivera"}</SubmitButton>
                </ActionForm>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
