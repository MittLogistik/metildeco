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