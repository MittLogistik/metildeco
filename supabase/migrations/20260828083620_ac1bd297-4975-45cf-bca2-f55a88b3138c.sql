CREATE TABLE public.page_views_hourly (
  id uuid primary key default gen_random_uuid(),
  view_hour timestamptz not null,
  country text not null,
  locale text not null,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (view_hour, country, locale)
);

GRANT SELECT ON public.page_views_hourly TO authenticated;
GRANT ALL ON public.page_views_hourly TO service_role;

ALTER TABLE public.page_views_hourly ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read page_views_hourly"
ON public.page_views_hourly FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER page_views_hourly_set_updated_at
BEFORE UPDATE ON public.page_views_hourly
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX page_views_hourly_hour_idx ON public.page_views_hourly (view_hour DESC);

CREATE OR REPLACE FUNCTION public.track_page_view(_country text, _locale text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.page_views_daily (view_date, country, locale, views)
  VALUES (CURRENT_DATE, _country, _locale, 1)
  ON CONFLICT (view_date, country, locale)
  DO UPDATE SET views = public.page_views_daily.views + 1, updated_at = now();

  INSERT INTO public.page_views_hourly (view_hour, country, locale, views)
  VALUES (date_trunc('hour', now()), _country, _locale, 1)
  ON CONFLICT (view_hour, country, locale)
  DO UPDATE SET views = public.page_views_hourly.views + 1, updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.track_page_view(text, text) FROM public;
REVOKE EXECUTE ON FUNCTION public.track_page_view(text, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_page_view(text, text) TO service_role;