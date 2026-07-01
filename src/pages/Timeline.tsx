import { motion } from 'framer-motion';
import { SectionTitle } from '../components/ui/GlassCard';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import { timelineDemo } from '../data/demoData';
import type { EventoTimeline } from '../types';

function formatFecha(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function Timeline() {
  const { data: eventos } = useSupabaseTable<EventoTimeline>('timeline', timelineDemo, {
    orderBy: 'fecha',
    ascending: true,
  });

  return (
    <div>
      <SectionTitle eyebrow="Nuestra historia" title="Fechas" subtitle="Cada momento que decidimos recordar." />

      <div className="relative ml-3 border-l border-border pl-8 sm:ml-6">
        {eventos.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="relative mb-10 last:mb-0"
          >
            <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-red text-xs ring-4 ring-bg sm:-left-[45px]">
              {e.icono ?? '❤️'}
            </span>
            <div className="glass glass-hover rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-bright">{formatFecha(e.fecha)}</p>
              <h3 className="mt-1 font-display text-lg font-medium">{e.titulo}</h3>
              <p className="mt-1 text-sm text-text-muted">{e.descripcion}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
