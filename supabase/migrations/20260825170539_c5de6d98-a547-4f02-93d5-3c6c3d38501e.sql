UPDATE public.system_settings
SET value = jsonb_set(value, '{endpoint_url}', '"https://addrevenue.io/t"'::jsonb, true),
    updated_at = now()
WHERE key = 'addrevenue_config';

UPDATE public.postback_queue
SET endpoint_url = 'https://addrevenue.io/t',
    status = 'pending',
    attempts = 0,
    last_error = NULL,
    response_body = NULL,
    next_attempt_at = now(),
    updated_at = now()
WHERE source ILIKE 'addrevenue%'
  AND order_number = 'MO-0001';