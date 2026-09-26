import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { concepts, formats } from "@/content/ad-concepts";
import { adsPerGroup, groupOverridden, groupScore, listCreativeGroups, scenes, type CreativeGroup } from "@/lib/ad-images";
import { realReview } from "@/lib/creative-studio";
import { imageProvider } from "@/lib/image-provider";
import { minImageScore, qaConfigured } from "@/lib/ad-qa";
import { getCatalog } from "@/lib/catalog";
import { higgsfieldConfigured, listPresets } from "@/lib/higgsfield";
import { site } from "@/lib/site";
import { ActionForm, SubmitButton } from "../../_components/ActionForm";
import { Card, Input, Select } from "../../_components/fields";
import { addTextVariantAction, approveGroupAnyway, completeGroupAction, createAdsFromGroups, deleteGroupAction, setGroupActive } from "../actions";
import { CreativeStudio } from "./CreativeStudio";
import { GenerateForm } from "./GenerateForm";
import { UploadForm } from "./UploadForm";
import { angles, fillCopy } from "@/content/ad-copy";
import { adStyles } from "@/content/ad-styles";

/** Textvarianter och granskning kan ta en stund. */
export const maxDuration = 300;

export default async function AdImagesPage({ searchParams }: PageProps<"/admin/annonser/bilder">) {
  await requireAdmin();
  const sp = await searchParams;
  const catalog = await getCatalog();
  const products = catalog.products.filter((p) => p.isActive);
  const slug = typeof sp.slug === "string" && products.some((p) => p.slug === sp.slug) ? sp.slug : (products[0]?.slug ?? "");
  const product = products.find((p) => p.slug === slug);
  // Allt som inte beror på varandra hämtas samtidigt – annars blir det fyra turer i rad
  const [groups, adsByGroup, presets, review] = await Promise.all([
    slug ? listCreativeGroups(slug, false) : Promise.resolve([] as CreativeGroup[]),
    slug ? adsPerGroup(slug) : Promise.resolve(new Map<string, number>()),
    listPresets().catch(() => []),
    slug ? realReview(slug).catch(() => null) : Promise.resolve(null),
  ]);
  const provider = (() => {
    try {
      return imageProvider();
    } catch {
      return null;
    }
  })();
  const usedScenes = new Set(groups.map((g) => g.sceneId));
  const uploadGroups = groups.map((g) => ({ groupId: g.groupId, label: g.label, hasFeed: Boolean(g.feed), hasStory: Boolean(g.story) }));
  const mediaBase = site.indexable ? site.url : "https://metildeco.vercel.app";
  // Godkända rubriker för text på bild: vinklarnas rubriker + produktfakta
  const headlineOptions = product
    ? Array.from(new Set([...angles.map((a) => fillCopy(a.headline, { name: product.name.replace(/ \|.*$/, ""), hook: product.short })), "Tillverkad i Sverige", "Tredjepartstestad batch för batch", "Fri frakt över 499 kr"])).map((h) => ({ value: h, label: h }))
    : [];
  const presetOptions = [{ value: "", label: "Egen scen (våra prompts, produkten i miljö)" }]
    .concat(adStyles.map((s) => ({ value: `style:${s.id}`, label: `Stil: ${s.label} – ${s.description}` })))
    .concat(
    presets
      .slice()
      .sort((a, b) => (a.metadata?.group_name ?? "").localeCompare(b.metadata?.group_name ?? "") || a.name.localeCompare(b.name))
      .map((p) => ({ value: p.id, label: `${p.metadata?.group_name ?? "Mall"}: ${p.name}${p.metadata?.aspect_ratio ? ` (${p.metadata.aspect_ratio})` : ""}` })),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Annonsbilder</h1>
          <p className="mt-1 text-sm text-muted">
            Miljön genereras av {provider?.label ?? "bildmodellen"}, produktens riktiga packshot läggs in ovanpå och texten ritas ur verifierade fakta. Flöde 1080 × 1080 och story 1080 × 1920 komponeras var för sig. Motorn använder alla godkända bilder när den bygger annonser.{" "}
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
        <div className="space-y-6">
          <Card title={`Creative Studio – ${product.name.replace(/ \|.*$/, "")}`}>
            <CreativeStudio
              slug={product.slug}
              productName={product.name.replace(/ \|.*$/, "")}
              concepts={concepts.map((c) => ({ id: c.id, label: c.label, description: c.description, preview: c.preview, wantsReview: c.wantsReview }))}
              formats={formats.map((f) => ({ id: f.id, label: f.label, width: f.width, height: f.height }))}
              hasReview={Boolean(review)}
            />
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Ladda upp egna bilder">
              <UploadForm slug={product.slug} groups={uploadGroups} mediaBase={mediaBase} />
            </Card>
            <details className="rounded-card border border-line bg-white p-5">
              <summary className="cursor-pointer font-display text-lg font-medium">Äldre scengenerering</summary>
              <p className="mt-2 text-sm text-muted">Higgsfield-scener och mallar. Creative Studio ovan ersätter det här för nya bilder.</p>
              <div className="mt-4">
                <GenerateForm slug={product.slug} scenes={scenes.map((sc) => ({ id: sc.id, label: sc.label, used: usedScenes.has(sc.id) }))} presetOptions={presetOptions} mediaBase={mediaBase} />
              </div>
            </details>
          </div>
        </div>
      ) : null}

      {product && groups.length ? (
        <Card title="Skapa annonser av valda bildset">
          <p className="mb-3 text-sm text-muted">
            Bocka i bildseten i listan nedan. AI:n tittar på varje bild och skriver en egen text till den (granskad för hälsopåståenden, mallen som reserv). Resultatet blir en pausad kampanj med en annonsgrupp och en annons per bildset, som du aktiverar under Annonser när du är nöjd.
          </p>
          <ActionForm action={createAdsFromGroups} id="from-groups" className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="slug" value={product.slug} />
            <input type="hidden" name="media_base" value={mediaBase} />
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Daglig budget (USD)</span>
              <Input name="daily_budget" type="number" defaultValue="10" />
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="skip_review" className="mt-0.5 h-4 w-4 accent-primary" />
              <span>
                <span className="font-medium">Skapa även om granskningen underkänner</span>
                <span className="block text-xs text-muted">Granskaren straffar orden Energy och Vitality som står på etiketten. Poängen sparas ändå och syns i kampanjträdet. Du ansvarar för att texten inte innehåller hälsopåståenden.</span>
              </span>
            </label>
            <SubmitButton pendingLabel="Skriver texter och skapar annonser …">Skapa utkast (pausat)</SubmitButton>
          </ActionForm>
        </Card>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-xl font-medium">Bilder ({groups.length})</h2>
        {groups.length === 0 ? <p className="text-sm text-muted">Inga bilder ännu för den här produkten.</p> : null}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <li key={g.groupId} className={`relative rounded-2xl border border-line bg-white p-3 ${(g.feed ?? g.story)?.active ? "" : "opacity-50"}`}>
              <label className="absolute left-5 top-5 z-10 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-xs font-medium shadow" title="Välj för Skapa annonser av valda bildset">
                <input type="checkbox" name="group_id" value={g.groupId} form="from-groups" className="h-4 w-4 accent-primary" />
                Välj
              </label>
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
                    {groupOverridden(g) ? (
                      <span title="Du godkände bilden trots granskningen. Poängen ignoreras." className="ml-2 rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary">
                        godkänd manuellt
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted">
                    {g.kind === "upload" ? "Egen bild" : g.kind === "concept" ? "Creative Studio" : "Higgsfield"} · {g.feed ? g.feed.format : ""}
                    {g.story ? " + 9:16" : ""} · {g.createdAt.slice(0, 10)}
                    {adsByGroup.get(g.groupId) ? ` · ${adsByGroup.get(g.groupId)} annonser` : ""}
                  </p>
                  {(g.feed?.image_review ?? g.story?.image_review)?.issues.length ? <p className="mt-1 text-xs text-danger">{(g.feed?.image_review ?? g.story?.image_review)!.issues.join(" · ")}</p> : null}
                </div>
                {!g.story && g.feed && g.kind !== "upload" && g.kind !== "graphic" ? (
                  <ActionForm action={completeGroupAction} inline>
                    <input type="hidden" name="group_id" value={g.groupId} />
                    <input type="hidden" name="format" value="9:16" />
                    <input type="hidden" name="media_base" value={mediaBase} />
                    <SubmitButton variant="outline" pendingLabel="Gör 9:16 …">Gör 9:16</SubmitButton>
                  </ActionForm>
                ) : null}
                {product && (!g.feed || !g.story) ? (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted hover:text-foreground">Lägg till bild</summary>
                    <UploadForm slug={product.slug} groups={uploadGroups} mediaBase={mediaBase} targetGroupId={g.groupId} compact />
                  </details>
                ) : null}
                {g.kind !== "graphic" && product ? (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted hover:text-foreground">Lägg text</summary>
                    <ActionForm action={addTextVariantAction} className="mt-2 space-y-2">
                      <input type="hidden" name="slug" value={product.slug} />
                      <input type="hidden" name="group_id" value={g.groupId} />
                      <input type="hidden" name="media_base" value={mediaBase} />
                      <Select name="headline" options={headlineOptions} />
                      <Input name="subline" defaultValue={product.short} placeholder="Underrad" />
                      <div className="flex gap-2">
                        <Select name="theme" options={[{ value: "sand", label: "Sand" }, { value: "green", label: "Grön" }]} />
                        <Select name="position" options={[{ value: "auto", label: "Auto" }, { value: "top", label: "Överst" }, { value: "bottom", label: "Nederst" }]} />
                      </div>
                      <SubmitButton variant="outline">Skapa textvariant</SubmitButton>
                    </ActionForm>
                  </details>
                ) : null}
                {!groupOverridden(g) && groupScore(g) !== null && groupScore(g)! < minImageScore() ? (
                  <ActionForm action={approveGroupAnyway} inline confirm={`${g.label} fick ${groupScore(g)} poäng av granskningen. Godkänn ändå? Bilden aktiveras och motorn använder den i nya annonser.`}>
                    <input type="hidden" name="group_id" value={g.groupId} />
                    <SubmitButton variant="primary">Godkänn ändå</SubmitButton>
                  </ActionForm>
                ) : null}
                <ActionForm action={setGroupActive} inline>
                  <input type="hidden" name="group_id" value={g.groupId} />
                  <input type="hidden" name="slug" value={g.groupId && product ? product.slug : ""} />
                  <input type="hidden" name="active" value={(g.feed ?? g.story)?.active ? "0" : "1"} />
                  <SubmitButton variant="outline">{(g.feed ?? g.story)?.active ? "Dölj" : "Aktivera"}</SubmitButton>
                </ActionForm>
                <ActionForm
                  action={deleteGroupAction}
                  inline
                  confirm={
                    adsByGroup.get(g.groupId)
                      ? `${g.label}: bilderna tas bort för alltid. Gruppen används i ${adsByGroup.get(g.groupId)} annonser – de fortsätter att visas, men motorn kan inte iterera vidare på bilden. Ta bort?`
                      : `${g.label}: bilderna tas bort för alltid. Ta bort?`
                  }
                >
                  <input type="hidden" name="group_id" value={g.groupId} />
                  <SubmitButton variant="danger" pendingLabel="Tar bort …">Ta bort</SubmitButton>
                </ActionForm>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
