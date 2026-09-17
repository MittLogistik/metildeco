CREATE TABLE public.stock_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL REFERENCES public.products(slug) ON DELETE CASCADE,
  email text NOT NULL,
  locale text NOT NULL DEFAULT 'sv',
  country text,
  status text NOT NULL DEFAULT 'pending',
  notified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX stock_notifications_pending_unique
  ON public.stock_notifications (product_slug, lower(email))
  WHERE status = 'pending';

CREATE INDEX stock_notifications_pending_idx
  ON public.stock_notifications (product_slug) WHERE status = 'pending';

GRANT INSERT ON public.stock_notifications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.stock_notifications TO authenticated;
GRANT ALL ON public.stock_notifications TO service_role;

ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to stock alerts"
  ON public.stock_notifications FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND notified_at IS NULL);

CREATE POLICY "Admins can view stock alerts"
  ON public.stock_notifications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update stock alerts"
  ON public.stock_notifications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete stock alerts"
  ON public.stock_notifications FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER stock_notifications_set_updated_at
  BEFORE UPDATE ON public.stock_notifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();