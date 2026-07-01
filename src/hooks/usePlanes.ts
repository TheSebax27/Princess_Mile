import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type PlanEstado = 'por_hacer' | 'hecho';

export interface Plan {
  id: string;
  fecha: string;
  lugar: string;
  nota: string;
  foto: string | null;
  estado: PlanEstado;
  created_at: string;
}

interface PlanInput {
  fecha: string;
  lugar: string;
  nota?: string;
  estado: PlanEstado;
  fotoFile?: File | null;
  removeFoto?: boolean;
}

const BUCKET = 'planes-fotos';

function pathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

async function uploadFoto(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase no está configurado');
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function removeFotoSiExiste(url: string | null) {
  if (!url || !supabase) return;
  const path = pathFromPublicUrl(url);
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]).catch(() => undefined);
}

export function usePlanes() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setPlanes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('planes')
      .select('*')
      .order('fecha', { ascending: true });
    if (!error && data) setPlanes(data as Plan[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async ({ fecha, lugar, nota, estado, fotoFile }: PlanInput) => {
      if (!supabase) throw new Error('Supabase no está configurado');
      setSaving(true);
      try {
        const foto = fotoFile ? await uploadFoto(fotoFile) : null;
        const { error } = await supabase.from('planes').insert({
          fecha,
          lugar,
          nota: nota ?? '',
          estado,
          foto,
        });
        if (error) throw new Error(error.message);
        await refresh();
      } finally {
        setSaving(false);
      }
    },
    [refresh],
  );

  const update = useCallback(
    async (id: string, input: PlanInput, fotoActual: string | null) => {
      if (!supabase) throw new Error('Supabase no está configurado');
      setSaving(true);
      try {
        let foto = fotoActual;
        if (input.fotoFile) {
          foto = await uploadFoto(input.fotoFile);
          await removeFotoSiExiste(fotoActual);
        } else if (input.removeFoto) {
          await removeFotoSiExiste(fotoActual);
          foto = null;
        }
        const { error } = await supabase
          .from('planes')
          .update({
            fecha: input.fecha,
            lugar: input.lugar,
            nota: input.nota ?? '',
            estado: input.estado,
            foto,
          })
          .eq('id', id);
        if (error) throw new Error(error.message);
        await refresh();
      } finally {
        setSaving(false);
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string, foto: string | null) => {
      if (!supabase) return false;
      const { error } = await supabase.from('planes').delete().eq('id', id);
      if (error) return false;
      await removeFotoSiExiste(foto);
      await refresh();
      return true;
    },
    [refresh],
  );

  const toggleEstado = useCallback(
    async (plan: Plan) => {
      if (!supabase) return;
      const nuevoEstado: PlanEstado = plan.estado === 'hecho' ? 'por_hacer' : 'hecho';
      setPlanes((prev) => prev.map((p) => (p.id === plan.id ? { ...p, estado: nuevoEstado } : p)));
      const { error } = await supabase.from('planes').update({ estado: nuevoEstado }).eq('id', plan.id);
      if (error) await refresh();
    },
    [refresh],
  );

  return {
    planes,
    loading,
    apiAvailable: isSupabaseConfigured,
    saving,
    create,
    update,
    remove,
    toggleEstado,
  };
}