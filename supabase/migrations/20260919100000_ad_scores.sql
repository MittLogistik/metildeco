-- AI-granskning: poäng och anmärkningar per annonsbild och per annons.
ALTER TABLE public.ad_creatives
  ADD COLUMN IF NOT EXISTS image_score integer,
  ADD COLUMN IF NOT EXISTS image_review jsonb,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

ALTER TABLE public.ad_variants
  ADD COLUMN IF NOT EXISTS ad_score integer,
  ADD COLUMN IF NOT EXISTS ad_review jsonb;
