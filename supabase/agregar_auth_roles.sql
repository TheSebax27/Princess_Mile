-- =====================================================================
-- princesa-Mile — Roles de usuario (admin / editor / visualizador)
-- Pégalo completo en el SQL Editor de Supabase y dale Run.
-- =====================================================================

alter table usuarios drop constraint if exists usuarios_rol_check;
alter table usuarios add constraint usuarios_rol_check check (rol in ('admin', 'editor', 'visualizador'));
alter table usuarios alter column rol set default 'visualizador';

-- Una fila por cuenta (permite usar "on conflict (auth_id)" para promover a
-- admin con un solo INSERT, sin duplicar filas si se corre más de una vez).
alter table usuarios drop constraint if exists usuarios_auth_id_key;
alter table usuarios add constraint usuarios_auth_id_key unique (auth_id);

-- ---------------------------------------------------------------------
-- RLS más estricta: antes cualquier usuario autenticado podía leer/editar
-- CUALQUIER fila de "usuarios" (incluido el rol de otros). Ahora:
-- - cualquier autenticado puede leer la lista (para mostrarla en el panel).
-- - cualquiera se puede insertar SU PROPIA fila, pero solo con rol 'visualizador'.
-- - solo un admin puede cambiar el rol de alguien (o borrar una cuenta).
-- ---------------------------------------------------------------------
drop policy if exists "escritura autenticada" on usuarios;

create policy "usuarios lectura autenticada" on usuarios
  for select using (auth.role() = 'authenticated');

create policy "usuarios alta propia como visualizador" on usuarios
  for insert with check (auth.uid() = auth_id and rol = 'visualizador');

create policy "usuarios solo admin cambia roles" on usuarios
  for update using (exists (select 1 from usuarios u where u.auth_id = auth.uid() and u.rol = 'admin'));

create policy "usuarios solo admin elimina" on usuarios
  for delete using (exists (select 1 from usuarios u where u.auth_id = auth.uid() and u.rol = 'admin'));

-- =====================================================================
-- Cómo dar de alta al primer admin (Sebastián) LA PRIMERA VEZ:
-- 1. Creá tu cuenta normal desde el botón "Crear cuenta" del login de la
--    web (queda con rol "visualizador" automáticamente — nadie puede
--    ponerse admin solo, ni siquiera con la política nueva, a propósito).
-- 2. Como todavía no existe ningún admin, la PRIMERA promoción se hace con
--    un INSERT directo (no tiene contraseñas, solo vincula tu cuenta ya
--    creada con el rol admin buscándola por tu correo):
--
--    insert into usuarios (auth_id, nombre, rol)
--    select id, 'Sebastián', 'admin'
--    from auth.users
--    where email = 'tu-correo@ejemplo.com'
--    on conflict (auth_id) do update set rol = 'admin', nombre = excluded.nombre;
--
-- 3. De ahí en adelante, ya podés asignar roles (incluido el de Mile a
--    "editor") directo desde Ajustes en la web, sin volver a tocar SQL.
-- =====================================================================
