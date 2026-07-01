import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X } from 'lucide-react';
import { SectionTitle } from '../components/ui/GlassCard';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import { mensajesDemo } from '../data/demoData';
import type { Mensaje } from '../types';

export function Messages() {
  const { data: mensajes } = useSupabaseTable<Mensaje>('mensajes', mensajesDemo, {
    orderBy: 'fecha',
    ascending: false,
  });
  const [abierto, setAbierto] = useState<Mensaje | null>(null);

  return (
    <div>
      <SectionTitle
        eyebrow="Correspondencia"
        title="Mensajes"
        subtitle="Cada sobre guarda algo que quise decirte."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mensajes.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            onClick={() => setAbierto(m)}
            className="glass glass-hover group flex flex-col items-center gap-3 rounded-2xl p-8 text-center"
          >
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-red/15 transition-transform group-hover:-translate-y-1">
              <Mail className="h-6 w-6 text-red-bright" />
              {!m.leido && (
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-bright ring-2 ring-bg" />
              )}
            </div>
            <p className="font-display text-base font-medium">Mensaje {m.numero}</p>
            <p className="text-xs text-text-muted">{m.fecha}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setAbierto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateX: -12 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative w-full max-w-lg rounded-2xl p-8 sm:p-10"
              style={{ background: 'linear-gradient(180deg, #151515, #0f0f0f)' }}
            >
              <button
                onClick={() => setAbierto(null)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-bright">
                Mensaje {abierto.numero} · {abierto.fecha}
              </p>
              <h3 className="font-display text-2xl font-semibold">{abierto.titulo}</h3>
              <p className="mt-5 whitespace-pre-line font-display text-[15px] leading-relaxed text-text-muted">
                {abierto.contenido}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
