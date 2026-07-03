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
  form_submission_id uuid references public.form_submissions (id) on delete set null,
  anschrift text,
  telefon text,
  urkunden_nr text,
  ausgestellt_am date,
  is_gift boolean not null default false,
  beschenkter_name text,
  beschenkter_anschrift text,
  grussbotschaft text,
  widerruf_bestaetigt_at timestamptz,
  datenschutz_bestaetigt_at timestamptz,
  patenschaft_start date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists patenschaft_paten_access_code_idx
  on public.patenschaft_paten (upper(trim(access_code)));

create unique index if not exists patenschaft_paten_form_submission_idx
  on public.patenschaft_paten (form_submission_id)
  where form_submission_id is not null;

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

-- Waschbär-Profile & Galerie (Admin-Verwaltung)
create table if not exists public.waschbaeren (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  aufgenommen text not null default '',
  eigenschaften text[] not null default '{}',
  kurztext text not null default '',
  geschichte text not null default '',
  charakter text not null default '',
  farbe text not null default 'from-neutral-700 to-neutral-500',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists waschbaeren_slug_idx on public.waschbaeren (slug);
create index if not exists waschbaeren_sort_idx on public.waschbaeren (sort_order, name);

create table if not exists public.waschbaer_gallery (
  id uuid primary key default gen_random_uuid(),
  waschbaer_id uuid not null references public.waschbaeren (id) on delete cascade,
  src text not null,
  alt text not null default '',
  width int not null default 768,
  height int not null default 1024,
  caption text,
  featured boolean not null default false,
  object_position text not null default 'center center',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists waschbaer_gallery_waschbaer_idx
  on public.waschbaer_gallery (waschbaer_id, sort_order);

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

drop trigger if exists waschbaeren_updated_at on public.waschbaeren;
create trigger waschbaeren_updated_at
  before update on public.waschbaeren
  for each row execute function public.set_updated_at();

-- RLS: Zugriff nur über Service Role (Next.js API)
alter table public.patenschaft_paten enable row level security;
alter table public.patenschaft_updates enable row level security;
alter table public.form_submissions enable row level security;
alter table public.waschbaeren enable row level security;
alter table public.waschbaer_gallery enable row level security;

-- Storage: Im Dashboard unter Storage → New bucket
-- Name: uploads
-- Public bucket: yes (Paten-Update-Fotos öffentlich; Fund-Fotos nur per Signed URL)
-- Ordner: paten-updates/ (öffentlich), waschbaeren/ (öffentlich), form-uploads/ (privat)

-- Optional: Bucket per SQL anlegen (falls noch nicht vorhanden)
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

-- Öffentlicher Lesezugriff auf Paten-Update- und Waschbär-Fotos
drop policy if exists "Public read uploads" on storage.objects;
drop policy if exists "Public read paten updates" on storage.objects;
drop policy if exists "Public read waschbaeren uploads" on storage.objects;
create policy "Public read paten and waschbaeren uploads"
  on storage.objects for select
  using (
    bucket_id = 'uploads'
    and (storage.foldername(name))[1] in ('paten-updates', 'waschbaeren')
  );

-- Schreibzugriff nur über Service Role (Next.js API)
drop policy if exists "Service role write uploads" on storage.objects;
create policy "Service role write uploads"
  on storage.objects for insert
  with check (bucket_id = 'uploads');
