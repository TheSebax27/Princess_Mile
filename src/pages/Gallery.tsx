import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { X } from 'lucide-react';
import { SectionTitle } from '../components/ui/GlassCard';
import { useSupabaseTable } from '../hooks/useSupabaseTable';
import { galeriaDemo } from '../data/demoData';
import type { FotoGaleria } from '../types';

export function Gallery() {
  const { data: fotos } = useSupabaseTable<FotoGaleria>('galeria', galeriaDemo);
  const [seleccionada, setSeleccionada] = useState<FotoGaleria | null>(null);

  return (
    <div>
      <SectionTitle eyebrow="Recuerdos" title="Galería" subtitle="Momentos que quiero conservar tal cual fueron." />

      <div className="glass mb-10 overflow-hidden rounded-2xl p-3 sm:p-4">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1}
          className="gallery-swiper rounded-xl"
        >
          {fotos.map((foto) => (
            <SwiperSlide key={foto.id}>
              <button
                onClick={() => setSeleccionada(foto)}
                className="block aspect-[16/9] w-full overflow-hidden rounded-xl"
              >
                <img src={foto.url} alt={foto.titulo ?? ''} className="h-full w-full object-cover" />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Masonry */}
      <div className="columns-2 gap-4 sm:columns-3 [column-fill:_balance] [&>*]:mb-4">
        {fotos.map((foto, i) => (
          <motion.button
            key={foto.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: (i % 6) * 0.05, duration: 0.4 }}
            onClick={() => setSeleccionada(foto)}
            className="glass-hover block w-full overflow-hidden rounded-xl border border-border"
          >
            <img
              src={foto.url}
              alt={foto.titulo ?? ''}
              style={{ aspectRatio: `${foto.ancho} / ${foto.alto}` }}
              className="w-full object-cover"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {seleccionada && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setSeleccionada(null)}
          >
            <button
              onClick={() => setSeleccionada(null)}
              className="absolute right-5 top-5 rounded-lg p-2 text-white/70 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              src={seleccionada.url}
              alt={seleccionada.titulo ?? ''}
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
