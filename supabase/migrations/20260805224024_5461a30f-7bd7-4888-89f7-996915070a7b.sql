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