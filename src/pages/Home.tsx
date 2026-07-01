import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Image as ImageIcon, Music, ArrowRight, Heart } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import { useGallery } from '../hooks/useGallery';
import { mensajesDemo, frasesDemo } from '../data/demoData';
import type { Mensaje } from '../types';
import heroImg from '../assets/hero.png';

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export function Home() {
  const { data: mensajes } = useSupabaseTable<Mensaje>('mensajes', mensajesDemo, { orderBy: 'fecha', ascending: false });
  const { fotos } = useGallery();

  const ultimoMensaje = mensajes[0];
  const ultimaFoto = fotos.find((f) => f.puedeEliminar) ?? fotos[0];

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="glass relative mb-8 overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-14"
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red/10 blur-3xl" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-2 text-red-bright">
              <Heart className="h-4 w-4" fill="currentColor" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Bienvenida de nuevo</span>
            </div>
            <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {frasesDemo[0].texto}
            </h1>
            <Link
              to="/galeria"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-dark to-red px-6 py-3 text-sm font-semibold shadow-lg shadow-red/20 transition-transform hover:-translate-y-0.5"
            >
              Descubrir <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <img
            src={heroImg}
            alt=""
            className="hidden h-32 w-32 rounded-2xl object-cover opacity-90 sm:block"
          />
        </div>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        <motion.div variants={item}>
          <GlassCard as="article" className="flex h-full flex-col p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red/15">
              <Mail className="h-4 w-4 text-red-bright" />
            </div>
            <h3 className="font-display text-lg font-medium">Último mensaje</h3>
            <p className="mt-2 line-clamp-3 flex-1 text-sm text-text-muted">
              {ultimoMensaje?.contenido ?? 'Todavía no hay mensajes.'}
            </p>
            <div className="mt-5 h-px bg-border" />
            <Link to="/mensajes" className="mt-4 inline-flex items-center gap-1 text-sm text-red-bright hover:gap-2 transition-all">
              Ver más <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard as="article" className="flex h-full flex-col p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red/15">
              <ImageIcon className="h-4 w-4 text-red-bright" />
            </div>
            <h3 className="font-display text-lg font-medium">Última foto</h3>
            {ultimaFoto && (
              <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl">
                <img src={ultimaFoto.url} alt={ultimaFoto.titulo} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="mt-5 h-px bg-border" />
            <Link to="/galeria" className="mt-4 inline-flex items-center gap-1 text-sm text-red-bright hover:gap-2 transition-all">
              Ver más <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard as="article" className="flex h-full flex-col p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954]/15">
              <Music className="h-4 w-4 text-[#1DB954]" />
            </div>
            <h3 className="font-display text-lg font-medium">Nuestra playlist</h3>
            <p className="mt-2 flex-1 text-sm text-text-muted">
              Todas las canciones que nos acompañan, conectadas en vivo con Spotify.
            </p>
            <div className="mt-5 h-px bg-border" />
            <Link to="/playlist" className="mt-4 inline-flex items-center gap-1 text-sm text-red-bright hover:gap-2 transition-all">
              Ver más <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}