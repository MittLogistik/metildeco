-- Logg över vad annonsmotorn gjort (och föreslagit) i Meta, så att adminpanelen kan visa historik.
CREATE TABLE IF NOT EXISTS public.ad_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  campaign_id text,
  adset_id text,
  ad_id text,
  name text NOT NULL,
  action text NOT NULL,        -- create | pause | activate | budget | keep | note
  reason text NOT NULL,
  metrics jsonb,
  applied boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'manual'  -- manual | cron | admin
);
CREATE INDEX IF NOT EXISTS ad_log_created_idx ON public.ad_log (created_at DESC);
ALTER TABLE public.ad_log ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.ad_log TO service_role;
