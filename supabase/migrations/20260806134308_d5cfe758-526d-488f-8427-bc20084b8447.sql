UPDATE public.products SET sku = v.sku FROM (VALUES
  ('trippel-magnesium','MET-MAG-001'),
  ('kvallsmagnesium','MET-MAG-002'),
  ('premium-d3-vitamin-4000-ie','MET-D3-001'),
  ('krill-omega-3','MET-OM3-001'),
  ('trippel-zink','MET-ZNK-001'),
  ('smart-multi','MET-MUL-001'),
  ('kollagen-beauty','MET-KOL-001'),
  ('premium-complex-b-vitamin','MET-BVI-001'),
  ('electrolyte-powder-lemon-lime-240g-bag','MET-ELE-LL-240'),
  ('electrolyte-powder-lemon-lime-120g-can','MET-ELE-LL-120'),
  ('electrolyte-powder-mango-orange-240g-bag','MET-ELE-MO-240'),
  ('electrolyte-powder-mango-orange-120g-can','MET-ELE-MO-120'),
  ('electrolyte-powder-wild-berries-240g-bag','MET-ELE-WB-240'),
  ('electrolyte-powder-wild-berries-120g-can','MET-ELE-WB-120')
) AS v(slug, sku)
WHERE public.products.slug = v.slug AND (public.products.sku IS NULL OR public.products.sku = '');