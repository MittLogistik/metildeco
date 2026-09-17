ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS feed_exclusions text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS gtin text,
  ADD COLUMN IF NOT EXISTS mpn text,
  ADD COLUMN IF NOT EXISTS google_product_category text,
  ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'Metilde';