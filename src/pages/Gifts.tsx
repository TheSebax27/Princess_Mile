import { motion } from 'framer-motion';
import { Gift, Lock } from 'lucide-react';
import { SectionTitle } from '../components/ui/GlassCard';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import { sorpresasDemo } from '../data/demoData';
import type { Sorpresa } from '../types';
import clsx from 'clsx';

export function Gifts() {
  const { data: sorpresas } = useSupabaseTable<Sorpresa>('capsulas', sorpresasDemo, {
    filterColumn: 'tipo',
    filterValue: 'sorpresa',
  });

  return (
    <div>
      <SectionTitle eyebrow="Cápsulas del tiempo" title="Sorpresas" subtitle="Algunas se abren hoy, otras esperan su momento." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorpresas.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={clsx(
              'glass rounded-2xl p-6',
              s.desbloqueada && 'glass-hover',
              !s.desbloqueada && 'opacity-70',
            )}
          >
            <div
              className={clsx(
                'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
                s.desbloqueada ? 'bg-red/15' : 'bg-white/5',
              )}
            >
              {s.desbloqueada ? (
                <Gift className="h-5 w-5 text-red-bright" />
              ) : (
                <Lock className="h-5 w-5 text-text-muted" />
              )}
            </div>
            <h3 className="font-display text-lg font-medium">{s.titulo}</h3>
            <p className="mt-2 text-sm text-text-muted">{s.descripcion}</p>
            {!s.desbloqueada && s.fecha_desbloqueo && (
              <p className="mt-4 text-xs uppercase tracking-wide text-red-bright">
                Se desbloquea el {new Date(s.fecha_desbloqueo + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
