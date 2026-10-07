-- Sidtexter som redigerats i admin (/admin/sidor). Saknas en rad visas standardtexten i src/content/legal.ts.
-- Läses och skrivs bara av servern (service role).
CREATE TABLE IF NOT EXISTS public.page_overrides (
  slug text PRIMARY KEY,
  title text NOT NULL,
  intro text NOT NULL DEFAULT '',
  updated_label text NOT NULL DEFAULT '',
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_overrides ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.page_overrides TO service_role;
