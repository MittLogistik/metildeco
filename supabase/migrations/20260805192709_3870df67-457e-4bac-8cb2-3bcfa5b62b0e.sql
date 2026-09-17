DROP POLICY "Anyone can read enabled locales" ON public.locales;

CREATE POLICY "Anyone can read enabled locales"
ON public.locales FOR SELECT TO anon
USING (enabled = true);

CREATE POLICY "Signed in users can read locales"
ON public.locales FOR SELECT TO authenticated
USING (enabled = true OR public.has_role(auth.uid(), 'admin'));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;