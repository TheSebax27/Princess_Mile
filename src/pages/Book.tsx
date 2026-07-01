import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown } from 'lucide-react';
import { SectionTitle } from '../components/ui/GlassCard';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import { libroDemo } from '../data/demoData';
import type { CapituloLibro } from '../types';
import clsx from 'clsx';

export function Book() {
  const { data: capitulos } = useSupabaseTable<CapituloLibro>('capsulas', libroDemo, {
    orderBy: 'orden',
    filterColumn: 'tipo',
    filterValue: 'capitulo',
  });
  const [abierto, setAbierto] = useState<string | null>(capitulos[0]?.id ?? null);

  return (
    <div>
      <SectionTitle eyebrow="Nuestra historia, completa" title="Libro" subtitle="Un capítulo a la vez." />

      <div className="space-y-4">
        {capitulos.map((c, i) => {
          const isOpen = abierto === c.id;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass overflow-hidden rounded-2xl"
            >
              <button
                onClick={() => setAbierto(isOpen ? null : c.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-red-bright" />
                  <span className="font-display text-base font-medium">
                    Capítulo {c.orden} — {c.titulo}
                  </span>
                </span>
                <ChevronDown className={clsx('h-4 w-4 shrink-0 text-text-muted transition-transform', isOpen && 'rotate-180')} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-text-muted">{c.contenido}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
