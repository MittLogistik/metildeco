-- Produkterna tillverkas inte i Sverige. "Tillverkad i Sverige" blir "Utvecklad i Sverige", och meningar om
-- svensk tillverkning, kapsling eller packning i Sverige stryks. Samma ersättningar som i data/*.json.
-- Gäller även inaktiva produkter, så att texterna inte kommer tillbaka.
CREATE FUNCTION pg_temp.fix_made_in(t text) RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT btrim(regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(
    replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(t,
      ' Tillverkningen sker i Sverige i mindre batcher, vilket ger god kontroll över produktionskedjan, hög färskhet och minimal miljöpåverkan genom lokal produktion och återvinningsbara pappersförpackningar.', ''),
      'Extraktet är standardiserat och packas i Sverige.', 'Extraktet är standardiserat.'),
      'Extraktet är standardiserat och renhetstestat innan det packas i Sverige.', 'Extraktet är standardiserat.'),
      'Tillverkad i Sverige i små batcher och packad i', 'Packad i'),
      'värdesätter kvalitet och svenska tillverkningsstandarder', 'värdesätter kvalitet och ett svenskt varumärke'),
      ', tillverkad i Sverige för högsta kvalitet och fri från', ', fri från'),
      ' och 450 mg per kapsel, tillverkad i Sverige, får du', ' och 450 mg per kapsel får du'),
      'Dess rena formulering, tillverkad i Sverige, säkerställer', 'Dess rena formulering säkerställer'),
      ', tillverkad i Sverige utan tillsatser', ' utan tillsatser'),
      'Kapslarna tillverkas och packas i plastburk i Sverige.', 'Kapslarna levereras i plastburk.'),
    'Tillverkad i Sverige i små batcher enligt europeiska krav på säkerhet och (hållbarhet|kvalitet), förpackad i', 'Utvecklad i Sverige, förpackad i', 'g'),
    'Tillverkad i Sverige', 'Utvecklad i Sverige', 'g'),
    'Tillverkat i Sverige', 'Utvecklat i Sverige', 'g'),
    'tillverkade i Sverige', 'utvecklade i Sverige', 'g'),
    'tillverkat i Sverige', 'utvecklat i Sverige', 'g'),
    'tillverkad i Sverige', 'utvecklad i Sverige', 'g'))
$$;

CREATE FUNCTION pg_temp.fix_made_in(a text[]) RETURNS text[] LANGUAGE sql IMMUTABLE AS $$
  SELECT ARRAY(SELECT x FROM (SELECT pg_temp.fix_made_in(d) AS x, n FROM unnest(a) WITH ORDINALITY u(d, n)) s
               WHERE x <> '' ORDER BY n)
$$;

UPDATE public.products
SET short = pg_temp.fix_made_in(short),
    bullets = pg_temp.fix_made_in(bullets),
    description = pg_temp.fix_made_in(description)
WHERE concat_ws(' ', short, array_to_string(bullets, ' '), array_to_string(description, ' ')) ~* '(tillverk|packas i Sverige)';

UPDATE public.bundles
SET short = pg_temp.fix_made_in(short),
    description = pg_temp.fix_made_in(description),
    seo_title = pg_temp.fix_made_in(seo_title),
    seo_description = pg_temp.fix_made_in(seo_description)
WHERE concat_ws(' ', short, array_to_string(description, ' '), seo_title, seo_description) ~* 'tillverk';

UPDATE public.bundle_components SET blurb = pg_temp.fix_made_in(blurb) WHERE blurb ~* 'tillverk';
