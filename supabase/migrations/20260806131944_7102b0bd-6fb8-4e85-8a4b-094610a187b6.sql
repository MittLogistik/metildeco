CREATE TABLE public.integration_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.integration_settings TO service_role;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER integration_settings_set_updated_at
BEFORE UPDATE ON public.integration_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.bundle_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_slug text NOT NULL,
  product_slug text NOT NULL REFERENCES public.products(slug) ON DELETE CASCADE,
  qty integer NOT NULL DEFAULT 1,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bundle_slug, product_slug)
);
GRANT SELECT ON public.bundle_components TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bundle_components TO authenticated;
GRANT ALL ON public.bundle_components TO service_role;
ALTER TABLE public.bundle_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bundle components"
  ON public.bundle_components FOR SELECT TO anon USING (true);
CREATE POLICY "Signed in users can read bundle components"
  ON public.bundle_components FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage bundle components"
  ON public.bundle_components FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER bundle_components_set_updated_at
BEFORE UPDATE ON public.bundle_components
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();