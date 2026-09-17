UPDATE public.products SET
  name = 'Tongkat Ali Elite | 60 kapslar',
  short = '200:1 rotextrakt, 450 mg per kapsel – tillverkad i Sverige.',
  bullets = ARRAY['200:1 rotextrakt av Eurycoma longifolia','450 mg per kapsel – 1 kapsel dagligen','Vegansk kapsel, utan tillsatser','60 kapslar – räcker 60 dagar'],
  description = ARRAY['Tongkat Ali Elite är ett koncentrerat 200:1-extrakt av roten från Eurycoma longifolia, även kallad Malaysian Ginseng eller Longjack.','Rent rotextrakt i vegansk kapsel – utan bindemedel, fyllnadsmedel eller konstgjorda tillsatser. Tillverkad i Sverige och packad i återförslutningsbar, återvinningsbar påse.'],
  updated_at = now()
WHERE slug = 'tongkat-ali-elite';

UPDATE public.products SET
  name = 'Tongkat Ali Ultra | 60 kapslar',
  short = 'Klassiskt rotextrakt av Eurycoma longifolia i ren, standardiserad form.',
  bullets = ARRAY['200:1 standardiserat rotextrakt','Endast rot – inga fyllnadsmedel','Tredjepartstestad varje batch','400 mg per dagsdos'],
  description = ARRAY['Tongkat Ali Ultra är ett rotextrakt av Eurycoma longifolia, odlad och skördad i Sydostasien.','Vi använder enbart roten och en vattenbaserad extraktion, utan lösningsmedel eller onödiga tillsatser.'],
  updated_at = now()
WHERE slug = 'tongkat-premium';