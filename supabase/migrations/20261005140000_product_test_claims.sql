-- Merchant Center: ostyrkta testpåståenden i produkttexterna (även inaktiva produkter, så att de inte kommer tillbaka).
UPDATE public.products p
SET description = ARRAY(
  SELECT d FROM (
    SELECT replace(replace(replace(replace(replace(d,
      'Vårt extrakt kommer enbart från roten och är tredjepartstestat för renhet och innehåll.', 'Vårt extrakt kommer enbart från roten.'),
      'Renhetstestad för tungmetaller innan varje lansering.', ''),
      'Extraktet är standardiserat och renhetstestat innan det packas i Sverige.', 'Extraktet är standardiserat och packas i Sverige.'),
      'Vårt extrakt är standardiserat och testat av tredje part för renhet och innehåll.', 'Vårt extrakt är standardiserat.'),
      'Vårt extrakt är standardiserat och analyserat av oberoende laboratorium.', 'Vårt extrakt är standardiserat.') AS d, n
    FROM unnest(p.description) WITH ORDINALITY u(d, n)
  ) x WHERE btrim(d) <> '' ORDER BY n)
WHERE EXISTS (SELECT 1 FROM unnest(p.description) d WHERE d ~* '(tredjepart|renhetstest|oberoende laboratori)');
