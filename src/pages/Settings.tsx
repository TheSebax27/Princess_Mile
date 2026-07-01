import { LogOut, Database, Info } from 'lucide-react';
import { SectionTitle, GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

export function Settings() {
  const { lock } = useAuth();

  return (
    <div>
      <SectionTitle eyebrow="Ajustes" title="Configuración" />

      <div className="space-y-4">
        <GlassCard className="flex items-center gap-4 p-5" hover={false}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red/15">
            <Database className="h-4 w-4 text-red-bright" />
          </div>
          <div>
            <p className="text-sm font-medium">Conexión a Supabase</p>
            <p className="text-xs text-text-muted">
              {isSupabaseConfigured
                ? 'Conectado. Los datos se están leyendo desde tu base de datos.'
                : 'Modo demo: configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu .env para usar datos reales.'}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 p-5" hover={false}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red/15">
            <Info className="h-4 w-4 text-red-bright" />
          </div>
          <div>
            <p className="text-sm font-medium">princesa-Mile</p>
            <p className="text-xs text-text-muted">Versión 1.0.0</p>
          </div>
        </GlassCard>

        <button
          onClick={lock}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm text-text-muted transition-colors hover:border-red/40 hover:text-red-bright"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
