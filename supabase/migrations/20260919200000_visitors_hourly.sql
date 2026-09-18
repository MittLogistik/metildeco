-- Unika besökare per timme (samma dygnshash som visitors_daily: en besökare räknas
-- i den timme hen först sågs under dygnet). Ger timma-för-timma i adminöversikten.
CREATE TABLE IF NOT EXISTS public.visitors_hourly (
  view_hour timestamptz NOT NULL,
  country text NOT NULL DEFAULT 'unknown',
  visitors integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (view_hour, country)
);
ALTER TABLE public.visitors_hourly ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.visitors_hourly TO service_role;
CREATE INDEX IF NOT EXISTS visitors_hourly_hour_idx ON public.visitors_hourly (view_hour DESC);

CREATE OR REPLACE FUNCTION public.track_unique_visitor(_country text, _visitor_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _c text := COALESCE(NULLIF(left(_country, 8), ''), 'unknown');
BEGIN
  BEGIN
    INSERT INTO public.page_view_visitors (view_date, visitor_hash) VALUES (CURRENT_DATE, _visitor_hash);
  EXCEPTION WHEN unique_violation THEN
    RETURN false;
  END;
  INSERT INTO public.visitors_daily (view_date, country, visitors)
  VALUES (CURRENT_DATE, _c, 1)
  ON CONFLICT (view_date, country) DO UPDATE SET visitors = public.visitors_daily.visitors + 1, updated_at = now();
  INSERT INTO public.visitors_hourly (view_hour, country, visitors)
  VALUES (date_trunc('hour', now()), _c, 1)
  ON CONFLICT (view_hour, country) DO UPDATE SET visitors = public.visitors_hourly.visitors + 1, updated_at = now();
  IF random() < 0.02 THEN
    DELETE FROM public.page_view_visitors WHERE view_date < CURRENT_DATE - 1;
  END IF;
  RETURN true;
END;
$$;
