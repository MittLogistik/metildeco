-- Övergivna korgar: fyra påminnelser (3 h, 24 h, 3 d, 10 d), rabattkod och avregistrering.
ALTER TABLE public.abandoned_carts
  ADD COLUMN IF NOT EXISTS reminder_3_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminder_4_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS reminders_sent integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_reminder_at timestamptz,
  ADD COLUMN IF NOT EXISTS discount_code text,
  ADD COLUMN IF NOT EXISTS last_error text,
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz;

-- Statusar: open (påminnelser pågår), recovered (köpt), handled (stoppad av admin),
-- unsubscribed (kunden avsagt sig), superseded (kunden startade en nyare kassa), dismissed/converted (äldre)
ALTER TABLE public.abandoned_carts DROP CONSTRAINT IF EXISTS abandoned_carts_status_valid;
ALTER TABLE public.abandoned_carts ADD CONSTRAINT abandoned_carts_status_valid
  CHECK (status IN ('open','recovered','converted','dismissed','handled','unsubscribed','superseded'));

CREATE INDEX IF NOT EXISTS abandoned_carts_due_idx ON public.abandoned_carts (next_reminder_at) WHERE status = 'open';

-- Adresser som inte vill ha fler påminnelser om övergivna korgar.
CREATE TABLE IF NOT EXISTS public.email_optouts (
  email text PRIMARY KEY,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.email_optouts TO authenticated;
GRANT ALL ON public.email_optouts TO service_role;
ALTER TABLE public.email_optouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read optouts" ON public.email_optouts;
CREATE POLICY "Admins read optouts" ON public.email_optouts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
