import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface FotoGaleria {
  id: string;
  url: string;
  titulo: string;
  puedeEliminar: boolean;
}

const BUCKET = 'galeria-fotos';

// Cualquier imagen que pongas en src/assets/gallery aparece aquí también,
// sin tocar la base de datos (útil para fotos "de arranque" del sitio).
const bundled = import.meta.glob('../assets/gallery/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const bundledPhotos: FotoGaleria[] = Object.entries(bundled)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([filePath, url]) => {
    const filename = filePath.split('/').pop() ?? 'foto';
    const titulo = filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
    return { id: `bundled:${filename}`, url, titulo, puedeEliminar: false };
  });

function pathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

interface GaleriaRow {
  id: string;
  url: string;
  titulo: string | null;
}

export function useGallery() {
  const [fotosDb, setFotosDb] = useState<FotoGaleria[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setFotosDb([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('galeria')
      .select('id, url, titulo')
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false });
    if (!error && data) {
      setFotosDb(
        (data as GaleriaRow[]).map((row) => ({
          id: row.id,
          url: row.url,
          titulo: row.titulo ?? 'Foto',
          puedeEliminar: true,
        })),
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (file: File, titulo?: string) => {
      if (!supabase) throw new Error('Supabase no está configurado');
      setUploading(true);
      try {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (upErr) throw new Error(upErr.message);

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const { error: dbErr } = await supabase.from('galeria').insert({
          url: data.publicUrl,
          titulo: titulo ?? file.name.replace(/\.[^.]+$/, ''),
        });
        if (dbErr) throw new Error(dbErr.message);

        await refresh();
        return true;
      } finally {
        setUploading(false);
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!supabase) return false;
      const foto = fotosDb.find((f) => f.id === id);
      const { error } = await supabase.from('galeria').delete().eq('id', id);
      if (error) return false;
      if (foto) {
        const path = pathFromPublicUrl(foto.url);
        if (path) await supabase.storage.from(BUCKET).remove([path]).catch(() => undefined);
      }
      await refresh();
      return true;
    },
    [refresh, fotosDb],
  );

  return {
    fotos: [...bundledPhotos, ...fotosDb],
    apiAvailable: isSupabaseConfigured,
    loading,
    uploading,
    upload,
    remove,
  };
}