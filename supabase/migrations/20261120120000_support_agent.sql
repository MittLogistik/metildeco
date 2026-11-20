-- Kundtjänstbotar (Matilda). Inlogget är en API-nyckel; bara hashen sparas.
CREATE TABLE IF NOT EXISTS public.support_agents (
  id text PRIMARY KEY,
  name text NOT NULL,
  key_hash text,
  key_prefix text,
  enabled boolean NOT NULL DEFAULT true,
  allow_subscriptions boolean NOT NULL DEFAULT true,
  allow_email boolean NOT NULL DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.support_agents ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.support_agents TO service_role;

INSERT INTO public.support_agents (id, name) VALUES ('matilda', 'Matilda') ON CONFLICT (id) DO NOTHING;

-- Allt som kundtjänsten gör: Matildas uppslag, ändringar och mejl, och adminens prenumerationsändringar.
CREATE TABLE IF NOT EXISTS public.support_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text NOT NULL,
  action text NOT NULL,
  customer_email text,
  target text,
  summary text,
  details jsonb,
  ok boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS support_log_created_idx ON public.support_log (created_at DESC);
CREATE INDEX IF NOT EXISTS support_log_customer_idx ON public.support_log (customer_email);
ALTER TABLE public.support_log ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.support_log TO service_role;
