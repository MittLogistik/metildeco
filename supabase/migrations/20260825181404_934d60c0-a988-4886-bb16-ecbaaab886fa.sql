CREATE TABLE public.article_translation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  slug text NOT NULL,
  source_locale text NOT NULL,
  target_locale text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  run_after timestamptz NOT NULL DEFAULT now(),
  last_error text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_article_id, target_locale)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.article_translation_jobs TO authenticated;
GRANT ALL ON public.article_translation_jobs TO service_role;

ALTER TABLE public.article_translation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage translation jobs"
ON public.article_translation_jobs FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER article_translation_jobs_set_updated_at
BEFORE UPDATE ON public.article_translation_jobs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX article_translation_jobs_due_idx
ON public.article_translation_jobs (status, run_after);

CREATE TABLE public.job_locks (
  name text PRIMARY KEY,
  leased_until timestamptz,
  paused boolean NOT NULL DEFAULT false,
  paused_reason text,
  paused_at timestamptz,
  last_run_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.job_locks TO authenticated;
GRANT ALL ON public.job_locks TO service_role;

ALTER TABLE public.job_locks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read job locks"
ON public.job_locks FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER job_locks_set_updated_at
BEFORE UPDATE ON public.job_locks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.acquire_job_lock(_name text, _seconds integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _ok boolean;
BEGIN
  INSERT INTO public.job_locks (name, leased_until, last_run_at)
  VALUES (_name, now() + make_interval(secs => _seconds), now())
  ON CONFLICT (name) DO UPDATE
    SET leased_until = now() + make_interval(secs => _seconds),
        last_run_at = now()
    WHERE public.job_locks.leased_until IS NULL
       OR public.job_locks.leased_until < now()
  RETURNING true INTO _ok;

  RETURN COALESCE(_ok, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.release_job_lock(_name text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.job_locks SET leased_until = NULL WHERE name = _name;
$$;

REVOKE EXECUTE ON FUNCTION public.acquire_job_lock(text, integer) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.release_job_lock(text) FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.enqueue_article_translations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _locales text[] := ARRAY['sv','en','fi','da','no','de','nl','it','fr','es','pl'];
  _target text;
BEGIN
  IF NEW.status <> 'published' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'published' THEN
    RETURN NEW;
  END IF;

  FOREACH _target IN ARRAY _locales LOOP
    IF _target <> NEW.locale
       AND NOT EXISTS (
         SELECT 1 FROM public.articles a
         WHERE a.slug = NEW.slug AND a.locale = _target
       ) THEN
      INSERT INTO public.article_translation_jobs
        (source_article_id, slug, source_locale, target_locale, run_after)
      VALUES (NEW.id, NEW.slug, NEW.locale, _target, now() + interval '30 minutes')
      ON CONFLICT (source_article_id, target_locale) DO NOTHING;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER articles_enqueue_translations
AFTER INSERT OR UPDATE OF status ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.enqueue_article_translations();