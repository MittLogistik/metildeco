-- Spara annonstexten per annons så att den kan granskas om och visas i admin.
ALTER TABLE public.ad_variants
  ADD COLUMN IF NOT EXISTS primary_text text,
  ADD COLUMN IF NOT EXISTS headline text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS image_url text;
