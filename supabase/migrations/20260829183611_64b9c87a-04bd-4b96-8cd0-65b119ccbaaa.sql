CREATE TABLE public.page_view_visitors (
  view_date date not null,
  visitor_hash text not null,
  created_at timestamptz not null default now(),
  primary key (view_date, visitor_hash)
);

GRANT ALL ON public.page_view_visitors TO service_role;

ALTER TABLE public.page_view_visitors ENABLE ROW LEVEL SECURITY;

CREATE INDEX page_view_visitors_date_idx ON public.page_view_visitors (view_date DESC);

CREATE OR REPLACE FUNCTION public.track_page_view(_country text, _locale text, _visitor_hash text default null)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- En IP (hashad) räknas som högst en besökare per dag.
  IF _visitor_hash IS NOT NULL AND _visitor_hash <> '' THEN
    BEGIN
      INSERT INTO public.page_view_visitors (view_date, visitor_hash)
      VALUES (CURRENT_DATE, _visitor_hash);
    EXCEPTION WHEN unique_violation THEN
      RETURN; -- Redan räknad idag.
    END;

    -- Städa gamla nycklar då och då (behåll ~2 dygn).
    IF random() < 0.02 THEN
      DELETE FROM public.page_view_visitors WHERE view_date < CURRENT_DATE - 1;
    END IF;
  END IF;

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

REVOKE ALL ON FUNCTION public.track_page_view(text, text, text) FROM public;
REVOKE EXECUTE ON FUNCTION public.track_page_view(text, text, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_page_view(text, text, text) TO service_role;