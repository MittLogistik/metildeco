-- Varifrån ordern kom (src/lib/attribution.ts): kanal, detalj (kampanj, källa eller domän) och kanal vid första besöket.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS source_detail text,
  ADD COLUMN IF NOT EXISTS first_source text;

-- Det som går att veta om äldre ordrar: förnyelser och affiliateköp. Resten förblir okänd.
UPDATE public.orders SET source = 'renewal' WHERE source IS NULL AND kind = 'renewal';
UPDATE public.orders SET source = 'affiliate', source_detail = affiliate_click_ref WHERE source IS NULL AND affiliate_click_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS orders_source_idx ON public.orders (source);
