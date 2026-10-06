-- Komplement till 20261005150000: meningar som börjar med "Tillverkade i Sverige" (stor bokstav) missades.
CREATE FUNCTION pg_temp.fix_made_in2(t text) RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT regexp_replace(regexp_replace(regexp_replace(t,
    'Tillverkade i Sverige och packade i plastburk', 'Packade i plastburk', 'g'),
    '\. Tillverkade i Sverige, fri frakt', '. Fri frakt', 'g'),
    'Tillverkade i Sverige', 'Utvecklade i Sverige', 'g')
$$;

CREATE FUNCTION pg_temp.fix_made_in2(a text[]) RETURNS text[] LANGUAGE sql IMMUTABLE AS $$
  SELECT ARRAY(SELECT pg_temp.fix_made_in2(d) FROM unnest(a) WITH ORDINALITY u(d, n) ORDER BY n)
$$;

UPDATE public.bundles
SET short = pg_temp.fix_made_in2(short),
    description = pg_temp.fix_made_in2(description),
    seo_title = pg_temp.fix_made_in2(seo_title),
    seo_description = pg_temp.fix_made_in2(seo_description)
WHERE concat_ws(' ', short, array_to_string(description, ' '), seo_title, seo_description) ~ 'Tillverkade i Sverige';

UPDATE public.bundle_components SET blurb = pg_temp.fix_made_in2(blurb) WHERE blurb ~ 'Tillverkade i Sverige';

UPDATE public.products
SET short = pg_temp.fix_made_in2(short),
    bullets = pg_temp.fix_made_in2(bullets),
    description = pg_temp.fix_made_in2(description)
WHERE concat_ws(' ', short, array_to_string(bullets, ' '), array_to_string(description, ' ')) ~ 'Tillverkade i Sverige';
