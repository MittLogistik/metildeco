REVOKE EXECUTE ON FUNCTION public.acquire_job_lock(text, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.release_job_lock(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_article_translations() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.acquire_job_lock(text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_job_lock(text) TO service_role;