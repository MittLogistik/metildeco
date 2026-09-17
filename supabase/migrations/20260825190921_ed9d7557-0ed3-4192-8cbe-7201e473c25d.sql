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