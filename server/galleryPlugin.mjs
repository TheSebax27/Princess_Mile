import path from 'node:path';
import fs from 'node:fs';
import {
  readManifest,
  saveUpload,
  deleteUpload,
  readJsonBody,
  UPLOAD_DIR,
} from './galleryStore.mjs';

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

/**
 * Handles the gallery upload API. Shared by the Vite dev server and the
 * standalone production server (server/serve.mjs), so behaviour is
 * identical in both. Returns true if it handled the request.
 */
export async function handleGalleryApi(req, res) {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/gallery/manifest' && req.method === 'GET') {
    const manifest = await readManifest();
    send(res, 200, manifest);
    return true;
  }

  if (url.pathname === '/api/gallery/upload' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const entry = await saveUpload(body);
      send(res, 200, entry);
    } catch (err) {
      send(res, 400, { error: err instanceof Error ? err.message : 'Error al subir la imagen' });
    }
    return true;
  }

  const deleteMatch = url.pathname.match(/^\/api\/gallery\/([^/]+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const ok = await deleteUpload(decodeURIComponent(deleteMatch[1]));
    send(res, ok ? 200 : 404, { ok });
    return true;
  }

  if (url.pathname.startsWith('/gallery-uploads/') && req.method === 'GET') {
    const filename = decodeURIComponent(url.pathname.replace('/gallery-uploads/', ''));
    const fullPath = path.join(UPLOAD_DIR, filename);
    if (!fullPath.startsWith(UPLOAD_DIR) || !fs.existsSync(fullPath)) {
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

/** Vite plugin: wires handleGalleryApi into the dev server's middleware stack. */
export function galleryUploadsPlugin() {
  return {
    name: 'gallery-uploads',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const handled = await handleGalleryApi(req, res).catch((err) => {
          send(res, 500, { error: err instanceof Error ? err.message : 'Error interno' });
          return true;
        });
        if (!handled) next();
      });
    },
  };
}
