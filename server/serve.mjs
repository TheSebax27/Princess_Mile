// Servidor mínimo para producción. Sirve la carpeta `dist` (generada con
// `npm run build`) y además la misma API de subida de fotos que usa el
// servidor de desarrollo, para que "Agregar fotos" siga funcionando aunque
// ya hayas publicado el sitio — siempre que lo hospedes en algo que
// mantenga un proceso de Node corriendo (una VPS, Render, Railway, Fly.io),
// NO en un hosting 100% estático como GitHub Pages.
//
// Uso:
//   npm run build
//   npm run serve
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleGalleryApi } from './galleryPlugin.mjs';
import { handlePlanesApi } from './planesPlugin.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const PORT = process.env.PORT || 4000;

const MIME_BY_EXT = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function serveStatic(req, res) {
  if (!fs.existsSync(DIST_DIR)) {
    res.statusCode = 500;
    res.end('No existe la carpeta dist. Corre "npm run build" primero.');
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  let filePath = path.join(DIST_DIR, decodeURIComponent(url.pathname));

  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // SPA fallback: rutas de React Router se resuelven con index.html
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  res.setHeader('Content-Type', MIME_BY_EXT[ext] ?? 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const handledGallery = await handleGalleryApi(req, res).catch((err) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Error interno' }));
    return true;
  });
  if (handledGallery) return;

  const handledPlanes = await handlePlanesApi(req, res).catch((err) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Error interno' }));
    return true;
  });
  if (handledPlanes) return;

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`princesa-Mile corriendo en http://localhost:${PORT}`);
});
