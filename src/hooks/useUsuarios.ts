import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Rol, Usuario } from '../types';

/** Solo para el panel de administración: lista y cambia roles. La RLS del lado
 * de Supabase es la que de verdad impide que alguien sin rol "admin" edite roles. */
export function useUsuarios(activo: boolean) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!supabase || !activo) return;
    setLoading(true);
    const { data } = await supabase.from('usuarios').select('*').order('nombre');
    if (data) setUsuarios(data as Usuario[]);
    setLoading(false);
  }, [activo]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const cambiarRol = useCallback(
    async (id: string, rol: Rol) => {
      if (!supabase) return false;
      const { error } = await supabase.from('usuarios').update({ rol }).eq('id', id);
      if (error) return false;
      await refresh();
      return true;
    },
    [refresh],
  );

  return { usuarios, loading, cambiarRol };
}
