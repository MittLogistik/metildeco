GRANT SELECT (slug, name, category, price, old_price, rating, reviews, tags, bg, short, bullets, description, images, variant, is_active, sort_order, created_at, updated_at, sku, stock, track_stock, video_url, video_poster_url, story_images, countries, tiered_pricing, tier_2_discount, tier_3_discount, feed_exclusions, gtin, mpn, google_product_category, brand, story_hero_image, customs_description, customs_code, country_of_origin, weight_grams) ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;

GRANT SELECT (id, product_slug, user_id, author_name, rating, title, body, verified, status, locale, admin_reply, created_at, updated_at, translations) ON public.product_reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_reviews TO authenticated;
GRANT ALL ON public.product_reviews TO service_role;