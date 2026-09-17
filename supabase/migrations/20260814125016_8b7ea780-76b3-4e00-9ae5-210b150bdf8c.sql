CREATE TABLE public.bundles (
  slug text PRIMARY KEY,
  name text NOT NULL,
  short text NOT NULL DEFAULT '',
  description text[] NOT NULL DEFAULT '{}',
  price numeric NOT NULL,
  bg text NOT NULL DEFAULT '#f4f0e8',
  images text[] NOT NULL DEFAULT '{}',
  free_shipping boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.bundles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bundles TO authenticated;
GRANT ALL ON public.bundles TO service_role;

ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active bundles" ON public.bundles FOR SELECT TO anon USING (is_active);
CREATE POLICY "Signed in users can read bundles" ON public.bundles FOR SELECT TO authenticated USING (is_active OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage bundles" ON public.bundles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER bundles_set_updated_at BEFORE UPDATE ON public.bundles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.bundles (slug, name, short, description, price, bg, is_active, sort_order)
VALUES (
  'performance-paketet',
  'Performance Paketet',
  'Tongkat Ali Elite, Fadogia Agrestis och Blue Lotus – tre botaniska klassiker för energi, träning och lugn.',
  ARRAY[
    'Performance Paketet samlar tre av våra mest efterfrågade extrakt i en och samma rutin.',
    'Tongkat Ali Elite och Fadogia Agrestis används under dagen kring träning, medan Blue Lotus passar på kvällen för att varva ner.'
  ],
  1099,
  '#e7ecea',
  true,
  0
);

DELETE FROM public.bundle_components WHERE bundle_slug = 'performance-paketet';
INSERT INTO public.bundle_components (bundle_slug, product_slug, qty, sort_order) VALUES
  ('performance-paketet', 'tongkat-ali-elite', 1, 0),
  ('performance-paketet', 'fadogia-agrestis', 1, 1),
  ('performance-paketet', 'blue-lotus', 1, 2);