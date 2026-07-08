-- =====================================================================
-- princesa-Mile — Contenido real para todas las tablas
-- Pégalo completo en el SQL Editor de Supabase y dale Run.
-- Cada tabla se limpia primero (delete) para no dejar los datos de
-- ejemplo genéricos del schema.sql original mezclados con estos.
-- =====================================================================

-- ---------------------------------------------------------------------
-- configuracion
-- ---------------------------------------------------------------------
update configuracion
set nombre_visitante = 'mi niña hermosa',
    nombre_ella = 'Milena Vargas',
    lema = 'Un lugar donde cada recuerdo encuentra su espacio.',
    updated_at = now()
where id = 1;

insert into configuracion (id, nombre_visitante, nombre_ella, lema)
select 1, 'mi niña hermosa', 'Milena Vargas', 'Un lugar donde cada recuerdo encuentra su espacio.'
where not exists (select 1 from configuracion where id = 1);

-- ---------------------------------------------------------------------
-- usuarios
-- ---------------------------------------------------------------------
delete from usuarios;

insert into usuarios (nombre, rol) values
  ('Sebastián', 'admin'),
  ('Milena Vargas', 'visitante');

-- ---------------------------------------------------------------------
-- categorias
-- ---------------------------------------------------------------------
delete from categorias;

insert into categorias (nombre) values
  ('Animales'),
  ('Política'),
  ('Viajes'),
  ('Fútbol'),
  ('Comida'),
  ('Música');

-- ---------------------------------------------------------------------
-- frases (rotan en el dashboard)
-- ---------------------------------------------------------------------
delete from frases;

insert into frases (texto, activa) values
  ('Siempre hay algo nuevo para descubrir.', true),
  ('Floresta, Boyacá te vio crecer; yo tuve la suerte de verte florecer.', true),
  ('Peleona, pero mía.', true),
  ('Hoy, como todos los días, pienso en ti.', true);

-- ---------------------------------------------------------------------
-- mensajes
-- ---------------------------------------------------------------------
delete from mensajes;

insert into mensajes (titulo, contenido, fecha, leido) values
  ('El primer mensaje', 'No sabía que escribirte esa vez iba a cambiar todo. Desde ese 14 de mayo no he dejado de pensar en ti.', '2026-05-14', true),
  ('Después de verte', 'El 22 de mayo te vi por primera vez y confirmé lo que ya sospechaba: contigo todo es distinto.', '2026-05-22', true),
  ('Tu carácter', 'Me encanta que defiendas lo que piensas, que pelees por lo que crees justo, y que aun así seas tan cariñosa conmigo.', '2026-06-10', true),
  ('Floresta en mi cabeza', 'Cada vez que hablas de Floresta se te ilumina la cara. Algún día quiero conocer cada rincón que te vio crecer.', '2026-06-20', false),
  ('Falta poco', 'El 1 de agosto vamos a ver Spider-Man juntos, y contando los días para tu cumpleaños el 31. Este año va a ser especial.', '2026-07-01', false);

-- ---------------------------------------------------------------------
-- cartas (más largas, para ocasiones especiales)
-- ---------------------------------------------------------------------
delete from cartas;

insert into cartas (titulo, contenido, fecha, ocasion) values
  (
    'Para tu cumpleaños',
    'Milena, cada año que cumples es un año más que el mundo tiene la suerte de tenerte. Espero que este 31 de agosto se sienta tan especial como tú lo eres. Gracias por tu cariño, por tu fuerza, y por dejarme ser parte de tu historia.',
    '2026-08-31',
    'cumpleaños'
  ),
  (
    'Sobre nosotros',
    'Desde Floresta hasta donde sea que estemos, quiero que sepas que contigo todo se siente como en casa. Amas a los animales, defiendes tus ideas con todo, y aun así encuentras espacio para quererme como lo haces. No podría pedir más.',
    '2026-07-01',
    'aniversario'
  );

-- ---------------------------------------------------------------------
-- biografia, rasgos, curiosidades (página "Quién es")
-- ---------------------------------------------------------------------
update biografia
set nombre = 'Milena Vargas',
    apodo = 'Princesa',
    frase_corta = 'Es de esas personas que llegan sin hacer ruido... y terminan cambiando todo.',
    bio = E'Milena Vargas es una señorita oriunda de Boyacá, que ha vivido toda su vida en Floresta. Le encantan los animales, la política y una buena pelea de vez en cuando — tiene un carácter fuerte y no se queda callada ante nada.\n\nPero detrás de ese carácter hay una niña muy cariñosa, que se ganó mi corazón poco a poco, sin prisa, hasta convertirse en una de las personas más importantes de mi vida.',
    updated_at = now()
where id = 1;

insert into biografia (id, nombre, apodo, frase_corta, bio)
select 1, 'Milena Vargas', 'Princesa',
  'Es de esas personas que llegan sin hacer ruido... y terminan cambiando todo.',
  E'Milena Vargas es una señorita oriunda de Boyacá, que ha vivido toda su vida en Floresta. Le encantan los animales, la política y una buena pelea de vez en cuando — tiene un carácter fuerte y no se queda callada ante nada.\n\nPero detrás de ese carácter hay una niña muy cariñosa, que se ganó mi corazón poco a poco, sin prisa, hasta convertirse en una de las personas más importantes de mi vida.'
where not exists (select 1 from biografia where id = 1);

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
-- gustos
-- ---------------------------------------------------------------------
delete from gustos;

insert into gustos (categoria, nombre, icono, orden) values
  ('Política', 'Petro, presidente de Colombia', '🇨🇴', 1),
  ('Viajes', 'Ir a pueblos', '🏘️', 2),
  ('Personalidad', 'Que la traten bonito', '💐', 3),
  ('Fútbol', 'Atlético Nacional', '⚽', 4),
  ('Animales', 'Animales en general', '🐾', 5),
  ('Política', 'Debates y política', '🗳️', 6);

-- ---------------------------------------------------------------------
-- razones
-- ---------------------------------------------------------------------
delete from razones;

insert into razones (texto, emoji) values
  ('Tu carácter, aunque a veces peleemos', '⚔️'),
  ('Lo cariñosa que eres cuando bajas la guardia', '🫶'),
  ('Que defiendas lo que crees justo', '🗣️'),
  ('Tu amor por los animales', '🐾'),
  ('Que seas boyacense hasta la médula', '🏞️'),
  ('Ser hincha de Nacional con toda el alma', '💚');

-- ---------------------------------------------------------------------
-- timeline
-- ---------------------------------------------------------------------
delete from timeline;

insert into timeline (fecha, titulo, descripcion, icono, orden) values
  ('2026-05-14', 'El primer mensaje', 'Todo empezó con una conversación que no queríamos que terminara.', '💬', 1),
  ('2026-05-22', 'La primera vez que nos vimos', 'Nervios, risas y la certeza de que valía la pena.', '🌷', 2),
  ('2026-08-01', 'Spider-Man: Brand New Day', 'Plan pendiente: verla juntos en el cine.', '🎬', 3),
  ('2026-08-31', 'Cumpleaños de Milena', 'Su día. A celebrarla como se merece.', '🎂', 4);

-- ---------------------------------------------------------------------
-- capsulas (sorpresas desbloqueables por fecha)
-- ---------------------------------------------------------------------
delete from capsulas;

insert into capsulas (tipo, orden, titulo, descripcion, fecha_desbloqueo, desbloqueada) values
  ('sorpresa', 1, 'Spider-Man juntos', 'Plan para el 1 de agosto: verla en el cine, los dos.', '2026-08-01', false),
  ('sorpresa', 2, 'Sorpresa de cumpleaños', 'Algo especial preparado para el 31 de agosto.', '2026-08-31', false);

-- ---------------------------------------------------------------------
-- secretos
-- ---------------------------------------------------------------------
delete from secretos;

insert into secretos (titulo, contenido, fecha_desbloqueo, desbloqueado) values
  (
    'Para el día de tu cumpleaños',
    'Feliz cumpleaños, mi niña hermosa. Todo lo que hemos construido desde ese primer mensaje de mayo vale cada segundo. Te quiero, Milena.',
    '2026-08-31',
    false
  );

-- ---------------------------------------------------------------------
-- notificaciones
-- ---------------------------------------------------------------------
delete from notificaciones;

insert into notificaciones (titulo, mensaje, leida, fecha_programada) values
  ('Spider-Man se acerca', 'Falta poco para verla juntos en el cine — 1 de agosto.', false, '2026-07-25T09:00:00-05:00'),
  ('Cumpleaños de Milena', 'Su cumpleaños es el 31 de agosto. Ya sabes qué hacer.', false, '2026-08-24T09:00:00-05:00');

-- ---------------------------------------------------------------------
-- galeria y playlist
-- ---------------------------------------------------------------------
-- Nota: la app actualmente NO lee estas dos tablas (la galería usa fotos
-- locales en src/assets/gallery, y la playlist usa el reproductor embebido
-- de Spotify). Se dejan sembradas por si más adelante las vuelves a
-- conectar; no afectan lo que se ve en el sitio ahora mismo.

delete from galeria;

insert into galeria (url, titulo, descripcion, fecha, ancho, alto, orden) values
  ('https://picsum.photos/seed/milefloresta1/720/1280', 'Un día cualquiera', 'Recuerdo guardado', '2026-05-22', 720, 1280, 1),
  ('https://picsum.photos/seed/milefloresta2/1070/1070', 'Mirando el paisaje', 'Recuerdo guardado', '2026-06-05', 1070, 1070, 2);

delete from playlist;

insert into playlist (titulo, artista, portada_url, duracion, orden) values
  ('Perfect', 'Ed Sheeran', 'https://picsum.photos/seed/song1/200/200', 263, 1),
  ('La Bicicleta', 'Carlos Vives, Shakira', 'https://picsum.photos/seed/song3/200/200', 222, 2);

-- ---------------------------------------------------------------------
-- favoritos (marca algunos mensajes y razones como favoritos)
-- ---------------------------------------------------------------------
delete from favoritos;

insert into favoritos (tipo, referencia_id)
select 'mensaje', id from mensajes where titulo = 'El primer mensaje';

insert into favoritos (tipo, referencia_id)
select 'razon', id from razones where texto = 'Tu amor por los animales';

-- ---------------------------------------------------------------------
-- visitas
-- ---------------------------------------------------------------------
-- No necesita datos de ejemplo: se llena sola cada vez que alguien entra
-- al sitio (tabla de registro/log).

-- =====================================================================
-- Fin
-- =====================================================================
