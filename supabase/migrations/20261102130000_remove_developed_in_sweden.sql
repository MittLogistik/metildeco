-- "Utvecklad i Sverige" tas bort ur alla produkt- och pakettexter (beslut 2026-11-02).
-- Lagret i Sverige nämns fortfarande där det står. Exakta fraser, så inget annat ändras.
CREATE OR REPLACE FUNCTION pg_temp.strip_sweden(t text) RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT replace(replace(replace(replace(replace(replace(replace(replace(t,
    ' Utvecklad i Sverige och packad i plastburk', ' Packad i plastburk'),
    'Utvecklad i Sverige, förpackad i plastburk.', 'Förpackad i plastburk.'),
    'Vegansk kapsel, utvecklad i Sverige', 'Vegansk kapsel utan fyllnadsmedel'),
    ' – utvecklad i Sverige.', '.'),
    'veganska kapslar, utvecklade i Sverige, fri frakt', 'veganska kapslar, fri frakt'),
    'Eurycoma longifolia, utvecklade i Sverige, fri frakt', 'Eurycoma longifolia, fri frakt'),
    'utan fyllnadsmedel, utvecklade i Sverige och packade i plastburk', 'utan fyllnadsmedel och packade i plastburk'),
    'Två högkvalitativa rotextrakt, 200:1 och 20:1, utvecklade i Sverige. Optimerat för din dagliga rutin.', 'Två extrakt, 200:1 och 20:1, för din dagliga rutin.')
$$;

CREATE OR REPLACE FUNCTION pg_temp.strip_sweden_arr(a text[]) RETURNS text[] LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE WHEN a IS NULL THEN NULL
    ELSE ARRAY(SELECT pg_temp.strip_sweden(x) FROM unnest(a) WITH ORDINALITY AS u(x, i) ORDER BY i) END
$$;

UPDATE public.products SET
  short = pg_temp.strip_sweden(short),
  bullets = pg_temp.strip_sweden_arr(bullets),
  description = pg_temp.strip_sweden_arr(description);

UPDATE public.bundles SET
  short = pg_temp.strip_sweden(short),
  description = pg_temp.strip_sweden_arr(description),
  seo_title = pg_temp.strip_sweden(seo_title),
  seo_description = pg_temp.strip_sweden(seo_description);
