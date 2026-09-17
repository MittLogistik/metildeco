ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS countries text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS tiered_pricing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tier_2_discount integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS tier_3_discount integer NOT NULL DEFAULT 15;