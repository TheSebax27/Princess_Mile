import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, X, Image as ImageIcon, Loader2, Check, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { SectionTitle } from '../components/ui/GlassCard';
import { usePlanes, type Plan, type PlanEstado } from '../hooks/usePlanes';

function formatFecha(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface FormState {
  id?: string;
  fecha: string;
  lugar: string;
  nota: string;
  estado: PlanEstado;
  fotoFile: File | null;
  fotoPreview: string | null;
  fotoActual: string | null;
  removeFoto: boolean;
}

const emptyForm: FormState = {
  fecha: '',
  lugar: '',
  nota: '',
  estado: 'por_hacer',
  fotoFile: null,
  fotoPreview: null,
  fotoActual: null,
  removeFoto: false,
};

const ESTADOS: { value: PlanEstado; label: string }[] = [
  { value: 'por_hacer', label: 'Por hacer' },
  { value: 'hecho', label: 'Hecho' },
];

export function Planes() {
  const { planes, loading, apiAvailable, saving, create, update, remove, toggleEstado } = usePlanes();
  const [form, setForm] = useState<FormState | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const openNew = () => setForm({ ...emptyForm });
  const openEdit = (p: Plan) =>
    setForm({
      id: p.id,
      fecha: p.fecha,
      lugar: p.lugar,
      nota: p.nota,
      estado: p.estado,
      fotoFile: null,
      fotoPreview: p.foto,
      fotoActual: p.foto,
      removeFoto: false,
    });
  const closeForm = () => setForm(null);

  const handleFile = (file: File | null) => {
    if (!form || !file) return;
    setForm({ ...form, fotoFile: file, fotoPreview: URL.createObjectURL(file), removeFoto: false });
  };

  const handleSubmit = async () => {
    if (!form) return;
    if (!form.fecha || !form.lugar.trim()) {
      toast.error('Ponle al menos fecha y lugar');
      return;
    }
    try {
      if (form.id) {
        await update(
          form.id,
          {
            fecha: form.fecha,
            lugar: form.lugar,
            nota: form.nota,
            estado: form.estado,
            fotoFile: form.fotoFile,
            removeFoto: form.removeFoto,
          },
          form.fotoActual,
        );
        toast.success('Plan actualizado');
      } else {
        await create({
          fecha: form.fecha,
          lugar: form.lugar,
          nota: form.nota,
          estado: form.estado,
          fotoFile: form.fotoFile,
        });
        toast.success('Plan agregado');
      }
      closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Algo salió mal');
    }
  };

  const handleDelete = async (p: Plan) => {
    const ok = await remove(p.id, p.foto);
    if (ok) toast.success('Plan eliminado');
    else toast.error('No se pudo eliminar');
  };

  const handleToggle = async (p: Plan) => {
    await toggleEstado(p);
    toast.success(p.estado === 'hecho' ? 'Marcado como pendiente' : '¡Marcado como hecho!');
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <SectionTitle eyebrow="Notas a futuro" title="Planes" subtitle="Cosas que queremos hacer juntos, con fecha o sin ella." />
        {apiAvailable && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-dark to-red px-5 py-2.5 text-sm font-semibold shadow-lg shadow-red/20 transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Agregar salida
          </button>
        )}
      </div>

      {!apiAvailable && (
        <div className="glass mb-6 rounded-2xl p-5 text-sm text-text-muted">
          Configura <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en tu <code>.env</code> para guardar planes.
        </div>
      )}

      {!loading && planes.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-sm text-text-muted">
          Todavía no hay planes agregados. Crea el primero con el botón de arriba.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {planes.map((p, i) => {
          const hecho = p.estado === 'hecho';
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass glass-hover group overflow-hidden rounded-2xl"
            >
              <div className="relative h-40 w-full bg-panel-2">
                {p.foto ? (
                  <img src={p.foto} alt={p.lugar} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-text-muted">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                  </div>
                )}

                <button
                  onClick={() => handleToggle(p)}
                  className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur transition-colors ${
                    hecho ? 'bg-green-600/85 text-white hover:bg-green-600' : 'bg-black/60 text-amber-300 hover:bg-black/75'
                  }`}
                >
                  {hecho ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {hecho ? 'Hecho' : 'Por hacer'}
                </button>

                <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-red"
                    aria-label="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-red"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-bright">{formatFecha(p.fecha)}</p>
                <h3 className="mt-1 flex items-center gap-1.5 font-display text-lg font-medium">
                  <MapPin className="h-4 w-4 shrink-0 text-text-muted" />
                  {p.lugar}
                </h3>
                {p.nota && <p className="mt-2 text-sm text-text-muted">{p.nota}</p>}
              </div>
            </motion.div>
          );
        })}
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

              <h3 className="mb-6 font-display text-xl font-medium">{form.id ? 'Editar plan' : 'Agregar salida'}</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs text-text-muted">Estado</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ESTADOS.map((e) => (
                      <button
                        key={e.value}
                        type="button"
                        onClick={() => setForm({ ...form, estado: e.value })}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                          form.estado === e.value
                            ? 'border-red/60 bg-red/15 text-white'
                            : 'border-border bg-panel/70 text-text-muted hover:border-red/30'
                        }`}
                      >
                        {e.value === 'hecho' ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                        {e.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-text-muted">Fecha</label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    className="w-full rounded-xl border border-border bg-panel/70 px-3.5 py-2.5 text-sm text-white focus:border-red/60 focus:outline-none focus:ring-2 focus:ring-red/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-text-muted">Lugar</label>
                  <input
                    type="text"
                    value={form.lugar}
                    onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                    placeholder="Ej: Cine, parque, Floresta..."
                    className="w-full rounded-xl border border-border bg-panel/70 px-3.5 py-2.5 text-sm text-white placeholder:text-text-muted focus:border-red/60 focus:outline-none focus:ring-2 focus:ring-red/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-text-muted">Nota</label>
                  <textarea
                    value={form.nota}
                    onChange={(e) => setForm({ ...form, nota: e.target.value })}
                    rows={3}
                    placeholder="¿Qué tienes en mente para este plan?"
                    className="w-full resize-none rounded-xl border border-border bg-panel/70 px-3.5 py-2.5 text-sm text-white placeholder:text-text-muted focus:border-red/60 focus:outline-none focus:ring-2 focus:ring-red/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-text-muted">Foto (opcional)</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                  {form.fotoPreview ? (
                    <div className="relative h-32 w-full overflow-hidden rounded-xl">
                      <img src={form.fotoPreview} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => setForm({ ...form, fotoFile: null, fotoPreview: null, removeFoto: true })}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm text-text-muted hover:border-red/40 hover:text-red-bright"
                    >
                      <ImageIcon className="h-4 w-4" /> Elegir foto
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-dark to-red px-4 py-3 text-sm font-semibold shadow-lg shadow-red/20 disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {form.id ? 'Guardar cambios' : 'Agregar plan'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}