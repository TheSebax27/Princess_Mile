import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SectionTitle } from '../components/ui/GlassCard';
import { useGallery, type FotoGaleria } from '../hooks/useGallery';

export function Gallery() {
  const { fotos, apiAvailable, uploading, upload, remove } = useGallery();
  const [seleccionada, setSeleccionada] = useState<FotoGaleria | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const lista = Array.from(files);
    for (const file of lista) {
      if (!file.type.startsWith('image/')) continue;
      try {
        await upload(file);
        toast.success(`Se agregó "${file.name}"`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'No se pudo subir la foto');
      }
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDelete = async (foto: FotoGaleria) => {
    const ok = await remove(foto.id);
    if (ok) {
      toast.success('Foto eliminada');
      if (seleccionada?.id === foto.id) setSeleccionada(null);
    } else {
      toast.error('No se pudo eliminar la foto');
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <SectionTitle eyebrow="Recuerdos" title="Galería" subtitle="Momentos que quiero conservar tal cual fueron." />

        {apiAvailable && (
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              aria-label="Subir foto"
              title="Subir foto"
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-bright to-red-dark text-white shadow-lg shadow-red/30 transition-transform duration-200 hover:scale-110 hover:shadow-red/50 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
            >
              <span className="absolute inset-0 -z-10 rounded-full bg-red/50 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100" />
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Plus className="h-7 w-7 transition-transform duration-200 group-hover:rotate-90" />
              )}
              <span className="pointer-events-none absolute -bottom-9 right-0 whitespace-nowrap rounded-lg bg-panel-2 px-2.5 py-1 text-xs text-text-muted opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                Subir foto
              </span>
            </button>
          </div>
        )}
      </div>

      {fotos.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-sm text-text-muted">
          Todavía no hay fotos aquí. Agrega la primera con el botón de arriba.
        </div>
      )}

      {fotos.length > 0 && (
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
                  <img src={foto.url} alt={foto.titulo} className="h-full w-full object-cover" />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Masonry: el ancho/alto natural de cada foto define la altura de su columna */}
      <div className="columns-2 gap-4 sm:columns-3 [column-fill:_balance] [&>*]:mb-4">
        {fotos.map((foto, i) => (
          <motion.div
            key={foto.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: (i % 6) * 0.05, duration: 0.4 }}
            className="glass-hover group relative w-full overflow-hidden rounded-xl border border-border"
          >
            <button onClick={() => setSeleccionada(foto)} className="block w-full">
              <img src={foto.url} alt={foto.titulo} className="w-full object-cover" loading="lazy" />
            </button>
            {foto.puedeEliminar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(foto);
                }}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity hover:bg-red group-hover:opacity-100"
                aria-label="Eliminar foto"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </motion.div>
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
              alt={seleccionada.titulo}
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}