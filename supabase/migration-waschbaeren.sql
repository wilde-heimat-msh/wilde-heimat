-- Waschbär-Profile & Galerie (Admin-Verwaltung)
-- Im Supabase Dashboard: SQL Editor → Run

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

alter table public.waschbaeren enable row level security;
alter table public.waschbaer_gallery enable row level security;

-- Öffentliche Waschbär-Fotos lesbar (wie paten-updates)
drop policy if exists "Public read waschbaeren uploads" on storage.objects;
create policy "Public read waschbaeren uploads"
  on storage.objects for select
  using (
    bucket_id = 'uploads'
    and (storage.foldername(name))[1] in ('paten-updates', 'waschbaeren')
  );
