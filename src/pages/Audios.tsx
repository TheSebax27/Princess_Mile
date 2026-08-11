import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Loader2, Music2, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';
import { SectionTitle } from '../components/ui/GlassCard';
import { useAudios, type AudioClip } from '../hooks/useAudios';
import { useAuth } from '../context/AuthContext';

function formatTime(segundos: number) {
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

function AudioCard({
  audio,
  isPlaying,
  onToggle,
  onDelete,
  puedeEditar,
}: {
  audio: AudioClip;
  isPlaying: boolean;
  onToggle: () => void;
  onDelete: () => void;
  puedeEditar: boolean;
}) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [duracion, setDuracion] = useState<number | null>(null);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      ref.current?.play().catch(() => undefined);
    } else {
      ref.current?.pause();
    }
  }, [isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="glass glass-hover group relative overflow-hidden rounded-2xl p-4"
    >
      <audio
        ref={ref}
        src={audio.url}
        onLoadedMetadata={(e) => setDuracion(e.currentTarget.duration)}
        onTimeUpdate={(e) => setProgreso(e.currentTarget.currentTime)}
        onEnded={() => {
          setProgreso(0);
          onToggle();
        }}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-bright to-red-dark text-white shadow-lg shadow-red/30 transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 pl-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{audio.titulo}</p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-panel-2">
            <div
              className="h-full rounded-full bg-red-bright transition-[width] duration-150"
              style={{ width: duracion ? `${Math.min(100, (progreso / duracion) * 100)}%` : '0%' }}
            />
          </div>
          <p className="mt-1 text-[11px] text-text-muted">
            {formatTime(progreso)} / {duracion ? formatTime(duracion) : '--:--'}
          </p>
        </div>

        {puedeEditar && (
          <button
            onClick={onDelete}
            aria-label="Eliminar audio"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted opacity-0 transition-opacity hover:bg-red/20 hover:text-red-bright group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function Audios() {
  const { audios, apiAvailable, uploading, upload, remove } = useAudios();
  const { puedeEditar } = useAuth();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ titulo: string; file: File | null } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const openNew = () => setForm({ titulo: '', file: null });
  const closeForm = () => setForm(null);

  const handlePickFile = (file: File | null) => {
    if (!form || !file) return;
    setForm({ ...form, file, titulo: form.titulo || file.name.replace(/\.[^.]+$/, '') });
  };

  const handleSubmit = async () => {
    if (!form?.file) {
      toast.error('Elige un archivo de audio');
      return;
    }
    if (!form.titulo.trim()) {
      toast.error('Ponle un nombre al audio');
      return;
    }
    try {
      await upload(form.file, form.titulo);
      toast.success('Audio guardado');
      closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo guardar el audio');
    }
  };

  const handleDelete = async (audio: AudioClip) => {
    if (playingId === audio.id) setPlayingId(null);
    const ok = await remove(audio.id);
    if (ok) toast.success('Audio eliminado');
    else toast.error('No se pudo eliminar el audio');
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <SectionTitle
          eyebrow="Para escuchar"
          title="Audios"
          subtitle="Los audios que quiero guardar para escucharlos cuando quiera."
        />
        {apiAvailable && puedeEditar && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-dark to-red px-5 py-2.5 text-sm font-semibold shadow-lg shadow-red/20 transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Agregar audio
          </button>
        )}
      </div>

      {!apiAvailable && (
        <div className="glass mb-6 rounded-2xl p-5 text-sm text-text-muted">
          Configura <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en tu <code>.env</code> para guardar audios.
        </div>
      )}

      {apiAvailable && audios.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-sm text-text-muted">
          Todavía no hay audios guardados. Agrega el primero con el botón de arriba.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {audios.map((audio) => (
          <AudioCard
            key={audio.id}
            audio={audio}
            isPlaying={playingId === audio.id}
            onToggle={() => setPlayingId((prev) => (prev === audio.id ? null : audio.id))}
            onDelete={() => handleDelete(audio)}
            puedeEditar={puedeEditar}
          />
        ))}
      </div>

      <AnimatePresence>
        {form && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative w-full max-w-md rounded-2xl p-6 sm:p-8"
            >
              <button onClick={closeForm} className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted hover:text-white">
                <X className="h-4 w-4" />
              </button>

              <h3 className="mb-6 font-display text-xl font-medium">Agregar audio</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs text-text-muted">Nombre</label>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    placeholder="Ej: Nota de voz, esa canción..."
                    className="w-full rounded-xl border border-border bg-panel/70 px-3.5 py-2.5 text-sm text-white placeholder:text-text-muted focus:border-red/60 focus:outline-none focus:ring-2 focus:ring-red/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-text-muted">Archivo</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex h-16 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm text-text-muted hover:border-red/40 hover:text-red-bright"
                  >
                    <Music2 className="h-4 w-4" />
                    {form.file ? form.file.name : 'Elegir audio'}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-dark to-red px-4 py-3 text-sm font-semibold shadow-lg shadow-red/20 disabled:opacity-60"
              >
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                Guardar audio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
