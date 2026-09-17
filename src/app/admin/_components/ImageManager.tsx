import Image from "next/image";
import { ActionForm, SubmitButton } from "./ActionForm";
import type { ActionResult } from "../actions";

type Action = (formData: FormData) => Promise<ActionResult>;

/**
 * Bildlista med uppladdning, ordning och borttagning. Fungerar för både produkter
 * (fältet images/story_images/story_hero_image) och paket.
 */
export function ImageManager({
  title,
  hint,
  slug,
  field,
  images,
  single = false,
  upload,
  edit,
}: {
  title: string;
  hint?: string;
  slug: string;
  field?: string;
  images: string[];
  single?: boolean;
  upload: Action;
  edit: Action;
}) {
  return (
    <section className="rounded-card border border-line bg-white p-5">
      <h2 className="font-display text-lg font-medium">{title}</h2>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      {images.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((src, i) => (
            <li key={src} className="rounded-xl border border-line p-2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-sand">
                <Image src={src} alt="" fill sizes="200px" unoptimized className="object-contain p-1" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {!single ? (
                  <>
                    <ActionForm action={edit} inline>
                      <input type="hidden" name="slug" value={slug} />
                      {field ? <input type="hidden" name="field" value={field} /> : null}
                      <input type="hidden" name="url" value={src} />
                      <input type="hidden" name="op" value="up" />
                      <button type="submit" disabled={i === 0} className="rounded-full border border-line px-2 py-0.5 text-xs disabled:opacity-40" aria-label="Flytta upp">
                        ←
                      </button>
                    </ActionForm>
                    <ActionForm action={edit} inline>
                      <input type="hidden" name="slug" value={slug} />
                      {field ? <input type="hidden" name="field" value={field} /> : null}
                      <input type="hidden" name="url" value={src} />
                      <input type="hidden" name="op" value="down" />
                      <button type="submit" disabled={i === images.length - 1} className="rounded-full border border-line px-2 py-0.5 text-xs disabled:opacity-40" aria-label="Flytta ned">
                        →
                      </button>
                    </ActionForm>
                  </>
                ) : null}
                <ActionForm action={edit} inline confirm="Ta bort bilden?">
                  <input type="hidden" name="slug" value={slug} />
                  {field ? <input type="hidden" name="field" value={field} /> : null}
                  <input type="hidden" name="url" value={src} />
                  <input type="hidden" name="op" value="remove" />
                  <button type="submit" className="rounded-full border border-danger/30 px-2 py-0.5 text-xs text-danger">
                    Ta bort
                  </button>
                </ActionForm>
              </div>
              {i === 0 && !single ? <p className="mt-1 text-[11px] text-muted">Huvudbild</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">Inga bilder ännu.</p>
      )}
      {!single || images.length === 0 ? (
        <ActionForm action={upload} className="mt-4 flex flex-wrap items-center gap-2">
          <input type="hidden" name="slug" value={slug} />
          {field ? <input type="hidden" name="field" value={field} /> : null}
          <input type="file" name="file" accept="image/png,image/jpeg,image/webp,image/avif" required className="text-sm" />
          <SubmitButton variant="outline">Ladda upp</SubmitButton>
        </ActionForm>
      ) : null}
    </section>
  );
}
