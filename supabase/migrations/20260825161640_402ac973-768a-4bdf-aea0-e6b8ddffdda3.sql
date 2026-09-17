CREATE TABLE public.product_feed_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug TEXT NOT NULL,
  locale TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_slug, locale)
);

GRANT SELECT ON public.product_feed_translations TO anon;
GRANT SELECT ON public.product_feed_translations TO authenticated;
GRANT ALL ON public.product_feed_translations TO service_role;

ALTER TABLE public.product_feed_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feed translations are public" ON public.product_feed_translations
FOR SELECT USING (true);