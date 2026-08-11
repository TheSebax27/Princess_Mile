# Princesa Mile

Sitio web privado (regalo/proyecto personal) hecho por Sebastián para Mile. Es una
app de una sola página protegida por código de acceso opcional, con secciones tipo
"cartas", galería de fotos, playlist, línea de tiempo, "quién es ella", planes y un
secreto desbloqueable por fecha.

## Stack

- React 19 + TypeScript + Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`)
- React Router 7 (`BrowserRouter`), `react-hot-toast`, `framer-motion`, `swiper`, `lucide-react`
- Supabase (`@supabase/supabase-js`) como backend de datos (Postgres + RLS)
- Lint: `oxlint` (no ESLint)
- Node "server" propio (sin framework) para servir producción + subir fotos

Comandos (`package.json`):
- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build`
- `npm run serve` — sirve `dist/` con `server/serve.mjs` (producción, standalone Node)
- `npm run lint` — oxlint

## Modo demo vs Supabase real

`src/lib/supabase.ts` expone `isSupabaseConfigured` (true solo si `VITE_SUPABASE_URL`
y `VITE_SUPABASE_ANON_KEY` están en `.env`). El hook `src/hooks/useSupabaseTable.ts`
es el patrón central: si Supabase no está configurado, o si la tabla devuelve 0 filas,
usa datos de `src/data/demoData.ts` como fallback — así la app nunca se rompe visualmente.

`.env` (no versionado) tiene: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
`VITE_ACCESS_CODE` (código opcional de la pantalla de login, vacío = sin candado),
`VITE_SPOTIFY_PLAYLIST_URL`.

## Auth (Supabase Auth real, con roles)

Desde 2026-08-05 ya no es solo un código de acceso: `src/context/AuthContext.tsx` usa
`supabase.auth` (email + contraseña) de verdad. Cada cuenta tiene una fila espejo en la
tabla `usuarios` (`auth_id`, `nombre`, `rol`), con `rol` en `admin` | `editor` |
`visualizador` (ver `supabase/agregar_auth_roles.sql` — hay que correrlo una vez).

- **Registro** (`Login.tsx`, modo "Crear cuenta"): siempre crea al usuario con
  `rol = 'visualizador'`, hardcodeado en `AuthContext.signup()` **y reforzado por RLS**
  (`agregar_auth_roles.sql`: la política de insert exige `rol = 'visualizador'`).
- **Panel "Usuarios y roles"** (`Settings.tsx`, componente `GestionUsuarios` +
  `src/hooks/useUsuarios.ts`): solo visible si `esAdmin`. Lista todas las cuentas
  registradas y deja cambiar el rol con un `<select>`. La app nunca crea cuentas con
  contraseña por su cuenta — cada persona se registra sola desde "Crear cuenta"
  (queda `visualizador`), y el admin la sube de rol después desde este panel. La
  primera vez que exista un admin hay que promoverlo a mano desde el Table Editor de
  Supabase (bootstrap, ver comentario al final de `agregar_auth_roles.sql`) — de ahí
  en adelante todo se maneja desde la web. Solo un `admin` puede cambiar roles: lo
  impone la RLS de `usuarios`, no solo el `if` de React.
- `puedeEditar` = `rol === 'admin' || rol === 'editor'` — gatea los botones de
  escritura en `Gallery.tsx`, `Planes.tsx` y `Audios.tsx` (subir/editar/eliminar
  desaparecen para `visualizador`; el resto de la web sigue siendo de solo lectura
  para todos los roles igual que antes, ahí no cambió nada).
- **Duración de sesión** (Ajustes): `duracionSesion` = `'siempre'` (default, Supabase
  mantiene la sesión sola vía refresh token) o `'1h'` — en ese caso `AuthContext` guarda
  la hora de login en `localStorage` y se auto-desloguea con un `setTimeout` al cumplirse.
- `VITE_ACCESS_CODE` quedó **obsoleto** (ya no se usa en ningún lado, se puede borrar
  del `.env` cuando quieras).

## Rutas (`src/App.tsx`)

Todas dentro de `AppLayout` (`src/components/layout/AppLayout.tsx` con `Header` +
`Sidebar`), gateadas por `isUnlocked`:

| Ruta | Página | Contenido |
|---|---|---|
| `/` | `Home.tsx` | dashboard / frases |
| `/mensajes` | `Messages.tsx` | tabla `mensajes` / `cartas` |
| `/galeria` | `Gallery.tsx` | tabla `galeria` + subida propia vía API (ver abajo) |
| `/playlist` | `Playlist.tsx` | embed de Spotify (`VITE_SPOTIFY_PLAYLIST_URL`); la tabla `playlist` de `schema.sql` no se usa desde acá |
| `/audios` | `Audios.tsx` | tabla `audios` + bucket Storage `audios-files` (subir, nombrar, reproducir, eliminar) |
| `/quien-es` | `AboutHer.tsx` | tablas `biografia`, `rasgos`, `curiosidades` |
| `/fechas` | `Timeline.tsx` | tabla `timeline` |
| `/planes` | `Planes.tsx` | API propia `/api/planes` (no Supabase) |
| `/secreto` | `Secret.tsx` | tabla `secretos` (desbloqueo por fecha/código) |
| `/configuracion` | `Settings.tsx` | tabla `configuracion` |

## Subida de archivos: Supabase Storage (patrón actual)

**Galería, Planes y Audios** guardan sus archivos en **Supabase Storage** (buckets
públicos), no en el servidor Node. Patrón en cada hook (`useGallery.ts`, `usePlanes.ts`,
`useAudios.ts`): `supabase.storage.from(BUCKET).upload(...)` → `getPublicUrl(...)` →
insert en la tabla con esa URL. Al borrar, primero se borra la fila y después el
archivo del bucket (best-effort, con `.catch(() => undefined)`).

| Sección | Tabla | Bucket |
|---|---|---|
| Galería | `galeria` | `galeria-fotos` |
| Planes | `planes` (⚠️ no está en `supabase/schema.sql`, ver nota abajo) | `planes-fotos` |
| Audios | `audios` | `audios-files` |

### Servidor Node en `server/` — código legado, ya no se usa

`server/galleryStore.mjs` + `server/galleryPlugin.mjs` (API `/api/gallery/*`) y
`server/planesStore.mjs` + `server/planesPlugin.mjs` (API `/api/planes*`) fueron el
primer approach (guardar archivos en disco), **reemplazado** por Supabase Storage.
Ningún componente de `src/` los llama ya — quedaron sin conectar (`vite.config.ts` ni
siquiera registra esos plugins de Vite). `server/serve.mjs` (`npm run serve`) sigue
sirviendo `dist/` + esas APIs viejas, pero es código muerto salvo que se decida
recuperarlo. No tocar/depender de esto para features nuevas; usar siempre el patrón de
Storage de arriba.

### ⚠️ `supabase/schema.sql` no refleja el estado real de la base

La tabla `planes` (usada por `usePlanes.ts`) no existe en `supabase/schema.sql` — se
creó directo en el dashboard de Supabase en algún momento, fuera de los scripts
versionados. Además, las políticas RLS reales de `galeria` y `planes` permiten
**escritura pública** (la app nunca usa Supabase Auth real — `AuthContext.tsx` es solo
un código de acceso local en `sessionStorage`, nunca llama a `supabase.auth`), aunque
`schema.sql` documenta `escritura autenticada`. Antes de asumir que un script SQL
versionado es la fuente de verdad, confirmar el estado real en el dashboard.

## Sección "Audios" (`/audios`)

Lista de audios que se pueden guardar, nombrar, reproducir (uno a la vez, con barra de
progreso) y eliminar. Mismo patrón que Galería/Planes: hook `src/hooks/useAudios.ts` +
página `src/pages/Audios.tsx`. Requiere correr `supabase/agregar_audios.sql` una vez en
el SQL Editor de Supabase (crea la tabla `audios` + el bucket `audios-files` con
políticas públicas de lectura/escritura, siguiendo el mismo criterio que `galeria`).

## Supabase — esquema (`supabase/schema.sql`)

Sitio privado para dos personas: lectura pública vía anon key en casi todas las
tablas, escritura reservada a `auth.role() = 'authenticated'` (en la práctica, el
propio Sebastián administra contenido desde el Table Editor de Supabase con el
service role, no desde la app). Tablas principales: `configuracion`, `biografia`,
`rasgos`, `curiosidades`, `mensajes`, `cartas`, `galeria`, `playlist`, `categorias`,
`gustos`, `frases`, `razones`, `timeline`, `capsulas`, `secretos`, `visitas`,
`notificaciones`, `favoritos`, `usuarios`.

Notas:
- `secretos`: política especial, solo se puede leer si `desbloqueado = true` o
  `fecha_desbloqueo <= current_date`.
- `capsulas.tipo` conserva el valor `'capitulo'` en el check por compatibilidad
  histórica (venía de un apartado "Libro" ya eliminado de la app) — no se usa.
- Otros scripts sueltos en `supabase/`: `agregar_biografia.sql`, `eliminar_sorpresas.sql`,
  `fix_timeline.sql`, `seed_contenido_real.sql`, `seed_mensajes.sql` (migraciones/seeds
  puntuales, no versionado por número — revisar cuál ya se corrió antes de re-correr).

## Exportar información en PDF (botón del Home)

El hero de `Home.tsx` tiene un botón "Exportar información" (reemplazó un ícono
decorativo estático que había ahí) que descarga un PDF de varias páginas con el
resumen de Milena: biografía, rasgos, curiosidades, gustos y razones.

- `src/hooks/useResumenMilena.ts` — junta biografía + rasgos + curiosidades + gustos +
  razones + configuración (mismas tablas que ya usan `AboutHer.tsx`/`Home.tsx`, más
  `razones`/`configuracion` que no se leían juntas en ningún otro lado).
- `src/lib/generarResumenPdf.ts` — arma el PDF a mano con `jsPDF` (texto, rects,
  círculos con opacidad para simular el glow rojo del sitio), replicando la paleta de
  `src/index.css` (fondo casi negro, acentos rojos, tipografía serif para títulos).
  No usa `html2canvas` ni fuentes personalizadas (jsPDF no permite cargar `.ttf` sin
  un paso de build con Node, que no está disponible en este entorno) — usa las fuentes
  base de jsPDF (`times`/`helvetica`) como aproximación a Playfair Display/Inter.
  Incluye una página con el link a la playlist de Spotify (`src/lib/spotify.ts`,
  compartido con `Playlist.tsx`), con `doc.textWithLink` + `doc.link` como zona
  clickeable.
- **Emojis en el PDF**: las fuentes estándar de PDF (Helvetica/Times) no tienen
  glyphs de emoji — por eso al principio salían como jeroglíficos. La solución:
  `emojiToDataUrl()` dibuja cada emoji con la fuente de emoji del sistema
  ("Segoe UI Emoji" en Windows) en un `<canvas>` oculto y lo mete al PDF como imagen
  PNG (`addEmoji()`), no como texto. Ojo: en Windows los emojis de bandera (🇨🇴, etc.)
  se ven como letras en un cuadro (ej. "CO") en vez de la bandera real — es una
  limitación de la fuente Segoe UI Emoji del sistema operativo, no del código.
- Depende de `jspdf` (agregado a `package.json`, **hay que correr `npm install`** para
  que se descargue — no se pudo instalar automáticamente en este entorno porque no
  tiene Node.js disponible).

## Tipos (`src/types/index.ts`)

Interfaces en español que reflejan 1:1 las tablas de Supabase: `Mensaje`,
`FotoGaleria`, `CancionPlaylist`, `Razon`, `Gusto`, `EventoTimeline`, `Secreto`,
`Frase`, `BiografiaInfo`, `Rasgo`, `Curiosidad`, `Configuracion`.

## Git

Repo local en `C:\SebastianProyectos\Mile\Princess_Mile`, rama `main`, con remoto
`origin` configurado. Historial corto (proyecto reciente, ~5 commits al momento de
este documento).

## Convenciones

- Todo el código de dominio (UI visible, comentarios de negocio, nombres de tabla/campo)
  está en español; identificadores de código (funciones, hooks) en inglés/camelCase.
- No hay tests configurados.
- No hay ESLint, se usa `oxlint` (`.oxlintrc.json`).
