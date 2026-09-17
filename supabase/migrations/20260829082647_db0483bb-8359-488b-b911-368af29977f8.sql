ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS customs_description text,
  ADD COLUMN IF NOT EXISTS customs_code text,
  ADD COLUMN IF NOT EXISTS country_of_origin text NOT NULL DEFAULT 'SE',
  ADD COLUMN IF NOT EXISTS weight_grams integer;