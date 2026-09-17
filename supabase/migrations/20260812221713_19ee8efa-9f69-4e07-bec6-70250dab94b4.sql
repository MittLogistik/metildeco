CREATE TABLE public.live_visitors (
  id text PRIMARY KEY,
  path text NOT NULL DEFAULT '/',
  locale text NOT NULL DEFAULT 'sv',
  currency text NOT NULL DEFAULT 'SEK',
  country text,
  in_checkout boolean NOT NULL DEFAULT false,
  cart_count integer NOT NULL DEFAULT 0,
  cart_subtotal_sek numeric NOT NULL DEFAULT 0,
  cart_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  email text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.live_visitors TO service_role;

ALTER TABLE public.live_visitors ENABLE ROW LEVEL SECURITY;

CREATE INDEX live_visitors_last_seen_idx ON public.live_visitors (last_seen_at DESC);