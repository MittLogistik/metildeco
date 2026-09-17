CREATE TABLE public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null default 'sv',
  title text not null default '',
  excerpt text not null default '',
  category text not null default '',
  cover_image text,
  lead text not null default '',
  blocks jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  read_minutes integer not null default 5,
  status text not null default 'draft',
  published_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are public"
ON public.articles FOR SELECT
USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert articles"
ON public.articles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update articles"
ON public.articles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete articles"
ON public.articles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER articles_set_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX articles_locale_status_idx ON public.articles (locale, status, published_at DESC);