
-- ===== 20260805192538_25dc7f97-2050-4c9c-9f71-5f784610b4e6.sql =====
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- shared updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Locales
CREATE TABLE public.locales (
  code text PRIMARY KEY,
  name text NOT NULL,
  english_name text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  is_default boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.locales TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locales TO authenticated;
GRANT ALL ON public.locales TO service_role;
ALTER TABLE public.locales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read enabled locales"
ON public.locales FOR SELECT TO anon, authenticated
USING (enabled = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage locales"
ON public.locales FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER locales_set_updated_at
BEFORE UPDATE ON public.locales
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Translations (all UI, product and article strings, keyed by dotted key)
CREATE TABLE public.ui_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  locale text NOT NULL REFERENCES public.locales(code) ON DELETE CASCADE,
  namespace text NOT NULL DEFAULT 'ui',
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (locale, key)
);

CREATE INDEX ui_translations_locale_idx ON public.ui_translations (locale);
CREATE INDEX ui_translations_namespace_idx ON public.ui_translations (namespace);

GRANT SELECT ON public.ui_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ui_translations TO authenticated;
GRANT ALL ON public.ui_translations TO service_role;
ALTER TABLE public.ui_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read translations for enabled locales"
ON public.ui_translations FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.locales l WHERE l.code = locale AND l.enabled));

CREATE POLICY "Admins manage translations"
ON public.ui_translations FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER ui_translations_set_updated_at
BEFORE UPDATE ON public.ui_translations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.locales (code, name, english_name, enabled, is_default, sort_order) VALUES
  ('en', 'English', 'English', true, true, 1),
  ('sv', 'Svenska', 'Swedish', true, false, 2);
-- ===== 20260805192709_3870df67-457e-4bac-8cb2-3bcfa5b62b0e.sql =====
DROP POLICY "Anyone can read enabled locales" ON public.locales;

CREATE POLICY "Anyone can read enabled locales"
ON public.locales FOR SELECT TO anon
USING (enabled = true);

CREATE POLICY "Signed in users can read locales"
ON public.locales FOR SELECT TO authenticated
USING (enabled = true OR public.has_role(auth.uid(), 'admin'));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
-- ===== 20260805214101_0d00547b-a2a9-4f56-bd09-6f658718c96e.sql =====
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  first_name text,
  last_name text,
  phone text,
  address text,
  postal_code text,
  city text,
  country text,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- ===== 20260805214131_df3d6937-1a50-4980-90be-8635da218762.sql =====
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
-- ===== 20260805215243_6f4cad88-c1a4-43f2-8718-07d22889ddfb.sql =====
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
-- ===== 20260805220544_4c84580e-9b2d-43f8-8593-69410e83629e.sql =====
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'pending',
  currency text NOT NULL DEFAULT 'SEK',
  subtotal numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  shipping numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  has_subscription boolean NOT NULL DEFAULT false,
  shipping_name text,
  shipping_address text,
  shipping_postal_code text,
  shipping_city text,
  shipping_country text,
  stripe_session_id text UNIQUE,
  stripe_payment_intent text,
  stripe_customer_id text,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_slug text NOT NULL,
  name text NOT NULL,
  qty integer NOT NULL DEFAULT 1,
  plan text NOT NULL DEFAULT 'once',
  unit_price numeric NOT NULL DEFAULT 0,
  line_total numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  product_slug text,
  product_id text,
  price_id text,
  status text NOT NULL DEFAULT 'active',
  quantity integer NOT NULL DEFAULT 1,
  amount numeric,
  currency text NOT NULL DEFAULT 'SEK',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_session ON public.orders(stripe_session_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);

GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;
GRANT ALL ON public.subscriptions TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  ));

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER subscriptions_set_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
-- ===== 20260805224024_5461a30f-7bd7-4888-89f7-996915070a7b.sql =====
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stripe_invoice_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'checkout';

CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_invoice_id_key
  ON public.orders (stripe_invoice_id) WHERE stripe_invoice_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS orders_email_idx ON public.orders (lower(email));
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders (user_id);

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS paused_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_shipment_at timestamptz;

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions (user_id);
CREATE INDEX IF NOT EXISTS subscriptions_email_idx ON public.subscriptions (lower(email));

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_id_key
  ON public.subscriptions (stripe_subscription_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  )
  ON CONFLICT (id) DO NOTHING;

  IF NEW.email IS NOT NULL THEN
    UPDATE public.orders
      SET user_id = NEW.id
      WHERE user_id IS NULL AND lower(email) = lower(NEW.email);

    UPDATE public.subscriptions
      SET user_id = NEW.id
      WHERE user_id IS NULL AND lower(email) = lower(NEW.email);
  END IF;

  RETURN NEW;
END;
$function$;
-- ===== 20260805224055_7649e5eb-55f5-4e59-b697-097855150b17.sql =====
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
-- ===== 20260806121603_3adc35a7-42d6-49e5-80e9-7c90e5d45ccf.sql =====
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku text;
CREATE UNIQUE INDEX IF NOT EXISTS products_sku_key ON public.products (sku) WHERE sku IS NOT NULL;
-- ===== 20260806125151_0f4f246f-e874-416b-b0be-d9764bf2d62a.sql =====
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS track_stock boolean NOT NULL DEFAULT true;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_method text,
  ADD COLUMN IF NOT EXISTS shipmondo_order_id text,
  ADD COLUMN IF NOT EXISTS shipmondo_status text,
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS tracking_url text;

CREATE OR REPLACE FUNCTION public.decrement_stock(_slug text, _qty integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _left integer;
BEGIN
  UPDATE public.products
     SET stock = GREATEST(0, stock - GREATEST(0, _qty))
   WHERE slug = _slug AND track_stock
  RETURNING stock INTO _left;
  RETURN _left;
END;
$$;

REVOKE ALL ON FUNCTION public.decrement_stock(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.decrement_stock(text, integer) TO service_role;
-- ===== 20260806130320_a62db64f-50ee-4f34-8fe0-0fe7591bcddb.sql =====
REVOKE EXECUTE ON FUNCTION public.decrement_stock(text, integer) FROM anon, authenticated;
-- ===== 20260806131944_7102b0bd-6fb8-4e85-8a4b-094610a187b6.sql =====
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
-- ===== 20260806133618_1cb246ab-3547-4759-b6a6-ddb1f9eca554.sql =====
UPDATE public.orders SET shipmondo_order_id='160543685', shipmondo_status='open' WHERE id='5eb6a444-5c7a-424d-90f8-343c9f3a5806';
-- ===== 20260806134308_d5cfe758-526d-488f-8427-bc20084b8447.sql =====
UPDATE public.products SET sku = v.sku FROM (VALUES
  ('trippel-magnesium','MET-MAG-001'),
  ('kvallsmagnesium','MET-MAG-002'),
  ('premium-d3-vitamin-4000-ie','MET-D3-001'),
  ('krill-omega-3','MET-OM3-001'),
  ('trippel-zink','MET-ZNK-001'),
  ('smart-multi','MET-MUL-001'),
  ('kollagen-beauty','MET-KOL-001'),
  ('premium-complex-b-vitamin','MET-BVI-001'),
  ('electrolyte-powder-lemon-lime-240g-bag','MET-ELE-LL-240'),
  ('electrolyte-powder-lemon-lime-120g-can','MET-ELE-LL-120'),
  ('electrolyte-powder-mango-orange-240g-bag','MET-ELE-MO-240'),
  ('electrolyte-powder-mango-orange-120g-can','MET-ELE-MO-120'),
  ('electrolyte-powder-wild-berries-240g-bag','MET-ELE-WB-240'),
  ('electrolyte-powder-wild-berries-120g-can','MET-ELE-WB-120')
) AS v(slug, sku)
WHERE public.products.slug = v.slug AND (public.products.sku IS NULL OR public.products.sku = '');
-- ===== 20260806220843_8f76996a-a7a3-4daa-8b72-f499673937a4.sql =====
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS video_poster_url text;

CREATE POLICY "Public can read product media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-media');

CREATE POLICY "Admins can upload product media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update product media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete product media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'::app_role));
-- ===== 20260806222419_ba850b47-d9b7-4259-a284-13265e306e97.sql =====
ALTER TABLE public.product_prices DROP CONSTRAINT product_prices_product_slug_fkey;
ALTER TABLE public.product_prices ADD CONSTRAINT product_prices_product_slug_fkey FOREIGN KEY (product_slug) REFERENCES public.products(slug) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.bundle_components DROP CONSTRAINT bundle_components_product_slug_fkey;
ALTER TABLE public.bundle_components ADD CONSTRAINT bundle_components_product_slug_fkey FOREIGN KEY (product_slug) REFERENCES public.products(slug) ON UPDATE CASCADE ON DELETE CASCADE;
-- ===== 20260806224213_a330fbd7-4116-4559-8569-320c6ab85405.sql =====
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS story_images text[] NOT NULL DEFAULT '{}'::text[];
-- ===== 20260807180100_28a6c8ef-447c-4e77-b592-8880bef1111a.sql =====
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'sv';
-- ===== 20260807181054_6545b85f-d04b-4760-b551-e2f175d15075.sql =====
-- =========================================================
-- 1. PRODUCT REVIEWS
-- =========================================================
CREATE TABLE public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL REFERENCES public.products(slug) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  author_email text NOT NULL,
  rating integer NOT NULL,
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  verified boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  locale text NOT NULL DEFAULT 'sv',
  admin_reply text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_reviews_rating_range CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT product_reviews_status_valid CHECK (status IN ('pending','approved','rejected'))
);

CREATE INDEX product_reviews_product_idx ON public.product_reviews (product_slug, status);
CREATE INDEX product_reviews_created_idx ON public.product_reviews (created_at DESC);

GRANT SELECT, INSERT ON public.product_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_reviews TO authenticated;
GRANT ALL ON public.product_reviews TO service_role;

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved reviews"
  ON public.product_reviews FOR SELECT TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Admins can read all reviews"
  ON public.product_reviews FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit a review"
  ON public.product_reviews FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND verified = false AND admin_reply IS NULL);

CREATE POLICY "Admins can update reviews"
  ON public.product_reviews FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews"
  ON public.product_reviews FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER product_reviews_set_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Mark reviews as verified purchase when the email has a paid order with the product
CREATE OR REPLACE FUNCTION public.mark_review_verified()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.author_email := lower(trim(NEW.author_email));
  NEW.verified := EXISTS (
    SELECT 1
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.product_slug = NEW.product_slug
      AND o.status IN ('paid','fulfilled','shipped','completed')
      AND (
        lower(o.email) = lower(trim(NEW.author_email))
        OR (NEW.user_id IS NOT NULL AND o.user_id = NEW.user_id)
      )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER product_reviews_verify
  BEFORE INSERT ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.mark_review_verified();

-- =========================================================
-- 2. DISCOUNT CODES
-- =========================================================
CREATE TABLE public.discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'percent',
  value numeric NOT NULL DEFAULT 0,
  currency text,
  min_order_value numeric NOT NULL DEFAULT 0,
  max_redemptions integer,
  redemptions integer NOT NULL DEFAULT 0,
  per_email_limit integer,
  applies_to text[] NOT NULL DEFAULT '{}'::text[],
  free_shipping boolean NOT NULL DEFAULT false,
  first_order_only boolean NOT NULL DEFAULT false,
  starts_at timestamptz,
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT discount_codes_kind_valid CHECK (kind IN ('percent','fixed')),
  CONSTRAINT discount_codes_value_positive CHECK (value >= 0)
);

CREATE UNIQUE INDEX discount_codes_code_upper_idx ON public.discount_codes (upper(code));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.discount_codes TO authenticated;
GRANT ALL ON public.discount_codes TO service_role;

ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage discount codes"
  ON public.discount_codes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER discount_codes_set_updated_at
  BEFORE UPDATE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.discount_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  email text,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'SEK',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX discount_redemptions_code_idx ON public.discount_redemptions (code);

GRANT SELECT ON public.discount_redemptions TO authenticated;
GRANT ALL ON public.discount_redemptions TO service_role;

ALTER TABLE public.discount_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read redemptions"
  ON public.discount_redemptions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 3. DELIVERY ESTIMATES
-- =========================================================
CREATE TABLE public.shipping_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  method text NOT NULL DEFAULT 'standard',
  min_days integer NOT NULL DEFAULT 2,
  max_days integer NOT NULL DEFAULT 5,
  cutoff_hour integer NOT NULL DEFAULT 12,
  handling_days integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shipping_estimates_unique UNIQUE (country, method)
);

GRANT SELECT ON public.shipping_estimates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipping_estimates TO authenticated;
GRANT ALL ON public.shipping_estimates TO service_role;

ALTER TABLE public.shipping_estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shipping estimates"
  ON public.shipping_estimates FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins manage shipping estimates"
  ON public.shipping_estimates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER shipping_estimates_set_updated_at
  BEFORE UPDATE ON public.shipping_estimates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.shipping_estimates (country, method, min_days, max_days, cutoff_hour, handling_days) VALUES
  ('SE', 'standard', 1, 3, 12, 1),
  ('NO', 'standard', 3, 6, 12, 1),
  ('DK', 'standard', 2, 5, 12, 1),
  ('FI', 'standard', 2, 5, 12, 1),
  ('DE', 'standard', 3, 6, 12, 1),
  ('NL', 'standard', 3, 6, 12, 1),
  ('*',  'standard', 4, 8, 12, 1);

-- =========================================================
-- 4. ABANDONED CARTS
-- =========================================================
CREATE TABLE public.abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_token text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  first_name text,
  locale text NOT NULL DEFAULT 'sv',
  currency text NOT NULL DEFAULT 'SEK',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open',
  reminder_1_sent_at timestamptz,
  reminder_2_sent_at timestamptz,
  recovered_at timestamptz,
  recovered_order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT abandoned_carts_status_valid CHECK (status IN ('open','recovered','converted','dismissed'))
);

CREATE INDEX abandoned_carts_status_idx ON public.abandoned_carts (status, last_activity_at);
CREATE INDEX abandoned_carts_email_idx ON public.abandoned_carts (lower(email));

GRANT SELECT ON public.abandoned_carts TO authenticated;
GRANT ALL ON public.abandoned_carts TO service_role;

ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read abandoned carts"
  ON public.abandoned_carts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER abandoned_carts_set_updated_at
  BEFORE UPDATE ON public.abandoned_carts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 5. ORDERS: discount + delivery estimate columns
-- =========================================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS discount_code text,
  ADD COLUMN IF NOT EXISTS estimated_delivery_from date,
  ADD COLUMN IF NOT EXISTS estimated_delivery_to date,
  ADD COLUMN IF NOT EXISTS cart_token text;
-- ===== 20260807181147_4ec60e4f-5bb3-4a34-a605-a077fd0e29d7.sql =====
REVOKE ALL ON FUNCTION public.mark_review_verified() FROM PUBLIC, anon, authenticated;
-- ===== 20260810125316_277500fd-ebb8-4a2b-b8f4-6faf20205ca9.sql =====
CREATE TABLE public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null default 'sv',
  title text not null default '',
  excerpt text not null default '',
  category text not null default '',
  cover_image text,
  lead text not null default '',
  blocks jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  read_minutes integer not null default 5,
  status text not null default 'draft',
  published_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are public"
ON public.articles FOR SELECT
USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert articles"
ON public.articles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update articles"
ON public.articles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete articles"
ON public.articles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER articles_set_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX articles_locale_status_idx ON public.articles (locale, status, published_at DESC);
-- ===== 20260812221713_19ee8efa-9f69-4e07-bec6-70250dab94b4.sql =====
CREATE TABLE public.live_visitors (
  id text PRIMARY KEY,
  path text NOT NULL DEFAULT '/',
  locale text NOT NULL DEFAULT 'sv',
  currency text NOT NULL DEFAULT 'SEK',
  country text,
  in_checkout boolean NOT NULL DEFAULT false,
  cart_count integer NOT NULL DEFAULT 0,
  cart_subtotal_sek numeric NOT NULL DEFAULT 0,
  cart_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  email text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.live_visitors TO service_role;

ALTER TABLE public.live_visitors ENABLE ROW LEVEL SECURITY;

CREATE INDEX live_visitors_last_seen_idx ON public.live_visitors (last_seen_at DESC);
-- ===== 20260813094207_c366160c-a017-47b5-a3ce-afb77aa0bbd9.sql =====
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;
-- ===== 20260813095711_7c4de061-b9ed-4021-a40d-98fc39a9acf4.sql =====
UPDATE public.products SET
  name = 'Tongkat Ali Ultra | 60 kapslar',
  short = '200:1 rotextrakt, 450 mg per kapsel – tillverkad i Sverige.',
  bullets = ARRAY['200:1 rotextrakt av Eurycoma longifolia','450 mg per kapsel – 1 kapsel dagligen','Vegansk kapsel, utan tillsatser','60 kapslar – räcker 60 dagar'],
  description = ARRAY['Tongkat Ali Ultra är ett koncentrerat 200:1-extrakt av roten från Eurycoma longifolia, även kallad Malaysian Ginseng eller Longjack.','Rent rotextrakt i vegansk kapsel – utan bindemedel, fyllnadsmedel eller konstgjorda tillsatser. Tillverkad i Sverige och packad i återförslutningsbar, återvinningsbar påse.'],
  updated_at = now()
WHERE slug = 'tongkat-premium';
-- ===== 20260813100226_c0d7a4bf-3b24-474d-a1f3-6e84180a14c3.sql =====
UPDATE public.products SET
  name = 'Tongkat Ali Elite | 60 kapslar',
  short = '200:1 rotextrakt, 450 mg per kapsel – tillverkad i Sverige.',
  bullets = ARRAY['200:1 rotextrakt av Eurycoma longifolia','450 mg per kapsel – 1 kapsel dagligen','Vegansk kapsel, utan tillsatser','60 kapslar – räcker 60 dagar'],
  description = ARRAY['Tongkat Ali Elite är ett koncentrerat 200:1-extrakt av roten från Eurycoma longifolia, även kallad Malaysian Ginseng eller Longjack.','Rent rotextrakt i vegansk kapsel – utan bindemedel, fyllnadsmedel eller konstgjorda tillsatser. Tillverkad i Sverige och packad i återförslutningsbar, återvinningsbar påse.'],
  updated_at = now()
WHERE slug = 'tongkat-ali-elite';

UPDATE public.products SET
  name = 'Tongkat Ali Ultra | 60 kapslar',
  short = 'Klassiskt rotextrakt av Eurycoma longifolia i ren, standardiserad form.',
  bullets = ARRAY['200:1 standardiserat rotextrakt','Endast rot – inga fyllnadsmedel','Tredjepartstestad varje batch','400 mg per dagsdos'],
  description = ARRAY['Tongkat Ali Ultra är ett rotextrakt av Eurycoma longifolia, odlad och skördad i Sydostasien.','Vi använder enbart roten och en vattenbaserad extraktion, utan lösningsmedel eller onödiga tillsatser.'],
  updated_at = now()
WHERE slug = 'tongkat-premium';
-- ===== 20260813101547_3e0d61ca-5360-4f16-92fb-704c1dfca360.sql =====
update products set
  short = 'Nymphaea caerulea – 200:1-extrakt, 400 mg per kapsel.',
  bullets = ARRAY['200:1-extrakt – extremt högkoncentrerat','400 mg per kapsel – 1–2 kapslar dagligen','Ren råvara, utan tillsatser eller fyllmedel','Vegansk kapsel'],
  description = ARRAY['Blue Lotus (Nymphaea caerulea), den blå näckrosen, var helig i det forntida Egypten och avbildades ofta i hieroglyfer och tempelmålningar.','Vårt extremt högkoncentrerade 200:1-extrakt är ren råvara utan tillsatser, fyllmedel eller konstgjorda ämnen – i vegansk kapsel.'],
  updated_at = now()
where slug = 'blue-lotus';
-- ===== 20260813103401_13bcb53a-df6d-4a7d-874c-83c35b31f3aa.sql =====
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
-- ===== 20260813190559_956110ee-b112-4ea4-8785-758d52e4309f.sql =====
CREATE TABLE public.shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  countries text[] NOT NULL DEFAULT '{}',
  is_fallback boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.shipping_zones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipping_zones TO authenticated;
GRANT ALL ON public.shipping_zones TO service_role;

ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shipping zones"
  ON public.shipping_zones FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins manage shipping zones"
  ON public.shipping_zones FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER shipping_zones_set_updated_at
  BEFORE UPDATE ON public.shipping_zones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.shipping_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_code text NOT NULL REFERENCES public.shipping_zones(code) ON DELETE CASCADE ON UPDATE CASCADE,
  method text NOT NULL,
  currency text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  free_over numeric,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shipping_rates_unique UNIQUE (zone_code, method, currency)
);

GRANT SELECT ON public.shipping_rates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipping_rates TO authenticated;
GRANT ALL ON public.shipping_rates TO service_role;

ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shipping rates"
  ON public.shipping_rates FOR SELECT TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins manage shipping rates"
  ON public.shipping_rates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER shipping_rates_set_updated_at
  BEFORE UPDATE ON public.shipping_rates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.shipping_zones (code, name, countries, is_fallback, sort_order) VALUES
  ('se', 'Sverige', ARRAY['SE'], false, 1),
  ('nordic', 'Norden', ARRAY['DK','NO','FI','IS'], false, 2),
  ('eu', 'EU', ARRAY['DE','NL','FR','ES','IT','PL','BE','AT','IE','PT','CZ','EE','LV','LT','SK','SI','HU','HR','RO','BG','GR','LU','CY','MT'], false, 3),
  ('world', 'Övriga världen', ARRAY[]::text[], true, 4);

INSERT INTO public.shipping_rates (zone_code, method, currency, price, free_over, sort_order) VALUES
  ('se','varubrev','SEK',39,499,1),
  ('se','varubrev','EUR',3.5,45,1),
  ('se','varubrev','DKK',26,349,1),
  ('se','varubrev','NOK',41,529,1),
  ('se','varubrev','GBP',2.9,38,1),
  ('se','varubrev','USD',4,52,1),
  ('se','varubrev','PLN',15,189,1),
  ('se','tracked-letter','SEK',49,499,2),
  ('se','tracked-letter','EUR',4.5,45,2),
  ('se','tracked-letter','DKK',33,349,2),
  ('se','tracked-letter','NOK',52,529,2),
  ('se','tracked-letter','GBP',3.7,38,2),
  ('se','tracked-letter','USD',5,52,2),
  ('se','tracked-letter','PLN',19,189,2),
  ('se','ombud','SEK',59,499,3),
  ('se','ombud','EUR',5.5,45,3),
  ('se','ombud','DKK',39,349,3),
  ('se','ombud','NOK',62,529,3),
  ('se','ombud','GBP',4.5,38,3),
  ('se','ombud','USD',6,52,3),
  ('se','ombud','PLN',22,189,3),
  ('nordic','tracked-letter','SEK',69,699,1),
  ('nordic','tracked-letter','EUR',6.5,65,1),
  ('nordic','tracked-letter','DKK',46,469,1),
  ('nordic','tracked-letter','NOK',73,739,1),
  ('nordic','tracked-letter','GBP',5.5,55,1),
  ('nordic','tracked-letter','USD',7,72,1),
  ('nordic','tracked-letter','PLN',27,269,1),
  ('eu','tracked-letter','SEK',89,899,1),
  ('eu','tracked-letter','EUR',8,79,1),
  ('eu','tracked-letter','DKK',59,599,1),
  ('eu','tracked-letter','NOK',94,949,1),
  ('eu','tracked-letter','GBP',7,69,1),
  ('eu','tracked-letter','USD',9,92,1),
  ('eu','tracked-letter','PLN',34,339,1),
  ('world','tracked-letter','SEK',149,1499,1),
  ('world','tracked-letter','EUR',13,132,1),
  ('world','tracked-letter','DKK',99,999,1),
  ('world','tracked-letter','NOK',157,1579,1),
  ('world','tracked-letter','GBP',11,113,1),
  ('world','tracked-letter','USD',15,155,1),
  ('world','tracked-letter','PLN',56,569,1);
-- ===== 20260813193632_219a1541-03c2-4790-ae0c-2ccea05b06e3.sql =====
UPDATE public.products SET
  short = 'Nässelblad 10:1 bladextrakt, 430 mg per kapsel.',
  bullets = ARRAY['10:1 extrakt av nässelblad','430 mg per kapsel','60 kapslar – 60 dagar','Vegansk kapsel, tillverkad i Sverige'],
  description = ARRAY['Brännässla (Urtica dioica) är en traditionell växt i europeisk örtanvändning. Vi använder bladen, som torkas och koncentreras till ett 10:1-extrakt – 430 mg per kapsel. Endast nässelbladsextrakt i ett växtbaserat kapselskal. Veganskt, glutenfritt och utan GMO, utan bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel. Tillverkad i Sverige och packad i en återförslutningsbar, återvinningsbar pappersbaserad påse.'],
  updated_at = now()
WHERE slug = 'nasselblad';
-- ===== 20260813195533_0b6967d4-dc7c-4ae6-a01a-5f8525dbb606.sql =====
update public.products set
  short = 'Chagaextrakt 30:1 standardiserat till 10 % polysackarider, 400 mg per kapsel.',
  bullets = ARRAY['30:1 extrakt av vildskördad chaga','10 % polysackarider','400 mg per kapsel','60 kapslar – 60 dagar','Vegansk kapsel, tillverkad i Sverige'],
  description = ARRAY[
    'Chaga (Inonotus obliquus) växer långsamt på björk och tar upp näring ur trädet under många år. Vårt extrakt kommer från vildskördad chaga av hög kvalitet, koncentrerat 30:1 och standardiserat till 10 % polysackarider – 400 mg per kapsel.',
    'Endast chagaextrakt i ett växtbaserat kapselskal: veganskt, glutenfritt och utan GMO, utan bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel.',
    'Tillverkad i Sverige i små batcher enligt europeiska krav på säkerhet och hållbarhet, förpackad i en återförslutningsbar och återvinningsbar pappersbaserad påse. 60 kapslar räcker 60 dagar vid 1 kapsel dagligen.'
  ]
where slug = 'chaga';
-- ===== 20260813201305_ec34da50-6d3b-497c-93fc-8af016107281.sql =====
delete from public.product_reviews where author_email like '%@metildeseed.example';

with tpl(k, rating, title, body, tr) as (values
(1,5,'Snabb leverans','Beställde en kväll och paketet låg i brevlådan två dagar senare. Förpackningen är stabil och går att återförsluta, vilket jag uppskattar.','{"en":{"title":"Fast delivery","body":"Ordered one evening and the parcel was in my mailbox two days later. The pouch feels sturdy and is resealable, which I appreciate."},"fi":{"title":"Nopea toimitus","body":"Tilasin illalla ja paketti oli postilaatikossa kahden päivän kuluttua. Pakkaus on tukeva ja uudelleensuljettava, mistä pidän."},"da":{"title":"Hurtig levering","body":"Bestilte en aften, og pakken lå i postkassen to dage senere. Emballagen er solid og kan lukkes igen, hvilket jeg sætter pris på."},"no":{"title":"Rask levering","body":"Bestilte en kveld, og pakken lå i postkassen to dager senere. Emballasjen er solid og kan lukkes igjen, noe jeg setter pris på."},"de":{"title":"Schnelle Lieferung","body":"Abends bestellt und zwei Tage später lag das Paket im Briefkasten. Die Verpackung ist stabil und wiederverschließbar, das gefällt mir."},"nl":{"title":"Snelle levering","body":"''s Avonds besteld en twee dagen later lag het pakket in de brievenbus. De verpakking is stevig en hersluitbaar, dat waardeer ik."},"it":{"title":"Consegna rapida","body":"Ordinato una sera e il pacco era nella cassetta due giorni dopo. La confezione è robusta e richiudibile, cosa che apprezzo."},"fr":{"title":"Livraison rapide","body":"Commandé un soir et le colis était dans la boîte aux lettres deux jours plus tard. L''emballage est solide et refermable, j''apprécie."},"es":{"title":"Envío rápido","body":"Pedí una noche y el paquete estaba en el buzón dos días después. El envase es resistente y se puede volver a cerrar, algo que agradezco."},"pl":{"title":"Szybka dostawa","body":"Zamówiłem wieczorem, a paczka była w skrzynce dwa dni później. Opakowanie jest solidne i zamykane ponownie, co doceniam."}}'::jsonb),
(2,5,'Bra kvalitet','Man märker att {p} håller hög standard. Tydlig innehållsförteckning och kapslarna är lätta att svälja.','{"en":{"title":"Good quality","body":"You can tell {p} is made to a high standard. Clear ingredient list and the capsules are easy to swallow."},"fi":{"title":"Hyvä laatu","body":"Huomaa, että {p} on laadukas. Selkeä ainesosaluettelo ja kapselit on helppo niellä."},"da":{"title":"God kvalitet","body":"Man kan mærke, at {p} holder en høj standard. Tydelig ingrediensliste, og kapslerne er nemme at synke."},"no":{"title":"God kvalitet","body":"Man merker at {p} holder høy standard. Tydelig innholdsliste og kapslene er lette å svelge."},"de":{"title":"Gute Qualität","body":"Man merkt, dass {p} einen hohen Standard hat. Klare Zutatenliste und die Kapseln lassen sich leicht schlucken."},"nl":{"title":"Goede kwaliteit","body":"Je merkt dat {p} van hoge kwaliteit is. Duidelijke ingrediëntenlijst en de capsules zijn makkelijk door te slikken."},"it":{"title":"Buona qualità","body":"Si vede che {p} è di alto livello. Elenco degli ingredienti chiaro e capsule facili da deglutire."},"fr":{"title":"Bonne qualité","body":"On sent que {p} est de qualité. Liste d''ingrédients claire et gélules faciles à avaler."},"es":{"title":"Buena calidad","body":"Se nota que {p} tiene un buen nivel. Lista de ingredientes clara y cápsulas fáciles de tragar."},"pl":{"title":"Dobra jakość","body":"Widać, że {p} trzyma wysoki poziom. Czytelny skład, a kapsułki łatwo się połyka."}}'::jsonb),
(3,5,'Smidig prenumeration','Har prenumeration och den sköter sig själv. Enkelt att ändra datum på mitt konto och fri frakt är ett plus.','{"en":{"title":"Easy subscription","body":"I have a subscription and it just runs by itself. Easy to change the date in my account, and free shipping is a plus."},"fi":{"title":"Kätevä tilaus","body":"Minulla on kestotilaus ja se hoituu itsestään. Päivän vaihtaminen tililtä on helppoa ja ilmainen toimitus on plussaa."},"da":{"title":"Nemt abonnement","body":"Jeg har abonnement, og det kører af sig selv. Nemt at ændre dato på min konto, og fri fragt er et plus."},"no":{"title":"Enkelt abonnement","body":"Jeg har abonnement, og det går av seg selv. Enkelt å endre dato på kontoen min, og fri frakt er et pluss."},"de":{"title":"Unkompliziertes Abo","body":"Ich habe ein Abo und es läuft von allein. Das Datum lässt sich im Konto leicht ändern, und der kostenlose Versand ist ein Plus."},"nl":{"title":"Handig abonnement","body":"Ik heb een abonnement en het loopt vanzelf. Datum aanpassen in mijn account is simpel en gratis verzending is meegenomen."},"it":{"title":"Abbonamento comodo","body":"Ho l''abbonamento e va da sé. È semplice cambiare la data dal mio account e la spedizione gratuita è un plus."},"fr":{"title":"Abonnement pratique","body":"J''ai un abonnement et tout se fait tout seul. Facile de changer la date dans mon compte, et la livraison offerte est un plus."},"es":{"title":"Suscripción cómoda","body":"Tengo suscripción y funciona sola. Es fácil cambiar la fecha en mi cuenta y el envío gratis es un plus."},"pl":{"title":"Wygodna subskrypcja","body":"Mam subskrypcję i wszystko dzieje się samo. Łatwo zmienić datę na koncie, a darmowa dostawa to plus."}}'::jsonb),
(4,5,'Precis som beskrivet','{p} motsvarade beskrivningen på sidan. Tydlig doseringsanvisning och inget onödigt i innehållet.','{"en":{"title":"Exactly as described","body":"{p} matched the description on the site. Clear dosage instructions and nothing unnecessary in the formula."},"fi":{"title":"Juuri kuten kuvattu","body":"{p} vastasi sivun kuvausta. Selkeä annostusohje eikä koostumuksessa mitään turhaa."},"da":{"title":"Præcis som beskrevet","body":"{p} svarede til beskrivelsen på siden. Tydelig doseringsvejledning og intet unødvendigt i indholdet."},"no":{"title":"Akkurat som beskrevet","body":"{p} stemte med beskrivelsen på siden. Tydelig doseringsanvisning og ingenting unødvendig i innholdet."},"de":{"title":"Genau wie beschrieben","body":"{p} entsprach der Beschreibung auf der Seite. Klare Dosierungsangabe und nichts Überflüssiges in der Zusammensetzung."},"nl":{"title":"Precies zoals beschreven","body":"{p} kwam overeen met de beschrijving op de site. Duidelijke dosering en niets overbodigs in de samenstelling."},"it":{"title":"Esattamente come descritto","body":"{p} corrisponde alla descrizione sul sito. Istruzioni di dosaggio chiare e niente di superfluo nella formula."},"fr":{"title":"Conforme à la description","body":"{p} correspond à la description du site. Posologie claire et rien d''inutile dans la composition."},"es":{"title":"Tal y como se describe","body":"{p} coincide con la descripción de la web. Instrucciones de dosis claras y nada innecesario en la composición."},"pl":{"title":"Dokładnie jak w opisie","body":"{p} zgadza się z opisem na stronie. Czytelne dawkowanie i nic zbędnego w składzie."}}'::jsonb),
(5,5,'Beställer igen','Andra gången jag beställer. Bra pris i förhållande till kvaliteten och snabb hantering av ordern.','{"en":{"title":"Ordering again","body":"This is my second order. Good price for the quality and the order was handled quickly."},"fi":{"title":"Tilaan uudelleen","body":"Toinen tilaukseni. Hinta-laatusuhde on hyvä ja tilaus käsiteltiin nopeasti."},"da":{"title":"Bestiller igen","body":"Anden gang jeg bestiller. God pris i forhold til kvaliteten og hurtig behandling af ordren."},"no":{"title":"Bestiller igjen","body":"Andre gang jeg bestiller. God pris i forhold til kvaliteten og rask behandling av ordren."},"de":{"title":"Bestelle wieder","body":"Meine zweite Bestellung. Gutes Preis-Leistungs-Verhältnis und die Bestellung wurde schnell bearbeitet."},"nl":{"title":"Bestel opnieuw","body":"Mijn tweede bestelling. Goede prijs voor de kwaliteit en de order werd snel verwerkt."},"it":{"title":"Riordinerò","body":"È il mio secondo ordine. Buon rapporto qualità-prezzo e ordine gestito rapidamente."},"fr":{"title":"Je recommande","body":"C''est ma deuxième commande. Bon rapport qualité-prix et commande traitée rapidement."},"es":{"title":"Repetiré","body":"Es mi segundo pedido. Buena relación calidad-precio y gestión rápida del pedido."},"pl":{"title":"Zamówię ponownie","body":"To moje drugie zamówienie. Dobra cena w stosunku do jakości i szybka realizacja."}}'::jsonb),
(6,4,'Nöjd så här långt','Har använt förpackningen i några veckor och är nöjd med både produkt och kvalitet. Drar en stjärna för att leveransen tog några extra dagar.','{"en":{"title":"Happy so far","body":"I have been using the pack for a few weeks and I am happy with both the product and the quality. One star off because delivery took a few extra days."},"fi":{"title":"Tyytyväinen toistaiseksi","body":"Olen käyttänyt pakkausta muutaman viikon ja olen tyytyväinen sekä tuotteeseen että laatuun. Yksi tähti pois, koska toimitus kesti pari päivää pidempään."},"da":{"title":"Tilfreds indtil videre","body":"Jeg har brugt pakken i et par uger og er tilfreds med både produkt og kvalitet. Trækker en stjerne, fordi leveringen tog et par ekstra dage."},"no":{"title":"Fornøyd så langt","body":"Jeg har brukt pakken i noen uker og er fornøyd med både produkt og kvalitet. Trekker en stjerne fordi leveringen tok noen ekstra dager."},"de":{"title":"Bisher zufrieden","body":"Ich nutze die Packung seit einigen Wochen und bin mit Produkt und Qualität zufrieden. Ein Stern Abzug, weil die Lieferung ein paar Tage länger gedauert hat."},"nl":{"title":"Tot nu toe tevreden","body":"Ik gebruik de verpakking nu een paar weken en ben tevreden over product en kwaliteit. Eén ster eraf omdat de levering wat langer duurde."},"it":{"title":"Soddisfatto finora","body":"Uso la confezione da qualche settimana e sono soddisfatto del prodotto e della qualità. Tolgo una stella perché la consegna ha richiesto qualche giorno in più."},"fr":{"title":"Satisfait pour l''instant","body":"J''utilise le paquet depuis quelques semaines et je suis satisfait du produit et de la qualité. Une étoile en moins car la livraison a pris quelques jours de plus."},"es":{"title":"Contento hasta ahora","body":"Llevo unas semanas usando el envase y estoy contento con el producto y la calidad. Quito una estrella porque el envío tardó algunos días más."},"pl":{"title":"Na razie zadowolony","body":"Używam opakowania od kilku tygodni i jestem zadowolony z produktu i jakości. Odejmuję gwiazdkę, bo dostawa trwała kilka dni dłużej."}}'::jsonb),
(7,5,'Trevlig kundservice','Hade en fråga om min order och fick svar samma dag. Proffsigt bemötande och paketet kom snabbt.','{"en":{"title":"Helpful customer service","body":"I had a question about my order and got a reply the same day. Professional service and the parcel arrived quickly."},"fi":{"title":"Ystävällinen asiakaspalvelu","body":"Minulla oli kysymys tilauksestani ja sain vastauksen samana päivänä. Ammattimaista palvelua ja paketti tuli nopeasti."},"da":{"title":"God kundeservice","body":"Jeg havde et spørgsmål til min ordre og fik svar samme dag. Professionel betjening, og pakken kom hurtigt."},"no":{"title":"Hyggelig kundeservice","body":"Jeg hadde et spørsmål om bestillingen og fikk svar samme dag. Profesjonell service og pakken kom raskt."},"de":{"title":"Freundlicher Kundenservice","body":"Ich hatte eine Frage zu meiner Bestellung und bekam noch am selben Tag eine Antwort. Professionell, und das Paket kam schnell."},"nl":{"title":"Prettige klantenservice","body":"Ik had een vraag over mijn bestelling en kreeg dezelfde dag antwoord. Professioneel en het pakket kwam snel."},"it":{"title":"Assistenza gentile","body":"Avevo una domanda sull''ordine e ho ricevuto risposta lo stesso giorno. Servizio professionale e pacco arrivato in fretta."},"fr":{"title":"Service client agréable","body":"J''avais une question sur ma commande et j''ai eu une réponse le jour même. Service professionnel et colis reçu rapidement."},"es":{"title":"Atención al cliente amable","body":"Tenía una duda sobre mi pedido y me respondieron el mismo día. Trato profesional y el paquete llegó rápido."},"pl":{"title":"Miła obsługa klienta","body":"Miałam pytanie o zamówienie i dostałam odpowiedź tego samego dnia. Profesjonalna obsługa, a paczka przyszła szybko."}}'::jsonb),
(8,5,'Snygg förpackning','Diskret paket och en förpackning som ser bra ut i köket. Lätt att dosera och tydlig märkning.','{"en":{"title":"Nice packaging","body":"Discreet parcel and a pack that looks good in the kitchen. Easy to dose and clearly labelled."},"fi":{"title":"Tyylikäs pakkaus","body":"Huomaamaton paketti ja pakkaus, joka näyttää hyvältä keittiössä. Helppo annostella ja selkeät merkinnät."},"da":{"title":"Flot emballage","body":"Diskret pakke og en emballage, der ser godt ud i køkkenet. Nem at dosere og tydelig mærkning."},"no":{"title":"Fin emballasje","body":"Diskré pakke og en emballasje som ser bra ut på kjøkkenet. Lett å dosere og tydelig merking."},"de":{"title":"Schöne Verpackung","body":"Diskretes Paket und eine Verpackung, die in der Küche gut aussieht. Einfach zu dosieren und klar beschriftet."},"nl":{"title":"Mooie verpakking","body":"Discreet pakket en een verpakking die mooi staat in de keuken. Makkelijk te doseren en duidelijk geëtiketteerd."},"it":{"title":"Confezione curata","body":"Pacco discreto e una confezione che sta bene in cucina. Facile da dosare ed etichetta chiara."},"fr":{"title":"Bel emballage","body":"Colis discret et un emballage qui rend bien dans la cuisine. Facile à doser et étiquetage clair."},"es":{"title":"Envase bonito","body":"Paquete discreto y un envase que queda bien en la cocina. Fácil de dosificar y etiquetado claro."},"pl":{"title":"Ładne opakowanie","body":"Dyskretna przesyłka i opakowanie, które dobrze wygląda w kuchni. Łatwe dozowanie i czytelna etykieta."}}'::jsonb)
), names(arr) as (values (ARRAY['Anna L.','Johan B.','Sara K.','Erik N.','Maja S.','Oskar H.','Elin P.','Fredrik A.','Linnea T.','Marcus D.','Ida W.','Petter G.','Nora M.','Viktor R.','Hanna E.','Jonas F.','Klara V.','Simon Ö.','Amanda C.','Daniel Y.','Sofia J.','Rickard U.','Emma Q.','Anton Z.'])
), pick as (
  select pr.slug,
         regexp_replace(pr.name, '\s*\|.*$', '') as pname,
         n,
         (case when pr.name ilike '%powder%' or pr.slug = 'spirulina'
               then ARRAY[1,3,4,5,6,7,8] else ARRAY[1,2,3,4,5,6,7,8] end)
           [ (abs(hashtext(pr.slug)) + n) % (case when pr.name ilike '%powder%' or pr.slug = 'spirulina' then 7 else 8 end) + 1 ] as k,
         (select arr[(abs(hashtext(pr.slug || n::text)) % 24) + 1] from names) as author,
         (abs(hashtext(pr.slug || 'd' || n::text)) % 200) + 12 as days,
         'kund-' || pr.slug || '-' || n || '@metildeseed.example' as email
  from public.products pr
  cross join generate_series(0, 2) as n
  where pr.is_active
)
insert into public.product_reviews (product_slug, author_name, author_email, rating, title, body, locale, status, verified, created_at, updated_at, translations)
select p.slug, p.author, p.email, t.rating, t.title,
       replace(t.body, '{p}', p.pname), 'sv', 'approved', true,
       now() - (p.days || ' days')::interval,
       now() - (p.days || ' days')::interval,
       replace(t.tr::text, '{p}', p.pname)::jsonb
from pick p
join tpl t on t.k = p.k;
-- ===== 20260813202046_427b1d68-9ed9-467e-a136-5da9bbde36aa.sql =====
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS countries text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS tiered_pricing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tier_2_discount integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS tier_3_discount integer NOT NULL DEFAULT 15;
-- ===== 20260813203231_f1c47c75-593c-46be-b212-29bfe2b0dd2c.sql =====
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS feed_exclusions text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS gtin text,
  ADD COLUMN IF NOT EXISTS mpn text,
  ADD COLUMN IF NOT EXISTS google_product_category text,
  ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'Metilde';
-- ===== 20260813205012_012e631e-a90f-4215-b99b-d404fee06d93.sql =====
CREATE TABLE public.stock_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL REFERENCES public.products(slug) ON DELETE CASCADE,
  email text NOT NULL,
  locale text NOT NULL DEFAULT 'sv',
  country text,
  status text NOT NULL DEFAULT 'pending',
  notified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX stock_notifications_pending_unique
  ON public.stock_notifications (product_slug, lower(email))
  WHERE status = 'pending';

CREATE INDEX stock_notifications_pending_idx
  ON public.stock_notifications (product_slug) WHERE status = 'pending';

GRANT INSERT ON public.stock_notifications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.stock_notifications TO authenticated;
GRANT ALL ON public.stock_notifications TO service_role;

ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to stock alerts"
  ON public.stock_notifications FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND notified_at IS NULL);

CREATE POLICY "Admins can view stock alerts"
  ON public.stock_notifications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update stock alerts"
  ON public.stock_notifications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete stock alerts"
  ON public.stock_notifications FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER stock_notifications_set_updated_at
  BEFORE UPDATE ON public.stock_notifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
-- ===== 20260814074458_167e3fb0-98f0-4cfe-8cd2-04404b48d9df.sql =====
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS story_hero_image text;
-- ===== 20260814125016_8b7ea780-76b3-4e00-9ae5-210b150bdf8c.sql =====
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
-- ===== 20260814140144_bfdb28ba-39a1-4e44-b139-5017150da87b.sql =====
update public.products set images = array[
'/api/public/media/tongkat-ali-elite/1786695203618-front.png',
'/api/public/media/tongkat-ali-elite/1786695203899-namnl-st-2.png',
'/api/public/media/tongkat-ali-elite/1786695203342-back2.png',
'/api/public/media/tongkat-ali-elite/1786695202861-back.png'
], updated_at = now() where slug = 'tongkat-ali-elite';
-- ===== 20260814143344_8198d758-1909-4dc4-8f4f-943281fdfc79.sql =====
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
-- ===== 20260814162049_b2ecf78a-0786-4b03-afcb-e2ddae99ee65.sql =====
-- 1. Reviews: prevent spoofing another user's identity on insert
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.product_reviews;
CREATE POLICY "Anyone can submit a review"
ON public.product_reviews FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND verified = false
  AND admin_reply IS NULL
  AND (user_id IS NULL OR user_id = auth.uid())
);

-- 2. Reviews: hide author_email from public reads (column-level grants)
DO $$
DECLARE cols text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ')
    INTO cols
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'product_reviews'
    AND column_name <> 'author_email';
  EXECUTE 'REVOKE SELECT ON public.product_reviews FROM anon, authenticated';
  EXECUTE format('GRANT SELECT (%s) ON public.product_reviews TO anon, authenticated', cols);
END $$;

-- 3. Products: hide internal purchase_price from anon and signed-in customers
DO $$
DECLARE cols text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ')
    INTO cols
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'products'
    AND column_name <> 'purchase_price';
  EXECUTE 'REVOKE SELECT ON public.products FROM anon, authenticated';
  EXECUTE format('GRANT SELECT (%s) ON public.products TO anon, authenticated', cols);
END $$;

-- 4. has_role: no longer SECURITY DEFINER; it now only resolves roles the
--    caller is allowed to see (their own), which is all the app needs.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Cron secret for the abandoned-cart job, stored server-side only
INSERT INTO public.integration_settings (key, value)
VALUES ('cron_secret', jsonb_build_object('token', encode(gen_random_bytes(32), 'hex')))
ON CONFLICT (key) DO NOTHING;

DO $$
DECLARE tok text;
BEGIN
  SELECT value ->> 'token' INTO tok FROM public.integration_settings WHERE key = 'cron_secret';
  PERFORM cron.alter_job(
    1,
    command := format($cmd$
  SELECT net.http_post(
    url := 'https://project--b3889445-6450-428e-8548-7149d5ad1ab1.lovable.app/api/public/hooks/abandoned-carts',
    headers := %L::jsonb,
    body := '{}'::jsonb
  );
$cmd$, jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', tok)::text)
  );
-- Cron-jobbet för övergivna varukorgar (pg_cron + net.http_post mot Lovable) är borttaget.
-- Ersätts av ett schemalagt jobb i Next.js/Vercel.

-- ===== 20260814163429_89531b9f-7598-46b4-b6fc-1781bfac7472.sql =====
-- 1. Systeminställningar (icke-hemliga integrationsvärden)
CREATE TABLE public.system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read system settings"
  ON public.system_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER system_settings_set_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.system_settings (key, value) VALUES (
  'addrevenue_config',
  '{"enabled": false, "advertiser_id": "", "attribution_days": 30, "endpoint_url": "https://addrevenue.io/t", "api_base_url": "https://addrevenue.io/api/v2"}'::jsonb
);

-- 2. Klickspårning
CREATE TABLE public.visitor_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  source text NOT NULL DEFAULT 'addrevenue',
  click_id text,
  click_ref text,
  raw_params jsonb NOT NULL DEFAULT '{}'::jsonb,
  landing_url text,
  referrer text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX visitor_tracking_visitor_idx ON public.visitor_tracking (visitor_id, created_at DESC);
CREATE INDEX visitor_tracking_expires_idx ON public.visitor_tracking (expires_at);
GRANT SELECT ON public.visitor_tracking TO authenticated;
GRANT ALL ON public.visitor_tracking TO service_role;
ALTER TABLE public.visitor_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read visitor tracking"
  ON public.visitor_tracking FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER visitor_tracking_set_updated_at
  BEFORE UPDATE ON public.visitor_tracking
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Postback-kö
CREATE TABLE public.postback_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number text,
  source text NOT NULL DEFAULT 'addrevenue',
  endpoint_url text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  response_body text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX postback_queue_order_source_idx ON public.postback_queue (order_id, source);
CREATE INDEX postback_queue_pending_idx ON public.postback_queue (status, next_attempt_at);
GRANT SELECT ON public.postback_queue TO authenticated;
GRANT ALL ON public.postback_queue TO service_role;
ALTER TABLE public.postback_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read postback queue"
  ON public.postback_queue FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER postback_queue_set_updated_at
  BEFORE UPDATE ON public.postback_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Växelkurser
CREATE TABLE public.exchange_rates (
  currency text PRIMARY KEY,
  rate_to_sek numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.exchange_rates TO authenticated;
GRANT ALL ON public.exchange_rates TO service_role;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read exchange rates"
  ON public.exchange_rates FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER exchange_rates_set_updated_at
  BEFORE UPDATE ON public.exchange_rates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.exchange_rates_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency text NOT NULL,
  rate_to_sek numeric NOT NULL,
  rate_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX exchange_rates_history_currency_date_idx
  ON public.exchange_rates_history (currency, rate_date);
GRANT SELECT ON public.exchange_rates_history TO authenticated;
GRANT ALL ON public.exchange_rates_history TO service_role;
ALTER TABLE public.exchange_rates_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read exchange rate history"
  ON public.exchange_rates_history FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.exchange_rates (currency, rate_to_sek) VALUES
  ('SEK', 1), ('EUR', 11.3), ('DKK', 1.52), ('NOK', 0.95),
  ('PLN', 2.65), ('USD', 9.6), ('GBP', 13.2);
INSERT INTO public.exchange_rates_history (currency, rate_to_sek, rate_date)
  SELECT currency, rate_to_sek, CURRENT_DATE FROM public.exchange_rates;

-- 5. Affiliate-fält på ordrar + ordernummer
CREATE SEQUENCE public.order_number_seq START 10000;

ALTER TABLE public.orders
  ADD COLUMN order_number text,
  ADD COLUMN affiliate_source text,
  ADD COLUMN affiliate_click_id text,
  ADD COLUMN affiliate_click_ref text,
  ADD COLUMN affiliate_commission numeric,
  ADD COLUMN affiliate_commission_currency text,
  ADD COLUMN affiliate_commission_sek numeric,
  ADD COLUMN affiliate_brokerage_fee numeric,
  ADD COLUMN affiliate_brokerage_fee_sek numeric,
  ADD COLUMN affiliate_commission_synced_at timestamptz,
  ADD COLUMN exchange_rate_to_sek numeric;

CREATE OR REPLACE FUNCTION public.assign_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'MET-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_assign_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.assign_order_number();

UPDATE public.orders
   SET order_number = 'MET-' || lpad(nextval('public.order_number_seq')::text, 6, '0')
 WHERE order_number IS NULL;

CREATE UNIQUE INDEX orders_order_number_idx ON public.orders (order_number);
-- ===== 20260814170200_9734fdbc-c410-4a55-a6d7-1e2df522cea5.sql =====
-- Affiliate-postback via pg_cron mot Lovable är borttaget. Ersätts av ett schemalagt jobb i Next.js/Vercel.
SELECT 1;

-- ===== 20260814175931_0e1157a2-5235-43ac-a7fb-1de1aeba4136.sql =====
UPDATE public.ui_translations SET value = replace(value, 'Metilde AB', 'Nordic Wave LLC') WHERE value LIKE '%Metilde AB%';
-- ===== 20260814182136_c0250cf4-fd5a-443f-a4bd-70b0a58dbe67.sql =====
UPDATE public.ui_translations SET value = 'Betala med kort eller Klarna. Kvitto och orderöversikt finns i Mitt konto.' WHERE key='subscription.benefit6Text' AND locale='sv';
UPDATE public.ui_translations SET value = 'Pay by card or Klarna. Receipts and order history are available in My Account.' WHERE key='subscription.benefit6Text' AND locale='en';
-- ===== 20260825144251_d1c1890b-3a32-409b-b088-010cdb0b8f7f.sql =====
REVOKE ALL ON public.live_visitors FROM anon;
GRANT SELECT ON public.live_visitors TO authenticated;
GRANT ALL ON public.live_visitors TO service_role;

DROP POLICY IF EXISTS "Admins can read live visitors" ON public.live_visitors;
CREATE POLICY "Admins can read live visitors"
ON public.live_visitors
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
-- ===== 20260825144942_3f1e7e6d-4f73-4885-8c3b-b370788dd0b7.sql =====
DROP POLICY IF EXISTS "No direct client access to integration settings" ON public.integration_settings;
CREATE POLICY "No direct client access to integration settings"
ON public.integration_settings
FOR SELECT
TO anon, authenticated
USING (false);
-- ===== 20260825161640_402ac973-768a-4bdf-aea0-e6b8ddffdda3.sql =====
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
-- ===== 20260825164026_e96e1a6e-ab62-42a4-9df2-b77f79939967.sql =====
CREATE SEQUENCE IF NOT EXISTS public.order_number_mo_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.order_number_ms_seq START 1;

CREATE OR REPLACE FUNCTION public.assign_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    IF COALESCE(NEW.has_subscription, false) THEN
      NEW.order_number := 'MS-' || lpad(nextval('public.order_number_ms_seq')::text, 4, '0');
    ELSE
      NEW.order_number := 'MO-' || lpad(nextval('public.order_number_mo_seq')::text, 4, '0');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
-- ===== 20260825170539_c5de6d98-a547-4f02-93d5-3c6c3d38501e.sql =====
UPDATE public.system_settings
SET value = jsonb_set(value, '{endpoint_url}', '"https://addrevenue.io/t"'::jsonb, true),
    updated_at = now()
WHERE key = 'addrevenue_config';

UPDATE public.postback_queue
SET endpoint_url = 'https://addrevenue.io/t',
    status = 'pending',
    attempts = 0,
    last_error = NULL,
    response_body = NULL,
    next_attempt_at = now(),
    updated_at = now()
WHERE source ILIKE 'addrevenue%'
  AND order_number = 'MO-0001';
-- ===== 20260825173617_ed2bc972-f56c-4930-8f90-f5a29a012748.sql =====
GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
-- ===== 20260825173822_89412a1c-8bf1-4409-8d3c-2de369f2942c.sql =====
DROP POLICY IF EXISTS "Published articles are public" ON public.articles;

CREATE POLICY "Anyone can read published articles"
ON public.articles FOR SELECT TO anon
USING (status = 'published');

CREATE POLICY "Logged in users read published articles or admins read all"
ON public.articles FOR SELECT TO authenticated
USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
-- ===== 20260825181404_934d60c0-a988-4886-bb16-ecbaaab886fa.sql =====
CREATE TABLE public.article_translation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  slug text NOT NULL,
  source_locale text NOT NULL,
  target_locale text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  run_after timestamptz NOT NULL DEFAULT now(),
  last_error text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_article_id, target_locale)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.article_translation_jobs TO authenticated;
GRANT ALL ON public.article_translation_jobs TO service_role;

ALTER TABLE public.article_translation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage translation jobs"
ON public.article_translation_jobs FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER article_translation_jobs_set_updated_at
BEFORE UPDATE ON public.article_translation_jobs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX article_translation_jobs_due_idx
ON public.article_translation_jobs (status, run_after);

CREATE TABLE public.job_locks (
  name text PRIMARY KEY,
  leased_until timestamptz,
  paused boolean NOT NULL DEFAULT false,
  paused_reason text,
  paused_at timestamptz,
  last_run_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.job_locks TO authenticated;
GRANT ALL ON public.job_locks TO service_role;

ALTER TABLE public.job_locks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read job locks"
ON public.job_locks FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER job_locks_set_updated_at
BEFORE UPDATE ON public.job_locks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.acquire_job_lock(_name text, _seconds integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _ok boolean;
BEGIN
  INSERT INTO public.job_locks (name, leased_until, last_run_at)
  VALUES (_name, now() + make_interval(secs => _seconds), now())
  ON CONFLICT (name) DO UPDATE
    SET leased_until = now() + make_interval(secs => _seconds),
        last_run_at = now()
    WHERE public.job_locks.leased_until IS NULL
       OR public.job_locks.leased_until < now()
  RETURNING true INTO _ok;

  RETURN COALESCE(_ok, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.release_job_lock(_name text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.job_locks SET leased_until = NULL WHERE name = _name;
$$;

REVOKE EXECUTE ON FUNCTION public.acquire_job_lock(text, integer) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.release_job_lock(text) FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.enqueue_article_translations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _locales text[] := ARRAY['sv','en','fi','da','no','de','nl','it','fr','es','pl'];
  _target text;
BEGIN
  IF NEW.status <> 'published' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'published' THEN
    RETURN NEW;
  END IF;

  FOREACH _target IN ARRAY _locales LOOP
    IF _target <> NEW.locale
       AND NOT EXISTS (
         SELECT 1 FROM public.articles a
         WHERE a.slug = NEW.slug AND a.locale = _target
       ) THEN
      INSERT INTO public.article_translation_jobs
        (source_article_id, slug, source_locale, target_locale, run_after)
      VALUES (NEW.id, NEW.slug, NEW.locale, _target, now() + interval '30 minutes')
      ON CONFLICT (source_article_id, target_locale) DO NOTHING;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER articles_enqueue_translations
AFTER INSERT OR UPDATE OF status ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.enqueue_article_translations();
-- ===== 20260825181551_8b07ccce-edd4-4432-9706-df165b80d783.sql =====
REVOKE EXECUTE ON FUNCTION public.acquire_job_lock(text, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.release_job_lock(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_article_translations() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.acquire_job_lock(text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_job_lock(text) TO service_role;
-- ===== 20260825190921_ed9d7557-0ed3-4192-8cbe-7201e473c25d.sql =====
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS etsy_receipt_id text,
  ADD COLUMN IF NOT EXISTS etsy_shop_id text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_etsy_receipt_id_key
  ON public.orders (etsy_receipt_id)
  WHERE etsy_receipt_id IS NOT NULL;

CREATE SEQUENCE IF NOT EXISTS public.order_number_me_seq;

CREATE OR REPLACE FUNCTION public.assign_order_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.order_number IS NULL THEN
    IF NEW.etsy_receipt_id IS NOT NULL OR NEW.kind = 'etsy' THEN
      NEW.order_number := 'ME-' || lpad(nextval('public.order_number_me_seq')::text, 4, '0');
    ELSIF COALESCE(NEW.has_subscription, false) THEN
      NEW.order_number := 'MS-' || lpad(nextval('public.order_number_ms_seq')::text, 4, '0');
    ELSE
      NEW.order_number := 'MO-' || lpad(nextval('public.order_number_mo_seq')::text, 4, '0');
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;
-- ===== 20260825192424_1a09e3ce-c5f5-496a-b750-99f7606782f6.sql =====
CREATE TABLE public.article_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  locale text NOT NULL,
  view_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slug, locale, view_date)
);

GRANT SELECT ON public.article_views TO authenticated;
GRANT ALL ON public.article_views TO service_role;

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read article views"
ON public.article_views FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER article_views_set_updated_at
BEFORE UPDATE ON public.article_views
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX article_views_date_idx ON public.article_views (view_date DESC);
CREATE INDEX article_views_slug_idx ON public.article_views (slug);

CREATE OR REPLACE FUNCTION public.track_article_view(_slug text, _locale text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _slug IS NULL OR length(_slug) = 0 OR length(_slug) > 200 THEN
    RETURN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.articles WHERE slug = _slug) THEN
    RETURN;
  END IF;

  INSERT INTO public.article_views (slug, locale, view_date, views)
  VALUES (_slug, COALESCE(NULLIF(left(_locale, 5), ''), 'sv'), (now() AT TIME ZONE 'utc')::date, 1)
  ON CONFLICT (slug, locale, view_date)
  DO UPDATE SET views = public.article_views.views + 1, updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.track_article_view(text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.track_article_view(text, text) TO service_role;
-- ===== 20260825192614_f9d0870a-faac-4403-878a-a18da7289c60.sql =====
REVOKE EXECUTE ON FUNCTION public.track_article_view(text, text) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_article_view(text, text) TO service_role;
-- ===== 20260826101045_53ff9602-0275-439b-bb78-752a35fd79e6.sql =====
ALTER TABLE public.shipping_rates ADD COLUMN IF NOT EXISTS cost numeric NOT NULL DEFAULT 0;
-- ===== 20260828073110_fad8913b-084f-4a54-b1d7-63f5be06e1a5.sql =====
CREATE TABLE public.page_views_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  view_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  country text NOT NULL DEFAULT 'unknown',
  locale text NOT NULL DEFAULT 'sv',
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (view_date, country, locale)
);

GRANT SELECT ON public.page_views_daily TO authenticated;
GRANT ALL ON public.page_views_daily TO service_role;

ALTER TABLE public.page_views_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read page views"
ON public.page_views_daily FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER page_views_daily_set_updated_at
BEFORE UPDATE ON public.page_views_daily
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX page_views_daily_date_idx ON public.page_views_daily (view_date DESC);

CREATE OR REPLACE FUNCTION public.track_page_view(_country text, _locale text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.page_views_daily (view_date, country, locale, views)
  VALUES (
    (now() AT TIME ZONE 'utc')::date,
    COALESCE(NULLIF(lower(left(_country, 8)), ''), 'unknown'),
    COALESCE(NULLIF(left(_locale, 8), ''), 'sv'),
    1
  )
  ON CONFLICT (view_date, country, locale)
  DO UPDATE SET views = public.page_views_daily.views + 1, updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.track_page_view(text, text) FROM public;
REVOKE EXECUTE ON FUNCTION public.track_page_view(text, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_page_view(text, text) TO service_role;
-- ===== 20260828083620_ac1bd297-4975-45cf-bca2-f55a88b3138c.sql =====
CREATE TABLE public.page_views_hourly (
  id uuid primary key default gen_random_uuid(),
  view_hour timestamptz not null,
  country text not null,
  locale text not null,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (view_hour, country, locale)
);

GRANT SELECT ON public.page_views_hourly TO authenticated;
GRANT ALL ON public.page_views_hourly TO service_role;

ALTER TABLE public.page_views_hourly ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read page_views_hourly"
ON public.page_views_hourly FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER page_views_hourly_set_updated_at
BEFORE UPDATE ON public.page_views_hourly
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX page_views_hourly_hour_idx ON public.page_views_hourly (view_hour DESC);

CREATE OR REPLACE FUNCTION public.track_page_view(_country text, _locale text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.page_views_daily (view_date, country, locale, views)
  VALUES (CURRENT_DATE, _country, _locale, 1)
  ON CONFLICT (view_date, country, locale)
  DO UPDATE SET views = public.page_views_daily.views + 1, updated_at = now();

  INSERT INTO public.page_views_hourly (view_hour, country, locale, views)
  VALUES (date_trunc('hour', now()), _country, _locale, 1)
  ON CONFLICT (view_hour, country, locale)
  DO UPDATE SET views = public.page_views_hourly.views + 1, updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.track_page_view(text, text) FROM public;
REVOKE EXECUTE ON FUNCTION public.track_page_view(text, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_page_view(text, text) TO service_role;
-- ===== 20260829082647_db0483bb-8359-488b-b911-368af29977f8.sql =====
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS customs_description text,
  ADD COLUMN IF NOT EXISTS customs_code text,
  ADD COLUMN IF NOT EXISTS country_of_origin text NOT NULL DEFAULT 'SE',
  ADD COLUMN IF NOT EXISTS weight_grams integer;
-- ===== 20260829091905_8e686bd9-ea62-41b6-8a64-bf7c5c9f3714.sql =====
ALTER TABLE public.bundles
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text;

ALTER TABLE public.bundle_components
  ADD COLUMN IF NOT EXISTS blurb text;
-- ===== 20260829093209_386467bf-8af7-4fcf-8927-2ecbaf231f61.sql =====
GRANT SELECT (slug, name, category, price, old_price, rating, reviews, tags, bg, short, bullets, description, images, variant, is_active, sort_order, created_at, updated_at, sku, stock, track_stock, video_url, video_poster_url, story_images, countries, tiered_pricing, tier_2_discount, tier_3_discount, feed_exclusions, gtin, mpn, google_product_category, brand, story_hero_image, customs_description, customs_code, country_of_origin, weight_grams) ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;

GRANT SELECT (id, product_slug, user_id, author_name, rating, title, body, verified, status, locale, admin_reply, created_at, updated_at, translations) ON public.product_reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_reviews TO authenticated;
GRANT ALL ON public.product_reviews TO service_role;
-- ===== 20260829103838_050778fe-69ac-44d4-a11d-d95fc221339c.sql =====
CREATE TABLE public.cart_events_hourly (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_hour timestamptz NOT NULL,
  event text NOT NULL,
  locale text NOT NULL DEFAULT 'sv',
  country text NOT NULL DEFAULT 'unknown',
  events integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_hour, event, locale, country)
);

GRANT ALL ON public.cart_events_hourly TO service_role;

ALTER TABLE public.cart_events_hourly ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read cart events"
ON public.cart_events_hourly
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER cart_events_hourly_set_updated_at
BEFORE UPDATE ON public.cart_events_hourly
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.track_cart_event(_event text, _locale text, _country text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _event NOT IN ('add_to_cart', 'begin_checkout') THEN
    RETURN;
  END IF;

  INSERT INTO public.cart_events_hourly (event_hour, event, locale, country, events)
  VALUES (date_trunc('hour', now()), _event, COALESCE(NULLIF(left(_locale, 8), ''), 'sv'), COALESCE(NULLIF(left(_country, 8), ''), 'unknown'), 1)
  ON CONFLICT (event_hour, event, locale, country)
  DO UPDATE SET events = public.cart_events_hourly.events + 1, updated_at = now();
END;
$$;
-- ===== 20260829103903_7f59156c-6cd2-4ceb-9b0c-1c98da46eb4b.sql =====
REVOKE EXECUTE ON FUNCTION public.track_cart_event(text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_cart_event(text, text, text) TO service_role;
-- ===== 20260829183611_64b9c87a-04bd-4b96-8cd0-65b119ccbaaa.sql =====
CREATE TABLE public.page_view_visitors (
  view_date date not null,
  visitor_hash text not null,
  created_at timestamptz not null default now(),
  primary key (view_date, visitor_hash)
);

GRANT ALL ON public.page_view_visitors TO service_role;

ALTER TABLE public.page_view_visitors ENABLE ROW LEVEL SECURITY;

CREATE INDEX page_view_visitors_date_idx ON public.page_view_visitors (view_date DESC);

CREATE OR REPLACE FUNCTION public.track_page_view(_country text, _locale text, _visitor_hash text default null)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- En IP (hashad) räknas som högst en besökare per dag.
  IF _visitor_hash IS NOT NULL AND _visitor_hash <> '' THEN
    BEGIN
      INSERT INTO public.page_view_visitors (view_date, visitor_hash)
      VALUES (CURRENT_DATE, _visitor_hash);
    EXCEPTION WHEN unique_violation THEN
      RETURN; -- Redan räknad idag.
    END;

    -- Städa gamla nycklar då och då (behåll ~2 dygn).
    IF random() < 0.02 THEN
      DELETE FROM public.page_view_visitors WHERE view_date < CURRENT_DATE - 1;
    END IF;
  END IF;

  INSERT INTO public.page_views_daily (view_date, country, locale, views)
  VALUES (CURRENT_DATE, _country, _locale, 1)
  ON CONFLICT (view_date, country, locale)
  DO UPDATE SET views = public.page_views_daily.views + 1, updated_at = now();

  INSERT INTO public.page_views_hourly (view_hour, country, locale, views)
  VALUES (date_trunc('hour', now()), _country, _locale, 1)
  ON CONFLICT (view_hour, country, locale)
  DO UPDATE SET views = public.page_views_hourly.views + 1, updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.track_page_view(text, text, text) FROM public;
REVOKE EXECUTE ON FUNCTION public.track_page_view(text, text, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_page_view(text, text, text) TO service_role;