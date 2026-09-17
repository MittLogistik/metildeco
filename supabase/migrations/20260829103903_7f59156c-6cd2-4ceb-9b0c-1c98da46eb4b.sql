REVOKE EXECUTE ON FUNCTION public.track_cart_event(text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_cart_event(text, text, text) TO service_role;