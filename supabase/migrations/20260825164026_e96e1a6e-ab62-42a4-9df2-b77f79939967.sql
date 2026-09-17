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