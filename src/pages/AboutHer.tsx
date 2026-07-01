import { motion } from 'framer-motion';
import { SectionTitle } from '../components/ui/GlassCard';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import { razonesDemo } from '../data/demoData';
import type { Razon } from '../types';
import { useState } from 'react';
import clsx from 'clsx';

export function AboutHer() {
  return (
    <div>
      <SectionTitle eyebrow="Quién es" title="Ella..." />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass mb-12 rounded-3xl px-8 py-14 text-center sm:px-16"
      >
        <p className="font-display text-2xl leading-relaxed sm:text-3xl">
          Es de esas personas que llegan
          <br className="hidden sm:block" /> sin hacer ruido...
          <br />
          <span className="text-red-bright">y terminan cambiando todo.</span>
        </p>
      </motion.div>

      <Reasons />
    </div>
  );
}

function Reasons() {
  const { data: razones } = useSupabaseTable<Razon>('razones', razonesDemo, { orderBy: 'numero', ascending: false });
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  return (
    <div>
      <h3 className="mb-5 font-display text-xl font-medium">Razones</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {razones.map((r, i) => (
          <motion.button
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setFlipped((f) => ({ ...f, [r.id]: !f[r.id] }))}
            className="aspect-square [perspective:800px]"
          >
            <div
              className={clsx(
                'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
                flipped[r.id] && '[transform:rotateY(180deg)]',
              )}
            >
              <div className="glass absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl p-3 [backface-visibility:hidden]">
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-xs text-text-muted">Razón #{r.numero}</span>
              </div>
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-dark to-red p-4 text-center text-sm font-medium [backface-visibility:hidden] [transform:rotateY(180deg)]"
              >
                {r.texto}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
