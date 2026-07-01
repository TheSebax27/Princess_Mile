-- =====================================================================
-- Mensajes: motivacionales (como "Mensaje del día") + un par de burla
-- =====================================================================

delete from mensajes;

insert into mensajes (titulo, contenido, fecha, leido) values
  (
    'Mensaje del día',
    'Hoy solo quería decirte que, sin importar cuánto ruido tenga el día, siempre hay un momento en el que pienso en ti.',
    '2026-05-22', true
  ),
  (
    'Para cuando estés cansada',
    'Sé que a veces el día se siente largo y pesado, pero también sé que eres de las que no se rinde fácil. Ese carácter tuyo tarde o temprano siempre gana.',
    '2026-05-27', true
  ),
  (
    'Sigue así',
    'Cada vez que defiendes lo que piensas, aunque sea peleando, me recuerda por qué te admiro tanto. No cambies eso por nadie.',
    '2026-06-01', true
  ),
  (
    'Un empujoncito',
    'Si hoy sientes que nada sale como quieres, respira. Mañana es otro día y tú sabes salir adelante mejor que nadie que conozco.',
    '2026-06-05', true
  ),
  (
    'De burla #1',
    'Ya perdí la cuenta de cuántas veces has dicho "esta vez sí gana Nacional". Un día de estos vas a tener razón, ánimo.',
    '2026-06-09', true
  ),
  (
    'Recordatorio',
    'Eres capaz de mucho más de lo que crees, incluso en los días en los que dudas de todo. Yo sí te veo.',
    '2026-06-13', true
  ),
  (
    'De burla #2',
    'Te da rabia perder una discusión de política tanto como a un perro le da rabia el agua. Ahí lo dejo.',
    '2026-06-17', true
  ),
  (
    'Para tus días difíciles',
    'No tienes que tenerlo todo resuelto hoy. Con que sigas intentando ya vas ganando.',
    '2026-06-21', true
  ),
  (
    'De burla #3',
    'Le hablas más bonito a cualquier animal que se te cruce que a mí en las mañanas. Voy a tener que competirle a un gato.',
    '2026-06-25', false
  ),
  (
    'Sin razón especial',
    'Solo quería recordarte que vales mucho, incluso en los días en los que nadie te lo dice.',
    '2026-07-01', false
  );

-- ---------------------------------------------------------------------
-- Dos mensajes nuevos, bonitos, forzados como número 1 y 2
-- ---------------------------------------------------------------------
delete from mensajes where numero in (1, 2);

insert into mensajes (numero, titulo, contenido, fecha, leido) values
  (
    1,
    'Lo simple también cuenta',
    'No necesito que pase algo grande para pensar en ti. A veces basta con un rato tranquilo del día para que aparezcas en mi cabeza.',
    '2026-05-22', true
  ),
  (
    2,
    'Gracias por estar',
    'Contigo las cosas se sienten más livianas, aunque el día no haya sido el mejor. Eso ya dice mucho de lo que significas.',
    '2026-05-23', true
  );
