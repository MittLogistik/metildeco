UPDATE public.products SET
  name = 'Tongkat Ali Ultra | 60 kapslar',
  short = '200:1 rotextrakt, 450 mg per kapsel – tillverkad i Sverige.',
  bullets = ARRAY['200:1 rotextrakt av Eurycoma longifolia','450 mg per kapsel – 1 kapsel dagligen','Vegansk kapsel, utan tillsatser','60 kapslar – räcker 60 dagar'],
  description = ARRAY['Tongkat Ali Ultra är ett koncentrerat 200:1-extrakt av roten från Eurycoma longifolia, även kallad Malaysian Ginseng eller Longjack.','Rent rotextrakt i vegansk kapsel – utan bindemedel, fyllnadsmedel eller konstgjorda tillsatser. Tillverkad i Sverige och packad i återförslutningsbar, återvinningsbar påse.'],
  updated_at = now()
WHERE slug = 'tongkat-premium';