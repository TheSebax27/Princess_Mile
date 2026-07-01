import { promises as fs } from 'node:fs';
import path from 'node:path';

const UPLOAD_DIR = path.resolve(process.cwd(), 'data', 'gallery-uploads');
const MANIFEST_PATH = path.join(UPLOAD_DIR, 'manifest.json');

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

async function ensureReady() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await fs.access(MANIFEST_PATH);
  } catch {
    await fs.writeFile(MANIFEST_PATH, '[]', 'utf-8');
  }
}

export async function readManifest() {
  await ensureReady();
  const raw = await fs.readFile(MANIFEST_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeManifest(entries) {
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(entries, null, 2), 'utf-8');
}

function sanitizeExt(filename) {
  const ext = path.extname(filename || '').toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext) ? ext : '.jpg';
}

function slugify(text) {
  return (text || 'foto')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'foto';
}

/**
 * Saves a base64 data-url image to disk and registers it in the manifest.
 * Returns the new manifest entry.
 */
export async function saveUpload({ filename, dataUrl, titulo }) {
  await ensureReady();

  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) {
    throw new Error('Formato de imagen inválido');
  }
  const buffer = Buffer.from(match[2], 'base64');

  // 15MB safety limit per photo
  if (buffer.length > 15 * 1024 * 1024) {
    throw new Error('La imagen es demasiado grande (máximo 15MB)');
  }

  const ext = sanitizeExt(filename);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const diskName = `${id}-${slugify(titulo || filename)}${ext}`;
  const fullPath = path.join(UPLOAD_DIR, diskName);

  await fs.writeFile(fullPath, buffer);

  const entry = {
    id,
    filename: diskName,
    titulo: titulo || null,
    fecha: new Date().toISOString(),
  };

  const manifest = await readManifest();
  manifest.unshift(entry);
  await writeManifest(manifest);

  return entry;
}

export async function deleteUpload(id) {
  const manifest = await readManifest();
  const entry = manifest.find((e) => e.id === id);
  if (!entry) return false;

  const fullPath = path.join(UPLOAD_DIR, entry.filename);
  try {
    await fs.unlink(fullPath);
  } catch {
    // file already gone, ignore
  }

  const next = manifest.filter((e) => e.id !== id);
  await writeManifest(next);
  return true;
}

export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      // 20MB raw body safety cap
      if (data.length > 20 * 1024 * 1024) {
        reject(new Error('Payload demasiado grande'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

export { UPLOAD_DIR };
