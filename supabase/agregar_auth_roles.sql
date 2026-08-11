-- =====================================================================
-- princesa-Mile — Roles de usuario (admin / editor / visualizador)
-- Pégalo completo en el SQL Editor de Supabase y dale Run.
-- =====================================================================

alter table usuarios drop constraint if exists usuarios_rol_check;
alter table usuarios add constraint usuarios_rol_check check (rol in ('admin', 'editor', 'visualizador'));
alter table usuarios alter column rol set default 'visualizador';

-- =====================================================================
-- Cómo dar de alta a Sebastián (admin) y Mile (editor):
-- 1. Cada uno crea su cuenta normal desde el botón "Crear cuenta" del login
--    de la web (queda con rol "visualizador" automáticamente).
-- 2. Vos entrás al Table Editor de Supabase > tabla "usuarios" y le cambiás
--    manualmente el campo "rol" a "admin" (el tuyo) o "editor" (el de Mile).
-- Nadie puede auto-asignarse admin/editor desde la web — el formulario de
-- registro siempre manda rol = 'visualizador', a propósito.
-- =====================================================================
