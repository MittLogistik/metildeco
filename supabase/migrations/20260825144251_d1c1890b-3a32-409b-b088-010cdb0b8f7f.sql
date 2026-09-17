REVOKE ALL ON public.live_visitors FROM anon;
GRANT SELECT ON public.live_visitors TO authenticated;
GRANT ALL ON public.live_visitors TO service_role;

DROP POLICY IF EXISTS "Admins can read live visitors" ON public.live_visitors;
CREATE POLICY "Admins can read live visitors"
ON public.live_visitors
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));