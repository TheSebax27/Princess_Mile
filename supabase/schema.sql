-- =====================================================================
-- princesa-Mile — Esquema de base de datos para Supabase
-- =====================================================================
-- Cómo usar:
-- 1. Entra a tu proyecto en https://supabase.com/dashboard
-- 2. Ve a "SQL Editor" > "New query"
-- 3. Pega este archivo completo y dale "Run"
-- 4. Copia la URL y la anon key desde Project Settings > API a tu .env
-- =====================================================================

-- Extensión necesaria para generar UUIDs
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tabla: configuracion (fila única con los datos generales del sitio)
-- ---------------------------------------------------------------------
create table if not exists configuracion (
  id int primary key default 1,
  nombre_visitante text not null default 'Sebastián',
  nombre_ella text not null default 'Mile',
  lema text not null default 'Un lugar donde cada recuerdo encuentra su espacio.',
  updated_at timestamptz not null default now(),
  constraint configuracion_singleton check (id = 1)
);

-- ---------------------------------------------------------------------
-- Tabla: biografia (fila única con los datos de la página "Quién es")
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
-- Tabla: rasgos (chips de personalidad en "Quién es")
-- ---------------------------------------------------------------------
create table if not exists rasgos (
  id uuid primary key default gen_random_uuid(),
  texto text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: curiosidades (tarjetas con emoji + texto en "Quién es")
-- ---------------------------------------------------------------------
create table if not exists curiosidades (
  id uuid primary key default gen_random_uuid(),
  emoji text not null default '✨',
  texto text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: usuarios (opcional, si más adelante quieres login con Supabase Auth)
-- ---------------------------------------------------------------------
create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid references auth.users(id) on delete set null,
  nombre text not null,
  rol text not null default 'visitante' check (rol in ('admin', 'visitante')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: mensajes (cartas cortas, tipo "sobres")
-- ---------------------------------------------------------------------
create table if not exists mensajes (
  id uuid primary key default gen_random_uuid(),
  numero serial,
  titulo text not null,
  contenido text not null,
  fecha date not null default current_date,
  leido boolean not null default false,
  fecha_programada date, -- para cartas programadas a futuro (función futura)
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: cartas (cartas largas / especiales, separadas de mensajes cortos)
-- ---------------------------------------------------------------------
create table if not exists cartas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  contenido text not null,
  fecha date not null default current_date,
  ocasion text, -- ej: "cumpleaños", "aniversario"
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: galeria (fotos)
-- ---------------------------------------------------------------------
create table if not exists galeria (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  titulo text,
  descripcion text,
  fecha date,
  ancho int not null default 600,
  alto int not null default 800,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: playlist (canciones)
-- ---------------------------------------------------------------------
create table if not exists playlist (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  artista text not null,
  portada_url text,
  audio_url text, -- URL pública de Supabase Storage
  duracion int not null default 0, -- en segundos
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: categorias (para clasificar gustos)
-- ---------------------------------------------------------------------
create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique
);

-- ---------------------------------------------------------------------
-- Tabla: gustos
-- ---------------------------------------------------------------------
create table if not exists gustos (
  id uuid primary key default gen_random_uuid(),
  categoria text not null,
  nombre text not null,
  icono text not null default '⭐',
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: frases (frases cortas que rotan en el dashboard)
-- ---------------------------------------------------------------------
create table if not exists frases (
  id uuid primary key default gen_random_uuid(),
  texto text not null,
  activa boolean not null default true
);

-- ---------------------------------------------------------------------
-- Tabla: razones ("razones por las que te quiero")
-- ---------------------------------------------------------------------
create table if not exists razones (
  id uuid primary key default gen_random_uuid(),
  numero serial,
  texto text not null,
  emoji text not null default '❤️',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: timeline (línea de tiempo / fechas importantes)
-- ---------------------------------------------------------------------
create table if not exists timeline (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  titulo text not null,
  descripcion text,
  icono text default '❤️',
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: capsulas (contenido tipo "sorpresa"/regalo, desbloqueable por fecha).
-- El tipo 'capitulo' quedó del antiguo apartado "Libro" (ya eliminado de
-- la app); se deja en el check por compatibilidad, pero no se usa.
-- ---------------------------------------------------------------------
create table if not exists capsulas (
  id uuid primary key default gen_random_uuid(),
  tipo text not null default 'capitulo' check (tipo in ('capitulo', 'sorpresa')),
  orden int not null default 0,
  titulo text not null,
  contenido text,
  descripcion text,
  fecha_desbloqueo date,
  desbloqueada boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: secretos (contenido bloqueado hasta una fecha o código)
-- ---------------------------------------------------------------------
create table if not exists secretos (
  id uuid primary key default gen_random_uuid(),
  titulo text,
  contenido text,
  fecha_desbloqueo date not null,
  codigo_desbloqueo text,
  desbloqueado boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: visitas (para llevar registro de cuándo entra al sitio)
-- ---------------------------------------------------------------------
create table if not exists visitas (
  id uuid primary key default gen_random_uuid(),
  visitado_en timestamptz not null default now(),
  pagina text,
  user_agent text
);

-- ---------------------------------------------------------------------
-- Tabla: notificaciones
-- ---------------------------------------------------------------------
create table if not exists notificaciones (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  mensaje text,
  leida boolean not null default false,
  fecha_programada timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: favoritos (marcar fotos, mensajes o canciones como favoritas)
-- ---------------------------------------------------------------------
create table if not exists favoritos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('mensaje', 'foto', 'cancion', 'razon')),
  referencia_id uuid not null,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Índices útiles
-- =====================================================================
create index if not exists idx_mensajes_fecha on mensajes (fecha desc);
create index if not exists idx_galeria_orden on galeria (orden);
create index if not exists idx_playlist_orden on playlist (orden);
create index if not exists idx_timeline_fecha on timeline (fecha);
create index if not exists idx_capsulas_tipo_orden on capsulas (tipo, orden);
create index if not exists idx_favoritos_tipo on favoritos (tipo, referencia_id);
create index if not exists idx_rasgos_orden on rasgos (orden);
create index if not exists idx_curiosidades_orden on curiosidades (orden);

-- =====================================================================
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------
-- Este es un sitio privado para dos personas, así que la forma más simple
-- y segura de manejarlo es: lectura pública permitida solo con la anon key
-- (que nunca debes compartir fuera del link de tu app), y escritura
-- restringida a usuarios autenticados. Si prefieres administrar el
-- contenido tú mismo desde el SQL Editor o el Table Editor de Supabase
-- (recomendado para este proyecto), puedes dejar la escritura cerrada
-- por completo y usar el dashboard de Supabase como tu "panel admin".
-- =====================================================================

alter table configuracion enable row level security;
alter table biografia enable row level security;
alter table rasgos enable row level security;
alter table curiosidades enable row level security;
alter table usuarios enable row level security;
alter table mensajes enable row level security;
alter table cartas enable row level security;
alter table galeria enable row level security;
alter table playlist enable row level security;
alter table categorias enable row level security;
alter table gustos enable row level security;
alter table frases enable row level security;
alter table razones enable row level security;
alter table timeline enable row level security;
alter table capsulas enable row level security;
alter table secretos enable row level security;
alter table visitas enable row level security;
alter table notificaciones enable row level security;
alter table favoritos enable row level security;

-- Lectura pública (vía anon key) para todo el contenido "de cara al público"
create policy "lectura publica" on configuracion for select using (true);
create policy "lectura publica" on biografia for select using (true);
create policy "lectura publica" on rasgos for select using (true);
create policy "lectura publica" on curiosidades for select using (true);
create policy "lectura publica" on mensajes for select using (true);
create policy "lectura publica" on cartas for select using (true);
create policy "lectura publica" on galeria for select using (true);
create policy "lectura publica" on playlist for select using (true);
create policy "lectura publica" on categorias for select using (true);
create policy "lectura publica" on gustos for select using (true);
create policy "lectura publica" on frases for select using (true);
create policy "lectura publica" on razones for select using (true);
create policy "lectura publica" on timeline for select using (true);
create policy "lectura publica" on capsulas for select using (true);
create policy "lectura publica" on favoritos for select using (true);

-- Secretos: solo se puede leer si ya está desbloqueado o si la fecha ya llegó
create policy "lectura de secretos si desbloqueado" on secretos
  for select using (desbloqueado = true or fecha_desbloqueo <= current_date);

-- Inserciones anónimas permitidas solo para el registro de visitas
create policy "insertar visitas" on visitas for insert with check (true);

-- Todo lo demás (insert/update/delete) queda reservado a usuarios
-- autenticados. Como este proyecto normalmente lo administras tú mismo,
-- la forma más simple es usar el Table Editor de Supabase directamente
-- (que usa tu rol de servicio, no la anon key, así que ignora RLS).
create policy "escritura autenticada" on mensajes for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on cartas for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on galeria for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on playlist for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on gustos for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on razones for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on timeline for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on capsulas for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on secretos for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on configuracion for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on biografia for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on rasgos for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on curiosidades for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on notificaciones for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on favoritos for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on usuarios for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on frases for all using (auth.role() = 'authenticated');
create policy "escritura autenticada" on categorias for all using (auth.role() = 'authenticated');

-- =====================================================================
-- Datos iniciales de ejemplo (puedes editarlos o borrarlos luego)
-- =====================================================================

insert into configuracion (id, nombre_visitante, nombre_ella, lema)
values (1, 'Sebastián', 'Mile', 'Un lugar donde cada recuerdo encuentra su espacio.')
on conflict (id) do nothing;

insert into biografia (id, nombre, apodo, frase_corta, bio)
values (
  1,
  'Milena Vargas',
  'Princesa',
  'Es de esas personas que llegan sin hacer ruido... y terminan cambiando todo.',
  E'Milena Vargas es una señorita oriunda de Boyacá, que ha vivido toda su vida en Floresta.\n\nAma a los animales, la política y una buena pelea de vez en cuando.'
)
on conflict (id) do nothing;

insert into rasgos (texto, orden) values
  ('Cariñosa', 1),
  ('Peleona', 2),
  ('Apasionada', 3);

insert into curiosidades (emoji, texto, orden) values
  ('🐾', 'Ama a los animales más que a casi nada', 1),
  ('🏞️', 'Toda su vida en Floresta, Boyacá', 2);

insert into frases (texto) values
  ('Siempre hay algo nuevo para descubrir.'),
  ('Cada rincón de este lugar tiene un pedazo de nosotros.'),
  ('Hoy, como todos los días, pienso en ti.');

insert into mensajes (titulo, contenido, fecha, leido) values
  ('Mensaje del día', 'Hoy solo quería decirte que, sin importar cuánto ruido tenga el día, siempre hay un momento en el que pienso en ti.', current_date, false),
  ('Una carta cualquiera', 'No necesito una fecha especial para escribirte. A veces las mejores cartas nacen de un martes cualquiera.', current_date - 6, true);

insert into razones (texto, emoji) values
  ('Tu sonrisa', '❤️'),
  ('La forma en que te emocionas contando algo', '✨'),
  ('Tu paciencia conmigo', '🌷'),
  ('Cómo cuidas a las personas que quieres', '🫶');

insert into gustos (categoria, nombre, icono) values
  ('Animales', 'Gatos', '🐱'),
  ('Flores', 'Tulipanes', '🌷'),
  ('Hobbies', 'Leer', '📚'),
  ('Lugares', 'Cafeterías', '☕');

insert into timeline (fecha, titulo, descripcion, icono) values
  (current_date - 180, 'El primer mensaje', 'Todo empezó con una conversación que no queríamos que terminara.', '💬'),
  (current_date, 'Hoy', 'Un día más para sumar a la lista.', '❤️');

insert into capsulas (tipo, orden, titulo, descripcion, fecha_desbloqueo, desbloqueada) values
  ('sorpresa', 1, 'Carta sorpresa', 'Algo especial que preparé para un día cualquiera.', current_date, true);

-- =====================================================================
-- Fin del script
-- =====================================================================
