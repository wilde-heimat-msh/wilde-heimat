-- Migration: Fund-Fotos (form-uploads/) nicht mehr öffentlich lesbar
-- Im Supabase Dashboard: SQL Editor → Run

drop policy if exists "Public read uploads" on storage.objects;
drop policy if exists "Public read paten updates" on storage.objects;

create policy "Public read paten updates"
  on storage.objects for select
  using (
    bucket_id = 'uploads'
    and (storage.foldername(name))[1] = 'paten-updates'
  );

-- form-uploads/* ist danach nur noch per Service Role / Signed URLs erreichbar.
