CREATE TABLE public.product_locale_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL,
  locale text NOT NULL,
  placement text NOT NULL CHECK (placement IN ('gallery','story','hero')),
  position integer NOT NULL DEFAULT 0,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_slug, locale, placement, position)
);

CREATE INDEX product_locale_images_slug_locale_idx
  ON public.product_locale_images (product_slug, locale);

GRANT SELECT ON public.product_locale_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_locale_images TO authenticated;
GRANT ALL ON public.product_locale_images TO service_role;

ALTER TABLE public.product_locale_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locale images are publicly readable"
  ON public.product_locale_images FOR SELECT
  USING (true);

CREATE POLICY "Admins manage locale images"
  ON public.product_locale_images FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER product_locale_images_set_updated_at
  BEFORE UPDATE ON public.product_locale_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();