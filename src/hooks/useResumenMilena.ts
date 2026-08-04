import { useSupabaseTable } from './useSupabaseTable';
import {
  biografiaInfoDemo,
  rasgosDemo,
  curiosidadesDemo,
  gustosDemo,
  razonesDemo,
  configDemo,
} from '../data/demoData';
import type { BiografiaInfo, Rasgo, Curiosidad, Gusto, Razon, Configuracion } from '../types';

/**
 * Junta todo lo que se sabe de ella (biografía, rasgos, curiosidades, gustos,
 * razones, configuración) en un solo lugar. Pensado para el botón "Exportar
 * información" del inicio, pero reutilizable donde se necesite el resumen completo.
 */
export function useResumenMilena() {
  const { data: infoRows, loading: l1 } = useSupabaseTable<BiografiaInfo>('biografia', [biografiaInfoDemo]);
  const { data: rasgos, loading: l2 } = useSupabaseTable<Rasgo>('rasgos', rasgosDemo, { orderBy: 'orden' });
  const { data: curiosidades, loading: l3 } = useSupabaseTable<Curiosidad>('curiosidades', curiosidadesDemo, {
    orderBy: 'orden',
  });
  const { data: gustos, loading: l4 } = useSupabaseTable<Gusto>('gustos', gustosDemo, { orderBy: 'orden' });
  const { data: razones, loading: l5 } = useSupabaseTable<Razon>('razones', razonesDemo, {
    orderBy: 'numero',
    ascending: false,
  });
  const { data: configRows, loading: l6 } = useSupabaseTable<Configuracion>('configuracion', [configDemo]);

  return {
    info: infoRows[0] ?? biografiaInfoDemo,
    rasgos,
    curiosidades,
    gustos,
    razones,
    config: configRows[0] ?? configDemo,
    loading: l1 || l2 || l3 || l4 || l5 || l6,
  };
}
