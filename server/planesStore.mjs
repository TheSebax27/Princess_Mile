import { promises as fs } from 'node:fs';
import path from 'node:path';

const BASE_DIR = path.resolve(process.cwd(), 'data', 'planes');
const PHOTOS_DIR = path.join(BASE_DIR, 'photos');
const DATA_PATH = path.join(BASE_DIR, 'planes.json');

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

async function ensureReady() {
  await fs.mkdir(PHOTOS_DIR, { recursive: true });
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, '[]', 'utf-8');
  }
}

async function readAll() {
  await ensureReady();
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeAll(planes) {
  await fs.writeFile(DATA_PATH, JSON.stringify(planes, null, 2), 'utf-8');
}

function sanitizeExt(filename) {
  const ext = path.extname(filename || '').toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext) ? ext : '.jpg';
}

function slugify(text) {
  return (text || 'plan')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'plan';
}

async function savePhoto(dataUrl, hint) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) throw new Error('Formato de imagen inválido');

  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 15 * 1024 * 1024) {
    throw new Error('La imagen es demasiado grande (máximo 15MB)');
  }

  const ext = sanitizeExt(hint);
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${slugify(hint)}${ext}`;
  await fs.writeFile(path.join(PHOTOS_DIR, filename), buffer);
  return filename;
}

async function deletePhoto(filename) {
  if (!filename) return;
  try {
    await fs.unlink(path.join(PHOTOS_DIR, filename));
  } catch {
    // ya no existe, ignorar
  }
}

export async function listPlanes() {
  const planes = await readAll();
  return planes.sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));
}

export async function createPlan({ fecha, lugar, nota, fotoDataUrl }) {
  await ensureReady();
  if (!fecha || !lugar) throw new Error('Fecha y lugar son obligatorios');

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const foto = fotoDataUrl ? await savePhoto(fotoDataUrl, lugar) : null;

  const plan = {
    id,
    fecha,
    lugar,
    nota: nota || '',
    foto,
    created_at: new Date().toISOString(),
  };

  const planes = await readAll();
  planes.push(plan);
  await writeAll(planes);
  return plan;
}

export async function updatePlan(id, { fecha, lugar, nota, fotoDataUrl, removeFoto }) {
  const planes = await readAll();
  const index = planes.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Plan no encontrado');

  const current = planes[index];

  if (fotoDataUrl) {
    await deletePhoto(current.foto);
    current.foto = await savePhoto(fotoDataUrl, lugar ?? current.lugar);
  } else if (removeFoto) {
    await deletePhoto(current.foto);
    current.foto = null;
  }

  if (fecha !== undefined) current.fecha = fecha;
  if (lugar !== undefined) current.lugar = lugar;
  if (nota !== undefined) current.nota = nota;

  planes[index] = current;
  await writeAll(planes);
  return current;
}

export async function deletePlan(id) {
  const planes = await readAll();
  const plan = planes.find((p) => p.id === id);
  if (!plan) return false;

  await deletePhoto(plan.foto);
  await writeAll(planes.filter((p) => p.id !== id));
  return true;
}

export { PHOTOS_DIR };
