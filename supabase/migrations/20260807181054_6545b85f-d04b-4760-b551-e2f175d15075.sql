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