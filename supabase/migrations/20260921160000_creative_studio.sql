-- Creative Studio: vilket koncept en bild hör till, det interna namnet, egna instruktioner
-- och när den godkändes för kampanjbyggaren.
ALTER TABLE public.ad_creatives
  ADD COLUMN IF NOT EXISTS concept_id text,
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS custom_instructions text,
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz;
CREATE INDEX IF NOT EXISTS ad_creatives_concept_idx ON public.ad_creatives (product_slug, concept_id);
