-- Bildunterschrift Hängematten-Foto: Mausi ist Queen, nicht Anführerin (Pedro ist Chef der Gruppe)
-- Im Supabase Dashboard: SQL Editor → Run

update public.waschbaer_gallery g
set caption = 'Mausi – die Queen in ihrer Hängematte, mit vollem Genuss und einem verschmusten Lächeln.'
from public.waschbaeren w
where g.waschbaer_id = w.id
  and w.slug = 'mausi'
  and g.src like '%pedro-portrait%';
