DROP POLICY IF EXISTS "Published articles are public" ON public.articles;

CREATE POLICY "Anyone can read published articles"
ON public.articles FOR SELECT TO anon
USING (status = 'published');

CREATE POLICY "Logged in users read published articles or admins read all"
ON public.articles FOR SELECT TO authenticated
USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));