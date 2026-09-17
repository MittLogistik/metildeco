UPDATE public.products SET
  short = 'Nässelblad 10:1 bladextrakt, 430 mg per kapsel.',
  bullets = ARRAY['10:1 extrakt av nässelblad','430 mg per kapsel','60 kapslar – 60 dagar','Vegansk kapsel, tillverkad i Sverige'],
  description = ARRAY['Brännässla (Urtica dioica) är en traditionell växt i europeisk örtanvändning. Vi använder bladen, som torkas och koncentreras till ett 10:1-extrakt – 430 mg per kapsel. Endast nässelbladsextrakt i ett växtbaserat kapselskal. Veganskt, glutenfritt och utan GMO, utan bindemedel, fyllnadsmedel, sötningsmedel eller konstgjorda konserveringsmedel. Tillverkad i Sverige och packad i en återförslutningsbar, återvinningsbar pappersbaserad påse.'],
  updated_at = now()
WHERE slug = 'nasselblad';