-- Plocky (WMS): ordrar skickas till lagret via Plockys Webshop-API, lagersaldo och
-- leveransbesked kommer tillbaka till /api/plocky/wms-inbound.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS wms_order_id text,
  ADD COLUMN IF NOT EXISTS wms_sent_at timestamptz;

-- Kö för ordrar som ska till Plocky. En rad per order; misslyckade försök görs om med backoff.
CREATE TABLE IF NOT EXISTS public.wms_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number text,
  status text NOT NULL DEFAULT 'pending', -- pending | retrying | sent | failed
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  warning text,
  response_body text,
  wms_order_id text,
  payload jsonb,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS wms_queue_pending_idx ON public.wms_queue (status, next_attempt_at);
GRANT SELECT ON public.wms_queue TO authenticated;
GRANT ALL ON public.wms_queue TO service_role;
ALTER TABLE public.wms_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read wms queue" ON public.wms_queue;
CREATE POLICY "Admins can read wms queue"
  ON public.wms_queue FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS wms_queue_set_updated_at ON public.wms_queue;
CREATE TRIGGER wms_queue_set_updated_at
  BEFORE UPDATE ON public.wms_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Logg över det som kommer in från Plocky (ping, lagersaldo, leveransbesked).
CREATE TABLE IF NOT EXISTS public.wms_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  order_number text,
  ok boolean NOT NULL DEFAULT true,
  message text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS wms_events_created_idx ON public.wms_events (created_at DESC);
GRANT SELECT ON public.wms_events TO authenticated;
GRANT ALL ON public.wms_events TO service_role;
ALTER TABLE public.wms_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can read wms events" ON public.wms_events;
CREATE POLICY "Admins can read wms events"
  ON public.wms_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
