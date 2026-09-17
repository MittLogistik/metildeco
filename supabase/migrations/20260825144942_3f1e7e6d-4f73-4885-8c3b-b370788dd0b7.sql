DROP POLICY IF EXISTS "No direct client access to integration settings" ON public.integration_settings;
CREATE POLICY "No direct client access to integration settings"
ON public.integration_settings
FOR SELECT
TO anon, authenticated
USING (false);