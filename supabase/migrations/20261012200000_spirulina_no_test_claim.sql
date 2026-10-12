-- Spirulina: "testas för tungmetaller" går inte att belägga med analysintyg – borttaget (Merchant Center, felaktig framställning).
update public.products
set description = array_replace(description,
      'Vår spirulina pressas till tabletter utan tillsatta bindemedel och testas för tungmetaller.',
      'Vår spirulina pressas till tabletter utan tillsatta bindemedel.'),
    updated_at = now()
where slug = 'spirulina';
