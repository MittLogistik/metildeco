ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS video_poster_url text;

CREATE POLICY "Public can read product media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-media');

CREATE POLICY "Admins can upload product media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update product media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete product media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'::app_role));