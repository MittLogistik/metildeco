-- Unika besökare per dag och källa (samma kanaler som orders.source, lib/attribution).
-- En besökare räknas en gång per dygn, i källan för dygnets första sidvisning (landningen).
CREATE TABLE IF NOT EXISTS public.visitor_sources_daily (
  view_date date NOT NULL,
  source text NOT NULL DEFAULT 'direct',
  visitors integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (view_date, source)
);
ALTER TABLE public.visitor_sources_daily ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.visitor_sources_daily TO service_role;

CREATE OR REPLACE FUNCTION public.track_visitor_source(_source text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.visitor_sources_daily (view_date, source, visitors)
  VALUES (CURRENT_DATE, COALESCE(NULLIF(left(_source, 24), ''), 'direct'), 1)
  ON CONFLICT (view_date, source) DO UPDATE SET visitors = public.visitor_sources_daily.visitors + 1, updated_at = now();
$$;
REVOKE ALL ON FUNCTION public.track_visitor_source(text) FROM public;
REVOKE EXECUTE ON FUNCTION public.track_visitor_source(text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_visitor_source(text) TO service_role;
