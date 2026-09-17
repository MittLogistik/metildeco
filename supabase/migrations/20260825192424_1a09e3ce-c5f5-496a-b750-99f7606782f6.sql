CREATE TABLE public.article_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  locale text NOT NULL,
  view_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slug, locale, view_date)
);

GRANT SELECT ON public.article_views TO authenticated;
GRANT ALL ON public.article_views TO service_role;

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read article views"
ON public.article_views FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER article_views_set_updated_at
BEFORE UPDATE ON public.article_views
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX article_views_date_idx ON public.article_views (view_date DESC);
CREATE INDEX article_views_slug_idx ON public.article_views (slug);

CREATE OR REPLACE FUNCTION public.track_article_view(_slug text, _locale text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _slug IS NULL OR length(_slug) = 0 OR length(_slug) > 200 THEN
    RETURN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.articles WHERE slug = _slug) THEN
    RETURN;
  END IF;

  INSERT INTO public.article_views (slug, locale, view_date, views)
  VALUES (_slug, COALESCE(NULLIF(left(_locale, 5), ''), 'sv'), (now() AT TIME ZONE 'utc')::date, 1)
  ON CONFLICT (slug, locale, view_date)
  DO UPDATE SET views = public.article_views.views + 1, updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.track_article_view(text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.track_article_view(text, text) TO service_role;