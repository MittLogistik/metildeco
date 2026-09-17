ALTER TABLE public.product_prices DROP CONSTRAINT product_prices_product_slug_fkey;
ALTER TABLE public.product_prices ADD CONSTRAINT product_prices_product_slug_fkey FOREIGN KEY (product_slug) REFERENCES public.products(slug) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.bundle_components DROP CONSTRAINT bundle_components_product_slug_fkey;
ALTER TABLE public.bundle_components ADD CONSTRAINT bundle_components_product_slug_fkey FOREIGN KEY (product_slug) REFERENCES public.products(slug) ON UPDATE CASCADE ON DELETE CASCADE;