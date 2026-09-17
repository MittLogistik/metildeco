CREATE TABLE public.page_views_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  view_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  country text NOT NULL DEFAULT 'unknown',
  locale text NOT NULL DEFAULT 'sv',
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (view_date, country, locale)
);

GRANT SELECT ON public.page_views_daily TO authenticated;
GRANT ALL ON public.page_views_daily TO service_role;

ALTER TABLE public.page_views_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read page views"
ON public.page_views_daily FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER page_views_daily_set_updated_at
BEFORE UPDATE ON public.page_views_daily
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX page_views_daily_date_idx ON public.page_views_daily (view_date DESC);

CREATE OR REPLACE FUNCTION public.track_page_view(_country text, _locale text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.page_views_daily (view_date, country, locale, views)
  VALUES (
    (now() AT TIME ZONE 'utc')::date,
    COALESCE(NULLIF(lower(left(_country, 8)), ''), 'unknown'),
    COALESCE(NULLIF(left(_locale, 8), ''), 'sv'),
    1
  )
  ON CONFLICT (view_date, country, locale)
  DO UPDATE SET views = public.page_views_daily.views + 1, updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.track_page_view(text, text) FROM public;
REVOKE EXECUTE ON FUNCTION public.track_page_view(text, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_page_view(text, text) TO service_role;