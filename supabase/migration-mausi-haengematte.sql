-- Hängematten-Foto von Pedro zu Mausi verschieben
-- Im Supabase Dashboard: SQL Editor → Run

update public.waschbaer_gallery g
set
  waschbaer_id = mausi.id,
  alt = 'Mausi genießt einen Snack in ihrer Hängematte',
  caption = 'Mausi – die Queen in ihrer Hängematte, mit vollem Genuss und einem verschmusten Lächeln.',
  sort_order = 3
from public.waschbaeren pedro, public.waschbaeren mausi
where g.waschbaer_id = pedro.id
  and pedro.slug = 'pedro'
  and mausi.slug = 'mausi'
  and g.src like '%pedro-portrait%';
