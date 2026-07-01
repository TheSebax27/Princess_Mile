import path from 'node:path';
import fs from 'node:fs';
import { readJsonBody } from './galleryStore.mjs';
import { listPlanes, createPlan, updatePlan, deletePlan, PHOTOS_DIR } from './planesStore.mjs';

const MIME_BY_EXT = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

/** Handles the Planes API. Shared by the Vite dev server and the standalone production server. */
export async function handlePlanesApi(req, res) {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/planes' && req.method === 'GET') {
    send(res, 200, await listPlanes());
    return true;
  }

  if (url.pathname === '/api/planes' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const plan = await createPlan(body);
      send(res, 200, plan);
    } catch (err) {
      send(res, 400, { error: err instanceof Error ? err.message : 'No se pudo crear el plan' });
    }
    return true;
  }

  const itemMatch = url.pathname.match(/^\/api\/planes\/([^/]+)$/);
  if (itemMatch && req.method === 'PUT') {
    try {
      const body = await readJsonBody(req);
      const plan = await updatePlan(decodeURIComponent(itemMatch[1]), body);
      send(res, 200, plan);
    } catch (err) {
      send(res, 400, { error: err instanceof Error ? err.message : 'No se pudo actualizar el plan' });
    }
    return true;
  }

  if (itemMatch && req.method === 'DELETE') {
    const ok = await deletePlan(decodeURIComponent(itemMatch[1]));
    send(res, ok ? 200 : 404, { ok });
    return true;
  }

  if (url.pathname.startsWith('/planes-photos/') && req.method === 'GET') {
    const filename = decodeURIComponent(url.pathname.replace('/planes-photos/', ''));
    const fullPath = path.join(PHOTOS_DIR, filename);
    if (!fullPath.startsWith(PHOTOS_DIR) || !fs.existsSync(fullPath)) {
      res.statusCode = 404;
      res.end('Not found');
      return true;
    }
    const ext = path.extname(fullPath).toLowerCase();
    res.setHeader('Content-Type', MIME_BY_EXT[ext] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    fs.createReadStream(fullPath).pipe(res);
    return true;
  }

  return false;
}

/** Vite plugin: wires handlePlanesApi into the dev server's middleware stack. */
export function planesPlugin() {
  return {
    name: 'planes-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const handled = await handlePlanesApi(req, res).catch((err) => {
          send(res, 500, { error: err instanceof Error ? err.message : 'Error interno' });
          return true;
        });
        if (!handled) next();
      });
    },
  };
}
