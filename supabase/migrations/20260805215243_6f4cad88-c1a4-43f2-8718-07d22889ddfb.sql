CREATE TABLE public.products (
  slug text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  old_price numeric,
  purchase_price numeric,
  rating numeric NOT NULL DEFAULT 0,
  reviews integer NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}',
  bg text NOT NULL DEFAULT '#f2f2f2',
  short text NOT NULL DEFAULT '',
  bullets text[] NOT NULL DEFAULT '{}',
  description text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  variant jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products" ON public.products
  FOR SELECT TO anon USING (is_active);
CREATE POLICY "Signed in users can read products" ON public.products
  FOR SELECT TO authenticated USING (is_active OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.product_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL REFERENCES public.products(slug) ON DELETE CASCADE,
  currency text NOT NULL,
  price numeric NOT NULL,
  old_price numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_slug, currency)
);

GRANT SELECT ON public.product_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_prices TO authenticated;
GRANT ALL ON public.product_prices TO service_role;

ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read prices" ON public.product_prices
  FOR SELECT TO anon USING (true);
CREATE POLICY "Signed in users can read prices" ON public.product_prices
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage prices" ON public.product_prices
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER product_prices_set_updated_at BEFORE UPDATE ON public.product_prices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();