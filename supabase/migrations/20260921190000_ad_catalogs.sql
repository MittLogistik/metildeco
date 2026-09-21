-- Katalogannonser (karusell): en sammanhängande bakgrund som löper över korten,
-- ett kort per produkt. Två varianter per omgång så att de kan ställas mot varandra.
CREATE TABLE IF NOT EXISTS public.ad_catalogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  variant_id text NOT NULL,
  label text NOT NULL,
  primary_text text,
  headline text,
  description text,
  prompt text,
  custom_instructions text,
  provider text,
  copy_source text,
  status text NOT NULL DEFAULT 'draft',
  ad_id text,
  campaign_id text,
  adset_id text,
  environment text NOT NULL DEFAULT 'live'
);

CREATE TABLE IF NOT EXISTS public.ad_catalog_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id uuid NOT NULL REFERENCES public.ad_catalogs(id) ON DELETE CASCADE,
  position integer NOT NULL,
  product_slug text NOT NULL,
  headline text NOT NULL,
  description text,
  url text NOT NULL,
  storage_path text,
  image_score integer,
  image_review jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (catalog_id, position)
);

ALTER TABLE public.ad_catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_catalog_cards ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.ad_catalogs TO service_role;
GRANT ALL ON public.ad_catalog_cards TO service_role;
CREATE INDEX IF NOT EXISTS ad_catalog_cards_catalog_idx ON public.ad_catalog_cards (catalog_id, position);
