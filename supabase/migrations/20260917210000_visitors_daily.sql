-- Unika besökare per dag (page_view_visitors städas efter ett par dygn och duger inte för historik)
CREATE TABLE IF NOT EXISTS public.visitors_daily (
  view_date date NOT NULL,
  country text NOT NULL DEFAULT 'unknown',
  visitors integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (view_date, country)
);
ALTER TABLE public.visitors_daily ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.visitors_daily TO service_role;

-- Returnerar true om besökaren är ny för dagen och räknar då upp visitors_daily
CREATE OR REPLACE FUNCTION public.track_unique_visitor(_country text, _visitor_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.page_view_visitors (view_date, visitor_hash) VALUES (CURRENT_DATE, _visitor_hash);
  EXCEPTION WHEN unique_violation THEN
    RETURN false;
  END;
  INSERT INTO public.visitors_daily (view_date, country, visitors)
  VALUES (CURRENT_DATE, COALESCE(NULLIF(left(_country, 8), ''), 'unknown'), 1)
  ON CONFLICT (view_date, country) DO UPDATE SET visitors = public.visitors_daily.visitors + 1, updated_at = now();
  IF random() < 0.02 THEN
    DELETE FROM public.page_view_visitors WHERE view_date < CURRENT_DATE - 1;
  END IF;
  RETURN true;
END;
$$;
