REVOKE EXECUTE ON FUNCTION public.track_article_view(text, text) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_article_view(text, text) TO service_role;