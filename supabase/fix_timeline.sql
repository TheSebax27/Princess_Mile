-- Reemplaza el contenido de la tabla timeline con las fechas reales
delete from timeline;

insert into timeline (fecha, titulo, descripcion, icono, orden) values
  ('2026-05-14', 'El primer mensaje', 'Todo empezó con una conversación que no queríamos que terminara.', '💬', 1),
  ('2026-05-22', 'La primera vez que nos vimos', 'Nervios, risas y la certeza de que valía la pena.', '🌷', 2),
  ('2026-08-01', 'Spider-Man: Brand New Day', 'Plan pendiente: verla juntos en el cine.', '🎬', 3),
  ('2026-08-31', 'Cumpleaños de Milena', 'Su día. A celebrarla como se merece.', '🎂', 4);
