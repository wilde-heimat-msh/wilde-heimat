-- Wilde Heimat – Supabase Schema
-- Im Supabase Dashboard: SQL Editor → New query → Run

-- Paten / Patinnen
create table if not exists public.patenschaft_paten (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  access_code text not null,
  waschbaer_slug text not null,
  stufe_id text not null check (stufe_id in ('bronze', 'silber', 'gold')),
  active boolean not null default true,
  email text,
  notiz text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists patenschaft_paten_access_code_idx
  on public.patenschaft_paten (upper(trim(access_code)));

-- Updates für Paten
create table if not exists public.patenschaft_updates (
  id uuid primary key default gen_random_uuid(),
  waschbaer_slug text not null,
  min_stufe text not null check (min_stufe in ('bronze', 'silber', 'gold')),
  patron_id uuid references public.patenschaft_paten (id) on delete set null,
  title text not null,
  body text not null,
  image_urls text[] not null default '{}',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patenschaft_updates_waschbaer_idx
  on public.patenschaft_updates (waschbaer_slug, published_at desc);

-- Formular-Eingänge (Kontakt, Fund, Patenschaft, …)
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  payload jsonb not null default '{}',
  reply_to text,
  attachment_url text,
  created_at timestamptz not null default now()
);

create index if not exists form_submissions_type_created_idx
  on public.form_submissions (type, created_at desc);

-- updated_at Trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists patenschaft_paten_updated_at on public.patenschaft_paten;
create trigger patenschaft_paten_updated_at
  before update on public.patenschaft_paten
  for each row execute function public.set_updated_at();

drop trigger if exists patenschaft_updates_updated_at on public.patenschaft_updates;
create trigger patenschaft_updates_updated_at
  before update on public.patenschaft_updates
  for each row execute function public.set_updated_at();

-- RLS: Zugriff nur über Service Role (Next.js API)
alter table public.patenschaft_paten enable row level security;
alter table public.patenschaft_updates enable row level security;
alter table public.form_submissions enable row level security;

-- Storage: Im Dashboard unter Storage → New bucket
-- Name: uploads
-- Public bucket: yes (für Paten-Fotos in Updates)
-- Erlaubte Ordner: paten-updates/, form-uploads/

-- Optional: Bucket per SQL anlegen (falls noch nicht vorhanden)
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

-- Öffentlicher Lesezugriff auf hochgeladene Bilder
drop policy if exists "Public read uploads" on storage.objects;
create policy "Public read uploads"
  on storage.objects for select
  using (bucket_id = 'uploads');

-- Schreibzugriff nur über Service Role (Next.js API)
drop policy if exists "Service role write uploads" on storage.objects;
create policy "Service role write uploads"
  on storage.objects for insert
  with check (bucket_id = 'uploads');
