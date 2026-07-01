import { motion } from 'framer-motion';
import { SectionTitle } from '../components/ui/GlassCard';
import { biografiaDemo } from '../data/demoData';
import perfilImg from '../assets/gallery/m2.jpeg';

export function AboutHer() {
  const bio = biografiaDemo;

  return (
    <div>
      <SectionTitle eyebrow="Quién es" title={`${bio.nombre}${bio.apodo ? ` · ${bio.apodo}` : ''}`} />

      {/* Foto + frase */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass relative mb-8 overflow-hidden rounded-3xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr]">
          <div className="relative h-64 sm:h-full">
            <img src={perfilImg} alt={bio.nombre} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 sm:bg-gradient-to-r sm:from-black/10 sm:via-black/0 sm:to-black/0" />
          </div>
          <div className="flex flex-col justify-center px-8 py-10 sm:px-12">
            <p className="font-display text-2xl leading-relaxed sm:text-3xl">
              {bio.frase_corta.split('...').map((parte, i, arr) => (
                <span key={i}>
                  {parte}
                  {i < arr.length - 1 && (
                    <>
                      ...
                      <br />
                    </>
                  )}
                </span>
              ))}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Biografía */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass mb-8 rounded-2xl p-7 sm:p-10"
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-red-bright">Biografía</p>
        <div className="space-y-4">
          {bio.bio.split('\n\n').map((parrafo, i) => (
            <p key={i} className="whitespace-pre-line text-[15px] leading-relaxed text-text-muted sm:text-base">
              {parrafo}
            </p>
          ))}
        </div>

        {bio.rasgos.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {bio.rasgos.map((rasgo) => (
              <span
                key={rasgo}
                className="rounded-full border border-border bg-white/[0.03] px-3.5 py-1.5 text-xs text-text-muted"
              >
                {rasgo}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Curiosidades */}
      {bio.curiosidades.length > 0 && (
        <div className="mb-12">
          <h3 className="mb-5 font-display text-xl font-medium">Curiosidades</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bio.curiosidades.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass glass-hover flex flex-col items-center gap-2 rounded-2xl px-4 py-6 text-center"
              >
                <span className="text-2xl">{c.emoji}</span>
                <p className="text-xs text-text-muted">{c.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Gustos */}
      {bio.gustos.length > 0 && (
        <div>
          <h3 className="mb-5 font-display text-xl font-medium">Gustos</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bio.gustos.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass glass-hover flex flex-col items-center gap-3 rounded-2xl px-4 py-8 text-center"
              >
                <span className="text-3xl">{g.icono}</span>
                <p className="text-sm font-medium">{g.nombre}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
