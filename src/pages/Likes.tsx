import { motion } from 'framer-motion';
import { SectionTitle } from '../components/ui/GlassCard';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import { gustosDemo } from '../data/demoData';
import type { Gusto } from '../types';

export function Likes() {
  const { data: gustos } = useSupabaseTable<Gusto>('gustos', gustosDemo);

  return (
    <div>
      <SectionTitle eyebrow="Lo que le gusta" title="Gustos" subtitle="Pequeñas cosas que la hacen feliz." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gustos.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass glass-hover flex flex-col items-center gap-3 rounded-2xl px-4 py-8 text-center"
          >
            <span className="text-3xl">{g.icono}</span>
            <div>
              <p className="text-sm font-medium">{g.nombre}</p>
              <p className="text-xs text-text-muted">{g.categoria}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
