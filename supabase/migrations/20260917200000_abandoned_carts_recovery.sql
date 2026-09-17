-- Övergivna korgar från Stripe Checkout: återställningslänk och koppling till session
ALTER TABLE public.abandoned_carts ADD COLUMN IF NOT EXISTS recovery_url text;
ALTER TABLE public.abandoned_carts ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'stripe';
CREATE UNIQUE INDEX IF NOT EXISTS abandoned_carts_cart_token_key ON public.abandoned_carts (cart_token);
CREATE INDEX IF NOT EXISTS abandoned_carts_email_idx ON public.abandoned_carts (email);
