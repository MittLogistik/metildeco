-- Köperbjudande per produkt (3-pack prenumeration med gåva) och A/B-test av köprutan.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS offer_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS offer_pack_qty integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS offer_gift_slug text,
  ADD COLUMN IF NOT EXISTS offer_gift_choices text[] NOT NULL DEFAULT '{}';
GRANT SELECT (offer_enabled, offer_pack_qty, offer_gift_slug, offer_gift_choices) ON public.products TO anon, authenticated;

-- Vilken köpruta kunden såg när ordern lades (a = nuvarande, b = erbjudandet)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS experiment_variant text;

-- Händelser per variant: ab_view (köprutan visades), add_to_cart, begin_checkout
CREATE TABLE IF NOT EXISTS public.experiment_events (
  id bigserial PRIMARY KEY,
  experiment text NOT NULL,
  variant text NOT NULL,
  event text NOT NULL,
  product_slug text,
  visitor_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS experiment_events_idx ON public.experiment_events (experiment, variant, event, created_at DESC);
GRANT SELECT ON public.experiment_events TO authenticated;
GRANT ALL ON public.experiment_events TO service_role;
ALTER TABLE public.experiment_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read experiment events" ON public.experiment_events;
CREATE POLICY "Admins read experiment events" ON public.experiment_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
