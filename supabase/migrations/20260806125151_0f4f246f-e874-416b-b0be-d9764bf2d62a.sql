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