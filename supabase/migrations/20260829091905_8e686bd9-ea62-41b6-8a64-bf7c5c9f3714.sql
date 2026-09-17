ALTER TABLE public.bundles
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text;

ALTER TABLE public.bundle_components
  ADD COLUMN IF NOT EXISTS blurb text;