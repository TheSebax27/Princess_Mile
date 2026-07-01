import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { configDemo } from '../data/demoData';

export function Login() {
  const { unlock } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const hasCode = Boolean(import.meta.env.VITE_ACCESS_CODE);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ok = unlock(code);
    if (!ok) {
      setError(true);
      setTimeout(() => setError(false), 1600);
    }
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

        <form onSubmit={handleSubmit} className="mt-9 space-y-4">
          {hasCode && (
            <motion.input
              animate={error ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código de acceso"
              className="w-full rounded-xl border border-border bg-panel/70 px-4 py-3 text-center text-sm text-white placeholder:text-text-muted focus:border-red/60 focus:outline-none focus:ring-2 focus:ring-red/20"
            />
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-red-dark to-red px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-red/20 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-red/30 active:translate-y-0"
          >
            Entrar
          </button>
        </form>

        {error && (
          <p className="mt-3 text-xs text-red-bright">Ese código no es correcto. Intenta otra vez.</p>
        )}
      </motion.div>
    </div>
  );
}
