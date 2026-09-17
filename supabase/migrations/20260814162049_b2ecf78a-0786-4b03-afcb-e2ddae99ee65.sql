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
