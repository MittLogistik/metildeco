-- Prenumerationens intervall i dagar (från order_items.plan "sub:30") så att admin och kund
-- ser hur ofta leveransen sker utan att gå till Stripe.
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS interval_days integer;
UPDATE public.subscriptions s
SET interval_days = sub.days
FROM (
  SELECT o.stripe_subscription_id, (regexp_match(oi.plan, '^sub:(\d+)'))[1]::int AS days
  FROM public.orders o
  JOIN public.order_items oi ON oi.order_id = o.id
  WHERE o.stripe_subscription_id IS NOT NULL AND oi.plan ~ '^sub:\d+'
) sub
WHERE sub.stripe_subscription_id = s.stripe_subscription_id AND s.interval_days IS NULL;

-- Planerade förnyelseleveranser: betalningen bekräftas av Stripe ca en vecka före planerad leverans,
-- ordern ligger som "scheduled" och släpps (status paid, senare Plocky) release_at.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS deliver_at timestamptz,
  ADD COLUMN IF NOT EXISTS release_at timestamptz;
CREATE INDEX IF NOT EXISTS orders_scheduled_release_idx ON public.orders (release_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS orders_email_idx ON public.orders (lower(email));
