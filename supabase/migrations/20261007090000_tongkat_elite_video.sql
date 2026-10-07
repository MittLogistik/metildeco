-- Ny produktvideo för Tongkat Ali Elite: H.264 1080×1080 utan ljud (den gamla var 7,7 MB), med stillbild ur videon.
UPDATE public.products
SET video_url = '/media/tongkat-ali-elite/1791361938513-produktvideo.mp4',
    video_poster_url = '/media/tongkat-ali-elite/1791361938513-produktvideo-poster.jpg',
    updated_at = now()
WHERE slug = 'tongkat-ali-elite';
