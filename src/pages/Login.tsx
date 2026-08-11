import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { configDemo } from '../data/demoData';

export function Login() {
  const { login, signup } = useAuth();
  const [modo, setModo] = useState<'entrar' | 'crear'>('entrar');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setCargando(true);
    try {
      const res = modo === 'entrar' ? await login(email, password) : await signup(email, password, nombre);
      if (!res.ok) setError(res.error ?? 'Algo salió mal');
      else if (res.requiereConfirmacion) setInfo('Revisa tu correo para confirmar la cuenta antes de entrar.');
    } finally {
      setCargando(false);
    }
  };

  const cambiarModo = () => {
    setModo(modo === 'entrar' ? 'crear' : 'entrar');
    setError(null);
    setInfo(null);
  };

  return (
    <div className="noise-bg flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass w-full max-w-md rounded-3xl px-8 py-12 text-center sm:px-12"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red/15"
        >
          <Heart className="h-6 w-6 text-red-bright" fill="currentColor" />
        </motion.div>

        <h1 className="font-display text-3xl font-semibold sm:text-4xl">princesa-Mile</h1>
        <p className="mt-3 text-sm text-text-muted sm:text-base">{configDemo.lema}</p>

        <form onSubmit={handleSubmit} className="mt-9 space-y-3">
          <AnimatePresence initial={false}>
            {modo === 'crear' && (
              <motion.input
                key="nombre"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                required
                className="w-full rounded-xl border border-border bg-panel/70 px-4 py-3 text-center text-sm text-white placeholder:text-text-muted focus:border-red/60 focus:outline-none focus:ring-2 focus:ring-red/20"
              />
            )}
          </AnimatePresence>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            required
            className="w-full rounded-xl border border-border bg-panel/70 px-4 py-3 text-center text-sm text-white placeholder:text-text-muted focus:border-red/60 focus:outline-none focus:ring-2 focus:ring-red/20"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            minLength={6}
            className="w-full rounded-xl border border-border bg-panel/70 px-4 py-3 text-center text-sm text-white placeholder:text-text-muted focus:border-red/60 focus:outline-none focus:ring-2 focus:ring-red/20"
          />

          <button
            type="submit"
            disabled={cargando}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-dark to-red px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-red/20 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-red/30 active:translate-y-0 disabled:opacity-60"
          >
            {cargando && <Loader2 className="h-4 w-4 animate-spin" />}
            {modo === 'entrar' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        {error && <p className="mt-3 text-xs text-red-bright">{error}</p>}
        {info && <p className="mt-3 text-xs text-text-muted">{info}</p>}

        <button onClick={cambiarModo} className="mt-6 text-xs text-text-muted underline decoration-dotted hover:text-red-bright">
          {modo === 'entrar' ? '¿No tenés cuenta? Creá una' : '¿Ya tenés cuenta? Entrá'}
        </button>
      </motion.div>
    </div>
  );
}
