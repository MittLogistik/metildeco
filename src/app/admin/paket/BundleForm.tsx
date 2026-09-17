import type { Bundle } from "@/lib/bundles";
import { editBundleImage, saveBundle, uploadBundleImage } from "../actions";
import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { Card, Checkbox, Field, Input, Textarea } from "../_components/fields";
import { ImageManager } from "../_components/ImageManager";

export function BundleForm({ bundle, productSlugs }: { bundle: Bundle | null; productSlugs: string[] }) {
  const b = bundle;
  const isNew = b === null;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <ActionForm action={saveBundle} className="space-y-6">
        <input type="hidden" name="isNew" value={isNew ? "true" : "false"} />
        <Card title="Paketet">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Namn" className="sm:col-span-2">
              <Input name="name" defaultValue={b?.name} required />
            </Field>
            <Field label="Slug" hint={isNew ? "Kan inte ändras efteråt." : "Kan inte ändras."}>
              {isNew ? <Input name="slug" required placeholder="performance-paketet" /> : <input type="hidden" name="slug" value={b.slug} />}
              {!isNew ? <span className="block h-10 rounded-xl border border-line bg-sand px-3 leading-10 text-muted">{b.slug}</span> : null}
            </Field>
            <Field label="Artikelnummer (SKU)">
              <Input name="sku" defaultValue={b?.sku} />
            </Field>
            <Field label="Kort beskrivning" className="sm:col-span-2">
              <Input name="short" defaultValue={b?.short} />
            </Field>
            <Field label="Beskrivning" hint="Ett stycke per rad." className="sm:col-span-2">
              <Textarea name="description" defaultValue={b?.description.join("\n")} rows={5} />
            </Field>
            <Field
              label="Ingående produkter"
              hint={`En per rad, med antal om fler än en: tongkat-ali-elite x 2. Tillgängliga: ${productSlugs.join(", ")}`}
              className="sm:col-span-2"
            >
              <Textarea name="components" defaultValue={b?.items.map((i) => (i.qty > 1 ? `${i.product.slug} x ${i.qty}` : i.product.slug)).join("\n")} rows={4} />
            </Field>
          </div>
        </Card>
        <Card title="Pris och synlighet">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Paketpris (kr)" hint="Måste vara lägre än delarnas värde, annars döljs paketet.">
              <Input name="price" type="number" step="1" defaultValue={b?.price} required />
            </Field>
            <Field label="Jämförpris (kr)" hint="Lämna tomt så räknas delarnas värde.">
              <Input name="old_price" type="number" step="1" defaultValue={null} />
            </Field>
            <Field label="Sorteringsordning">
              <Input name="sort_order" type="number" step="1" defaultValue={b?.sortOrder ?? 0} />
            </Field>
            <Field label="Bakgrundsfärg">
              <Input name="bg" defaultValue={b?.bg ?? "#f2efe8"} />
            </Field>
            <Field label="SEO-titel" className="sm:col-span-2">
              <Input name="seo_title" defaultValue={b?.seoTitle} />
            </Field>
            <Field label="SEO-beskrivning" className="sm:col-span-3">
              <Input name="seo_description" defaultValue={b?.seoDescription} />
            </Field>
          </div>
          <div className="mt-5 space-y-3">
            <Checkbox name="free_shipping" label="Fri frakt på paketet" defaultChecked={b?.freeShipping ?? true} />
            <Checkbox name="is_active" label="Visas i butiken" defaultChecked={b?.isActive ?? false} />
          </div>
        </Card>
        <div className="flex items-center gap-3">
          <SubmitButton>{isNew ? "Skapa paket" : "Spara ändringar"}</SubmitButton>
          {!isNew ? (
            <a href={`/sv/paket/${b.slug}`} target="_blank" rel="noopener" className="text-sm underline">
              Visa i butiken
            </a>
          ) : null}
        </div>
      </ActionForm>
      <div>
        {isNew ? (
          <Card title="Bilder">
            <p className="text-sm text-muted">Spara paketet först, sedan kan du ladda upp bilder.</p>
          </Card>
        ) : (
          <ImageManager title="Paketbilder" hint="Saknas bilder används produkternas huvudbilder." slug={b.slug} images={b.images} upload={uploadBundleImage} edit={editBundleImage} />
        )}
      </div>
    </div>
  );
}
