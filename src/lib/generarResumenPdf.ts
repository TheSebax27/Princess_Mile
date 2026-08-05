import type { BiografiaInfo, Rasgo, Curiosidad, Gusto, Razon, Configuracion } from '../types';

export interface ResumenMilenaData {
  info: BiografiaInfo;
  rasgos: Rasgo[];
  curiosidades: Curiosidad[];
  gustos: Gusto[];
  razones: Razon[];
  config: Configuracion;
  fotoUrl?: string;
  playlistUrl?: string;
}

type RGB = [number, number, number];

const COLOR_BG: RGB = [9, 9, 9];
const COLOR_PANEL: RGB = [17, 17, 17];
const COLOR_PANEL_2: RGB = [26, 26, 26];
const COLOR_RED: RGB = [193, 18, 31];
const COLOR_RED_BRIGHT: RGB = [230, 57, 70];
const COLOR_RED_DARK: RGB = [120, 0, 0];
const COLOR_TEXT: RGB = [255, 255, 255];
const COLOR_MUTED: RGB = [179, 179, 179];
const COLOR_BORDER: RGB = [36, 36, 36];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo cargar la foto'));
    img.src = url;
  });
}

// jsPDF solo sabe dibujar con fuentes estándar de PDF (Helvetica/Times/Courier),
// que no tienen glyphs de emoji — por eso salían como cuadros/jeroglíficos. La
// solución es pintar cada emoji con la fuente de emoji del sistema en un <canvas>
// y meter ese canvas como imagen PNG en el PDF, no como texto.
const emojiCache = new Map<string, string | null>();

function emojiToDataUrl(emoji: string): string | null {
  if (emojiCache.has(emoji)) return emojiCache.get(emoji) ?? null;
  try {
    const px = 128;
    const canvas = document.createElement('canvas');
    canvas.width = px;
    canvas.height = px;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      emojiCache.set(emoji, null);
      return null;
    }
    ctx.clearRect(0, 0, px, px);
    ctx.font = `${Math.round(px * 0.75)}px "Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, px / 2, px / 2 + px * 0.04);
    const dataUrl = canvas.toDataURL('image/png');
    emojiCache.set(emoji, dataUrl);
    return dataUrl;
  } catch {
    emojiCache.set(emoji, null);
    return null;
  }
}

/** Genera y descarga un PDF con el resumen de Milena: biografía, rasgos,
 * curiosidades, gustos y razones. Todo el diseño se dibuja a mano con jsPDF
 * usando la misma paleta oscura/roja del sitio (ver src/index.css). */
export async function generarResumenMilenaPdf(data: ResumenMilenaData): Promise<void> {
  const { jsPDF, GState } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  let foto: HTMLImageElement | null = null;
  if (data.fotoUrl) {
    try {
      foto = await loadImage(data.fotoUrl);
    } catch {
      foto = null;
    }
  }

  let page = 1;

  function background() {
    doc.setFillColor(...COLOR_BG);
    doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
  }

  function glow(cx: number, cy: number, r: number, color: RGB, opacity: number) {
    doc.saveGraphicsState();
    doc.setGState(new GState({ opacity }));
    doc.setFillColor(...color);
    doc.circle(cx, cy, r, 'F');
    doc.restoreGraphicsState();
  }

  function footer() {
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, PAGE_H - 16, PAGE_W - MARGIN, PAGE_H - 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_MUTED);
    doc.text('princesa-mile', MARGIN, PAGE_H - 10);
    doc.text(String(page), PAGE_W - MARGIN, PAGE_H - 10, { align: 'right' });
  }

  function newPage() {
    footer();
    doc.addPage();
    page += 1;
    background();
  }

  function eyebrow(text: string, y: number) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_RED_BRIGHT);
    doc.text(text.toUpperCase().split('').join(' '), MARGIN, y);
  }

  function sectionTitle(text: string, y: number) {
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(...COLOR_TEXT);
    doc.text(text, MARGIN, y);
  }

  function addEmoji(emoji: string, x: number, y: number, size = 6) {
    const dataUrl = emojiToDataUrl(emoji);
    if (!dataUrl) return;
    doc.addImage(dataUrl, 'PNG', x, y, size, size);
  }

  function ensureSpace(y: number, limit = 262) {
    if (y > limit) {
      newPage();
      return 32;
    }
    return y;
  }

  // ───────────────────────── Página 1 · Portada ─────────────────────────
  background();
  glow(195, 15, 50, COLOR_RED, 0.14);
  glow(5, 290, 60, COLOR_RED_DARK, 0.12);

  eyebrow('Resumen personal', 44);

  doc.setFont('times', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(...COLOR_TEXT);
  const nombreLines = doc.splitTextToSize(data.info.nombre, CONTENT_W - 65);
  doc.text(nombreLines, MARGIN, 66);
  let cursorY = 66 + nombreLines.length * 13;

  if (data.info.apodo) {
    doc.setFont('times', 'italic');
    doc.setFontSize(16);
    doc.setTextColor(...COLOR_RED_BRIGHT);
    doc.text(`"${data.info.apodo}"`, MARGIN, cursorY);
    cursorY += 10;
  }

  doc.setDrawColor(...COLOR_RED);
  doc.setLineWidth(1);
  doc.line(MARGIN, cursorY, MARGIN + 28, cursorY);
  cursorY += 14;

  doc.setFont('times', 'italic');
  doc.setFontSize(13.5);
  doc.setTextColor(...COLOR_MUTED);
  const fraseLines = doc.splitTextToSize(data.info.frase_corta, CONTENT_W - 65);
  doc.text(fraseLines, MARGIN, cursorY);

  if (foto) {
    const frameW = 62;
    const frameH = frameW * (foto.height / foto.width);
    const fx = PAGE_W - MARGIN - frameW;
    const fy = 130;
    doc.setDrawColor(...COLOR_RED);
    doc.setLineWidth(1.4);
    doc.rect(fx - 2.5, fy - 2.5, frameW + 5, frameH + 5);
    doc.addImage(foto, 'JPEG', fx, fy, frameW, frameH);
  }

  const fecha = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(`Generado el ${fecha}`, MARGIN, PAGE_H - 32);
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_RED_BRIGHT);
  doc.text(`Con cariño, ${data.config.nombre_visitante}`, MARGIN, PAGE_H - 23);

  // ───────────────────────── Página 2 · Biografía ─────────────────────────
  newPage();
  eyebrow('Quién es', 32);
  sectionTitle('Biografía', 44);

  let y = 60;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_MUTED);
  for (const parrafo of data.info.bio.split('\n\n')) {
    const lines = doc.splitTextToSize(parrafo, CONTENT_W);
    y = ensureSpace(y);
    doc.text(lines, MARGIN, y);
    y += lines.length * 6 + 6;
  }

  if (data.rasgos.length > 0) {
    y = ensureSpace(y + 4);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_RED_BRIGHT);
    doc.text('RASGOS', MARGIN, y);
    y += 9;

    let cx = MARGIN;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    for (const r of data.rasgos) {
      const w = doc.getTextWidth(r.texto) + 10;
      if (cx + w > PAGE_W - MARGIN) {
        cx = MARGIN;
        y += 12;
      }
      y = ensureSpace(y);
      doc.setDrawColor(...COLOR_BORDER);
      doc.setFillColor(...COLOR_PANEL_2);
      doc.roundedRect(cx, y - 6, w, 9, 4.5, 4.5, 'FD');
      doc.setTextColor(...COLOR_TEXT);
      doc.text(r.texto, cx + 5, y);
      cx += w + 4;
    }
  }

  // ───────────────────────── Página 3 · Curiosidades ─────────────────────────
  newPage();
  eyebrow('Detalles', 32);
  sectionTitle('Curiosidades', 44);

  y = 58;
  const colW = (CONTENT_W - 8) / 2;
  let col = 0;
  let rowMaxH = 0;
  for (const c of data.curiosidades) {
    const lines = doc.splitTextToSize(c.texto, colW - 16);
    const boxH = 15 + lines.length * 5;
    if (col === 0) {
      y = ensureSpace(y, 255);
      rowMaxH = boxH;
    } else {
      rowMaxH = Math.max(rowMaxH, boxH);
    }
    const cx = MARGIN + col * (colW + 8);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setFillColor(...COLOR_PANEL);
    doc.roundedRect(cx, y, colW, boxH, 3, 3, 'FD');
    addEmoji(c.emoji, cx + 6, y + 4, 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(lines, cx + 6, y + 17);
    if (col === 0) {
      col = 1;
    } else {
      col = 0;
      y += rowMaxH + 6;
    }
  }
  if (col === 1) y += rowMaxH + 6;

  // ── Gustos, en la misma página si entran ──
  y = ensureSpace(y + 6);
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...COLOR_TEXT);
  doc.text('Gustos', MARGIN, y);
  y += 11;

  const categorias = Array.from(new Set(data.gustos.map((g) => g.categoria)));
  for (const cat of categorias) {
    y = ensureSpace(y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_RED_BRIGHT);
    doc.text(cat.toUpperCase(), MARGIN, y);
    y += 7;
    for (const it of data.gustos.filter((g) => g.categoria === cat)) {
      y = ensureSpace(y);
      addEmoji(it.icono, MARGIN + 3, y - 4.2, 5.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(...COLOR_TEXT);
      doc.text(it.nombre, MARGIN + 11, y);
      y += 6.5;
    }
    y += 4;
  }

  // ───────────────────────── Página · Playlist ─────────────────────────
  if (data.playlistUrl) {
    const COLOR_SPOTIFY: RGB = [29, 185, 84];
    newPage();
    eyebrow('Para escuchar', 32);
    sectionTitle('Su playlist', 44);

    const gx = MARGIN + 10;
    const gy = 68;
    doc.setFillColor(...COLOR_SPOTIFY);
    doc.circle(gx, gy, 10, 'F');
    doc.setFillColor(...COLOR_BG);
    doc.triangle(gx - 3.2, gy - 5, gx - 3.2, gy + 5, gx + 5, gy, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...COLOR_TEXT);
    doc.text('Todas las canciones que nos acompañan', MARGIN + 26, gy - 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...COLOR_MUTED);
    doc.text('Conectada en vivo con Spotify', MARGIN + 26, gy + 5);

    const boxY = gy + 22;
    const boxH = 22;
    doc.setDrawColor(...COLOR_BORDER);
    doc.setFillColor(...COLOR_PANEL);
    doc.roundedRect(MARGIN, boxY, CONTENT_W, boxH, 4, 4, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR_SPOTIFY);
    doc.textWithLink('Abrir la playlist en Spotify  →', MARGIN + 9, boxY + boxH / 2 + 1.5, {
      url: data.playlistUrl,
    });
    doc.link(MARGIN, boxY, CONTENT_W, boxH, { url: data.playlistUrl });
  }

  // ───────────────────────── Página · Razones ─────────────────────────
  newPage();
  eyebrow('Para ella', 32);
  sectionTitle('Razones por las que te quiero', 44);

  y = 60;
  for (const r of data.razones) {
    y = ensureSpace(y);
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...COLOR_RED_BRIGHT);
    const numStr = `${r.numero}.`;
    doc.text(numStr, MARGIN, y);
    const numW = doc.getTextWidth(numStr);

    addEmoji(r.emoji, MARGIN + numW + 3, y - 4.5, 6);

    const textX = MARGIN + numW + 3 + 8.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11.5);
    doc.setTextColor(...COLOR_TEXT);
    const lines = doc.splitTextToSize(r.texto, PAGE_W - MARGIN - textX);
    doc.text(lines, textX, y);
    y += lines.length * 6.5 + 5;
  }

  // ───────────────────────── Página final · Cierre ─────────────────────────
  newPage();
  glow(PAGE_W / 2, 150, 70, COLOR_RED, 0.08);
  doc.setFont('times', 'italic');
  doc.setFontSize(19);
  doc.setTextColor(...COLOR_TEXT);
  const cierre = doc.splitTextToSize('Este resumen es apenas un fragmento de todo lo que eres.', CONTENT_W - 50);
  doc.text(cierre, PAGE_W / 2, 140, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_RED_BRIGHT);
  doc.text(`— ${data.config.nombre_visitante}`, PAGE_W / 2, 140 + cierre.length * 8 + 8, { align: 'center' });

  footer();

  const nombreArchivo = `resumen-${data.info.nombre.trim().toLowerCase().replace(/\s+/g, '-')}.pdf`;
  doc.save(nombreArchivo);
}
