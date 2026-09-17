-- 1. Systeminställningar (icke-hemliga integrationsvärden)
CREATE TABLE public.system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read system settings"
  ON public.system_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER system_settings_set_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.system_settings (key, value) VALUES (
  'addrevenue_config',
  '{"enabled": false, "advertiser_id": "", "attribution_days": 30, "endpoint_url": "https://addrevenue.io/t", "api_base_url": "https://addrevenue.io/api/v2"}'::jsonb
);

-- 2. Klickspårning
CREATE TABLE public.visitor_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  source text NOT NULL DEFAULT 'addrevenue',
  click_id text,
  click_ref text,
  raw_params jsonb NOT NULL DEFAULT '{}'::jsonb,
  landing_url text,
  referrer text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX visitor_tracking_visitor_idx ON public.visitor_tracking (visitor_id, created_at DESC);
CREATE INDEX visitor_tracking_expires_idx ON public.visitor_tracking (expires_at);
GRANT SELECT ON public.visitor_tracking TO authenticated;
GRANT ALL ON public.visitor_tracking TO service_role;
ALTER TABLE public.visitor_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read visitor tracking"
  ON public.visitor_tracking FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER visitor_tracking_set_updated_at
  BEFORE UPDATE ON public.visitor_tracking
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Postback-kö
CREATE TABLE public.postback_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number text,
  source text NOT NULL DEFAULT 'addrevenue',
  endpoint_url text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  response_body text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX postback_queue_order_source_idx ON public.postback_queue (order_id, source);
CREATE INDEX postback_queue_pending_idx ON public.postback_queue (status, next_attempt_at);
GRANT SELECT ON public.postback_queue TO authenticated;
GRANT ALL ON public.postback_queue TO service_role;
ALTER TABLE public.postback_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read postback queue"
  ON public.postback_queue FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER postback_queue_set_updated_at
  BEFORE UPDATE ON public.postback_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Växelkurser
CREATE TABLE public.exchange_rates (
  currency text PRIMARY KEY,
  rate_to_sek numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.exchange_rates TO authenticated;
GRANT ALL ON public.exchange_rates TO service_role;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read exchange rates"
  ON public.exchange_rates FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER exchange_rates_set_updated_at
  BEFORE UPDATE ON public.exchange_rates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.exchange_rates_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency text NOT NULL,
  rate_to_sek numeric NOT NULL,
  rate_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX exchange_rates_history_currency_date_idx
  ON public.exchange_rates_history (currency, rate_date);
GRANT SELECT ON public.exchange_rates_history TO authenticated;
GRANT ALL ON public.exchange_rates_history TO service_role;
ALTER TABLE public.exchange_rates_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read exchange rate history"
  ON public.exchange_rates_history FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.exchange_rates (currency, rate_to_sek) VALUES
  ('SEK', 1), ('EUR', 11.3), ('DKK', 1.52), ('NOK', 0.95),
  ('PLN', 2.65), ('USD', 9.6), ('GBP', 13.2);
INSERT INTO public.exchange_rates_history (currency, rate_to_sek, rate_date)
  SELECT currency, rate_to_sek, CURRENT_DATE FROM public.exchange_rates;

-- 5. Affiliate-fält på ordrar + ordernummer
CREATE SEQUENCE public.order_number_seq START 10000;

ALTER TABLE public.orders
  ADD COLUMN order_number text,
  ADD COLUMN affiliate_source text,
  ADD COLUMN affiliate_click_id text,
  ADD COLUMN affiliate_click_ref text,
  ADD COLUMN affiliate_commission numeric,
  ADD COLUMN affiliate_commission_currency text,
  ADD COLUMN affiliate_commission_sek numeric,
  ADD COLUMN affiliate_brokerage_fee numeric,
  ADD COLUMN affiliate_brokerage_fee_sek numeric,
  ADD COLUMN affiliate_commission_synced_at timestamptz,
  ADD COLUMN exchange_rate_to_sek numeric;

CREATE OR REPLACE FUNCTION public.assign_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'MET-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_assign_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.assign_order_number();

UPDATE public.orders
   SET order_number = 'MET-' || lpad(nextval('public.order_number_seq')::text, 6, '0')
 WHERE order_number IS NULL;

CREATE UNIQUE INDEX orders_order_number_idx ON public.orders (order_number);