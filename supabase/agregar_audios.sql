-- =====================================================================
-- princesa-Mile — Tabla + bucket de Storage para la sección "Audios"
-- Pégalo completo en el SQL Editor de Supabase (Project > SQL Editor >
-- New query) y dale Run. Después de correrlo, la sección "Audios" del
-- sitio va a poder guardar, listar y eliminar audios.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabla: audios
-- ---------------------------------------------------------------------
create table if not exists audios (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  url text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_audios_orden on audios (orden);

-- ---------------------------------------------------------------------
-- Row Level Security
-- Nota: a diferencia de lo que documenta supabase/schema.sql ("escritura
-- autenticada"), este sitio no usa Supabase Auth real (no hay login, solo
-- un código de acceso local) — la app siempre escribe con la anon key.
-- Por eso, igual que ya funciona en la práctica para `galeria` y `planes`,
-- acá se deja lectura Y escritura públicas: el acceso al sitio ya está
-- protegido por el link + código de acceso opcional (VITE_ACCESS_CODE).
-- ---------------------------------------------------------------------
alter table audios enable row level security;

create policy "lectura publica" on audios for select using (true);
create policy "escritura publica" on audios for all using (true) with check (true);

-- ---------------------------------------------------------------------
-- Storage: bucket público para los archivos de audio
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('audios-files', 'audios-files', true)
on conflict (id) do nothing;

create policy "audios lectura publica" on storage.objects
  for select using (bucket_id = 'audios-files');

create policy "audios subida publica" on storage.objects
  for insert with check (bucket_id = 'audios-files');

create policy "audios eliminacion publica" on storage.objects
  for delete using (bucket_id = 'audios-files');

-- =====================================================================
-- Fin del script
-- =====================================================================
