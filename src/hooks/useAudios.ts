import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AudioClip {
  id: string;
  titulo: string;
  url: string;
  created_at: string;
}

const BUCKET = 'audios-files';

function pathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

export function useAudios() {
  const [audios, setAudios] = useState<AudioClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setAudios([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('audios')
      .select('id, titulo, url, created_at')
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false });
    if (!error && data) setAudios(data as AudioClip[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (file: File, titulo: string) => {
      if (!supabase) throw new Error('Supabase no está configurado');
      setUploading(true);
      try {
        const ext = file.name.split('.').pop() || 'mp3';
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (upErr) throw new Error(upErr.message);

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const { error: dbErr } = await supabase.from('audios').insert({
          url: data.publicUrl,
          titulo: titulo.trim() || file.name.replace(/\.[^.]+$/, ''),
        });
        if (dbErr) throw new Error(dbErr.message);

        await refresh();
      } finally {
        setUploading(false);
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!supabase) return false;
      const audio = audios.find((a) => a.id === id);
      const { error } = await supabase.from('audios').delete().eq('id', id);
      if (error) return false;
      if (audio) {
        const path = pathFromPublicUrl(audio.url);
        if (path) await supabase.storage.from(BUCKET).remove([path]).catch(() => undefined);
      }
      await refresh();
      return true;
    },
    [refresh, audios],
  );

  return {
    audios,
    apiAvailable: isSupabaseConfigured,
    loading,
    uploading,
    upload,
    remove,
  };
}
