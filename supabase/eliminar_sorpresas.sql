-- La sección "Sorpresas" se reemplazó por "Planes" (que ahora vive fuera
-- de Supabase, como archivos locales). Esto limpia las filas viejas tipo
-- "sorpresa" que quedaron en la tabla capsulas. Los capítulos del libro
-- (tipo 'capitulo') no se tocan.
delete from capsulas where tipo = 'sorpresa';
