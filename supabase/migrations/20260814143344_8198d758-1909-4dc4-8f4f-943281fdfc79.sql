CREATE TABLE public.bundle_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_slug text NOT NULL REFERENCES public.bundles(slug) ON DELETE CASCADE,
  currency text NOT NULL,
  price numeric NOT NULL,
  old_price numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bundle_slug, currency)
);

GRANT SELECT ON public.bundle_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bundle_prices TO authenticated;
GRANT ALL ON public.bundle_prices TO service_role;

ALTER TABLE public.bundle_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bundle prices" ON public.bundle_prices FOR SELECT TO anon USING (true);
CREATE POLICY "Signed in users can read bundle prices" ON public.bundle_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage bundle prices" ON public.bundle_prices FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER bundle_prices_set_updated_at BEFORE UPDATE ON public.bundle_prices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();