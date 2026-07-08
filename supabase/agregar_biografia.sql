-- =====================================================================
-- princesa-Mile — Tablas para la página "Quién es"
-- Pégalo completo en el SQL Editor de Supabase y dale Run.
-- Esto hace que TODO lo que se muestra en "Quién es" (nombre, frase,
-- biografía, rasgos, curiosidades) venga de la base de datos, igual que
-- el resto del sitio. Los "gustos" ya vivían en la tabla `gustos`, que
-- ya estaba sembrada con contenido real — aquí solo se conecta esa
-- sección en el código, no hace falta tocar esa tabla.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabla: biografia (fila única, igual que "configuracion")
-- ---------------------------------------------------------------------
create table if not exists biografia (
  id int primary key default 1,
  nombre text not null default 'Milena Vargas',
  apodo text,
  frase_corta text not null default '',
  bio text not null default '',
  updated_at timestamptz not null default now(),
  constraint biografia_singleton check (id = 1)
);

-- ---------------------------------------------------------------------
-- Tabla: rasgos (chips de personalidad debajo de la biografía)
-- ---------------------------------------------------------------------
create table if not exists rasgos (
  id uuid primary key default gen_random_uuid(),
  texto text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: curiosidades (tarjetas con emoji + texto)
-- ---------------------------------------------------------------------
create table if not exists curiosidades (
  id uuid primary key default gen_random_uuid(),
  emoji text not null default '✨',
  texto text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_rasgos_orden on rasgos (orden);
create index if not exists idx_curiosidades_orden on curiosidades (orden);

-- ---------------------------------------------------------------------
-- Row Level Security (mismo criterio que el resto del esquema:
-- lectura pública, escritura solo autenticada)
-- ---------------------------------------------------------------------
alter table biografia enable row level security;
alter table rasgos enable row level security;
alter table curiosidades enable row level security;

create policy "lectura publica" on biografia for select using (true);
create policy "lectura publica" on rasgos for select using (true);
create policy "lectura publica" on curiosidades for select using (true);

create policy "escritura autenticada" on biografia for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on rasgos for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on curiosidades for all using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- Contenido real (el que antes vivía hardcodeado en el código)
-- ---------------------------------------------------------------------
insert into biografia (id, nombre, apodo, frase_corta, bio)
values (
  1,
  'Milena Vargas',
  'Princesa',
  'Es de esas personas que llegan sin hacer ruido... y terminan cambiando todo.',
  E'Milena Vargas es una señorita oriunda de Boyacá, que ha vivido toda su vida en Floresta. Le encantan los animales, la política y una buena pelea de vez en cuando — tiene un carácter fuerte y no se queda callada ante nada.\n\nPero detrás de ese carácter hay una niña muy cariñosa, que se ganó mi corazón poco a poco, sin prisa, hasta convertirse en una de las personas más importantes de mi vida.'
)
on conflict (id) do update set
  nombre = excluded.nombre,
  apodo = excluded.apodo,
  frase_corta = excluded.frase_corta,
  bio = excluded.bio,
  updated_at = now();

delete from rasgos;
insert into rasgos (texto, orden) values
  ('Cariñosa', 1),
  ('Peleona', 2),
  ('Apasionada', 3),
  ('Amante de los animales', 4),
  ('Auténtica', 5),
  ('Boyacense de corazón', 6);

delete from curiosidades;
insert into curiosidades (emoji, texto, orden) values
  ('🐾', 'Ama a los animales más que a casi nada', 1),
  ('🏞️', 'Toda su vida en Floresta, Boyacá', 2),
  ('🗣️', 'Le encanta la política y defender lo que piensa', 3),
  ('⚔️', 'No le teme a una buena pelea', 4);

-- ---------------------------------------------------------------------
-- Limpieza: la sección "Libro" se quitó de la app. Estas filas de
-- capsulas (tipo 'capitulo') ya no se muestran en ningún lado.
-- ---------------------------------------------------------------------
delete from capsulas where tipo = 'capitulo';

-- =====================================================================
-- Fin del script
-- =====================================================================
