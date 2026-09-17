-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- shared updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Locales
CREATE TABLE public.locales (
  code text PRIMARY KEY,
  name text NOT NULL,
  english_name text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  is_default boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.locales TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locales TO authenticated;
GRANT ALL ON public.locales TO service_role;
ALTER TABLE public.locales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read enabled locales"
ON public.locales FOR SELECT TO anon, authenticated
USING (enabled = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage locales"
ON public.locales FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER locales_set_updated_at
BEFORE UPDATE ON public.locales
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Translations (all UI, product and article strings, keyed by dotted key)
CREATE TABLE public.ui_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  locale text NOT NULL REFERENCES public.locales(code) ON DELETE CASCADE,
  namespace text NOT NULL DEFAULT 'ui',
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (locale, key)
);

CREATE INDEX ui_translations_locale_idx ON public.ui_translations (locale);
CREATE INDEX ui_translations_namespace_idx ON public.ui_translations (namespace);

GRANT SELECT ON public.ui_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ui_translations TO authenticated;
GRANT ALL ON public.ui_translations TO service_role;
ALTER TABLE public.ui_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read translations for enabled locales"
ON public.ui_translations FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.locales l WHERE l.code = locale AND l.enabled));

CREATE POLICY "Admins manage translations"
ON public.ui_translations FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER ui_translations_set_updated_at
BEFORE UPDATE ON public.ui_translations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.locales (code, name, english_name, enabled, is_default, sort_order) VALUES
  ('en', 'English', 'English', true, true, 1),
  ('sv', 'Svenska', 'Swedish', true, false, 2);