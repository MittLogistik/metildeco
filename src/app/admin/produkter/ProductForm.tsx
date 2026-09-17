import type { Product } from "@/lib/products";
import { editProductImage, saveProduct, uploadProductImage } from "../actions";
import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { Card, Checkbox, Field, Input, Textarea } from "../_components/fields";
import { ImageManager } from "../_components/ImageManager";

const categories = ["Tongkat Ali", "Träning", "Lugn & sömn", "Örter", "Hud & hår", "Svampextrakt", "Adaptogener", "Maghälsa", "Vitaminer", "Mineraler", "Omega-3", "Elektrolyter"];

export function ProductForm({ product }: { product: Product | null }) {
  const p = product;
  const isNew = p === null;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <ActionForm action={saveProduct} className="space-y-6">
        <input type="hidden" name="isNew" value={isNew ? "true" : "false"} />
        <Card title="Grunduppgifter">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Namn" className="sm:col-span-2">
              <Input name="name" defaultValue={p?.name} required placeholder="Tongkat Ali Elite | 60 kapslar" />
            </Field>
            <Field label="Slug" hint={isNew ? "Del av webbadressen, t.ex. tongkat-ali-elite. Kan inte ändras efteråt." : "Kan inte ändras."}>
              {isNew ? <Input name="slug" required placeholder="tongkat-ali-elite" /> : <input type="hidden" name="slug" value={p.slug} />}
              {!isNew ? <span className="block h-10 rounded-xl border border-line bg-sand px-3 leading-10 text-muted">{p.slug}</span> : null}
            </Field>
            <Field label="Kategori">
              <Input name="category" defaultValue={p?.category} placeholder={categories.join(", ")} />
            </Field>
            <Field label="Kort beskrivning" hint="Visas under namnet på produktsidan och i sök." className="sm:col-span-2">
              <Input name="short" defaultValue={p?.short} />
            </Field>
            <Field label="Punkter" hint="En punkt per rad." className="sm:col-span-2">
              <Textarea name="bullets" defaultValue={p?.bullets.join("\n")} rows={4} />
            </Field>
            <Field label="Beskrivning" hint="Ett stycke per rad. Inga hälsopåståenden." className="sm:col-span-2">
              <Textarea name="description" defaultValue={p?.description.join("\n")} rows={5} />
            </Field>
            <Field label="Etiketter" hint="Kommaseparerat: Bästsäljare, Nyhet, Vegansk">
              <Input name="tags" defaultValue={p?.tags.join(", ")} />
            </Field>
            <Field label="Bakgrundsfärg" hint="Hex-färg bakom produktbilden.">
              <Input name="bg" defaultValue={p?.bg ?? "#f2efe8"} />
            </Field>
          </div>
        </Card>

        <Card title="Pris och köp">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Pris (kr)">
              <Input name="price" type="number" step="1" defaultValue={p?.price} required />
            </Field>
            <Field label="Jämförpris (kr)" hint="Överstruket pris. Lämna tomt om inget.">
              <Input name="old_price" type="number" step="1" defaultValue={p?.oldPrice} />
            </Field>
            <Field label="Inköpspris (kr)" hint="Visas aldrig för kunder.">
              <Input name="purchase_price" type="number" step="0.01" defaultValue={null} />
            </Field>
          </div>
          <div className="mt-5 space-y-3">
            <Checkbox name="tiered_pricing" label="Antal-väljare med mängdrabatt" hint="Visar 1 / 2 / 3 förpackningar med lägre styckpris på produktsidan." defaultChecked={p?.tieredPricing} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Rabatt vid 2 st (%)">
                <Input name="tier_2_discount" type="number" step="1" defaultValue={p?.tier2Discount ?? 10} />
              </Field>
              <Field label="Rabatt vid 3 st (%)">
                <Input name="tier_3_discount" type="number" step="1" defaultValue={p?.tier3Discount ?? 15} />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Lager och synlighet">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Lagersaldo" hint="Synkas från Plocky när kopplingen finns.">
              <Input name="stock" type="number" step="1" defaultValue={p?.stock ?? 0} />
            </Field>
            <Field label="Artikelnummer (SKU)">
              <Input name="sku" defaultValue={p?.sku} />
            </Field>
            <Field label="Sorteringsordning" hint="Lägre tal visas först.">
              <Input name="sort_order" type="number" step="1" defaultValue={p?.sortOrder ?? 0} />
            </Field>
          </div>
          <div className="mt-5 space-y-3">
            <Checkbox name="track_stock" label="Lagersaldot styr köpknappen" hint="Avstängd: produkten kan alltid köpas." defaultChecked={p?.trackStock ?? true} />
            <Checkbox name="is_active" label="Visas i butiken" defaultChecked={p?.isActive ?? false} />
          </div>
        </Card>

        <Card title="Feeds, tull och video">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="GTIN / EAN">
              <Input name="gtin" defaultValue={p?.gtin} />
            </Field>
            <Field label="MPN">
              <Input name="mpn" defaultValue={p?.mpn} />
            </Field>
            <Field label="Varumärke">
              <Input name="brand" defaultValue={p?.brand ?? "Metilde"} />
            </Field>
            <Field label="Google-produktkategori" className="sm:col-span-3">
              <Input name="google_product_category" defaultValue={p?.googleProductCategory} placeholder="Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements" />
            </Field>
            <Field label="Tullbeskrivning">
              <Input name="customs_description" defaultValue={p?.customsDescription ?? "Food supplement capsules"} />
            </Field>
            <Field label="HS-kod">
              <Input name="customs_code" defaultValue={p?.customsCode ?? "2106909298"} />
            </Field>
            <Field label="Ursprungsland">
              <Input name="country_of_origin" defaultValue={p?.countryOfOrigin ?? "SE"} />
            </Field>
            <Field label="Vikt (gram)">
              <Input name="weight_grams" type="number" step="1" defaultValue={p?.weightGrams} />
            </Field>
            <Field label="Säljs bara i länder" hint="Kommaseparerade landskoder. Tomt = alla.">
              <Input name="countries" defaultValue={p?.countries.join(", ")} />
            </Field>
            <Field label="Video (mp4-adress)" className="sm:col-span-2">
              <Input name="video_url" defaultValue={p?.videoUrl} />
            </Field>
            <Field label="Stillbild för video" className="sm:col-span-3">
              <Input name="video_poster_url" defaultValue={p?.videoPosterUrl} />
            </Field>
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <SubmitButton>{isNew ? "Skapa produkt" : "Spara ändringar"}</SubmitButton>
          {!isNew ? (
            <a href={`/sv/produkt/${p.slug}`} target="_blank" rel="noopener" className="text-sm underline">
              Visa i butiken
            </a>
          ) : null}
        </div>
      </ActionForm>

      <div className="space-y-6">
        {isNew ? (
          <Card title="Bilder">
            <p className="text-sm text-muted">Spara produkten först, sedan kan du ladda upp bilder.</p>
          </Card>
        ) : (
          <>
            <ImageManager title="Produktbilder" hint="Första bilden är huvudbild. PNG med transparent bakgrund fungerar bäst." slug={p.slug} field="images" images={p.images} upload={uploadProductImage} edit={editProductImage} />
            <ImageManager title="Toppbild på landningssidan" hint="Bred livsstilsbild överst i produktens berättelse." slug={p.slug} field="story_hero_image" images={p.storyHeroImage ? [p.storyHeroImage] : []} single upload={uploadProductImage} edit={editProductImage} />
            <ImageManager title="Bilder i berättelsen" hint="En bild per avsnitt (Roten, Ren sammansättning, Tillverkad i Sverige …)." slug={p.slug} field="story_images" images={p.storyImages} upload={uploadProductImage} edit={editProductImage} />
          </>
        )}
      </div>
    </div>
  );
}
