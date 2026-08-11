import { LogOut, Database, Info, ShieldCheck, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { SectionTitle, GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useUsuarios } from '../hooks/useUsuarios';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Rol } from '../types';

const ROL_LABEL: Record<string, string> = {
  admin: 'Administrador',
  editor: 'Editor',
  visualizador: 'Visualizador',
};

const ROLES: Rol[] = ['visualizador', 'editor', 'admin'];

function GestionUsuarios() {
  const { usuarios, loading, cambiarRol } = useUsuarios(true);

  const handleChange = async (id: string, rol: Rol) => {
    const ok = await cambiarRol(id, rol);
    if (ok) toast.success('Rol actualizado');
    else toast.error('No se pudo actualizar el rol');
  };

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="mb-3 flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red/15">
          <Users className="h-4 w-4 text-red-bright" />
        </div>
        <div>
          <p className="text-sm font-medium">Usuarios y roles</p>
          <p className="text-xs text-text-muted">Solo vos ves esto. Cada quien crea su cuenta desde "Crear cuenta" en el login.</p>
        </div>
      </div>

      {loading && <p className="text-xs text-text-muted">Cargando...</p>}
      {!loading && usuarios.length === 0 && <p className="text-xs text-text-muted">Todavía no se registró nadie más.</p>}

      <div className="space-y-2">
        {usuarios.map((u) => (
          <div key={u.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-panel/70 px-3.5 py-2.5">
            <span className="truncate text-sm">{u.nombre}</span>
            <select
              value={u.rol}
              onChange={(e) => handleChange(u.id, e.target.value as Rol)}
              className="rounded-lg border border-border bg-panel-2 px-2 py-1.5 text-xs text-white focus:border-red/60 focus:outline-none"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROL_LABEL[r]}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export function Settings() {
  const { logout, nombre, rol, esAdmin, duracionSesion, setDuracionSesion } = useAuth();

  return (
    <div>
      <SectionTitle eyebrow="Ajustes" title="Configuración" />

      <div className="space-y-4">
        {rol && (
          <GlassCard className="flex items-center gap-4 p-5" hover={false}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red/15">
              <ShieldCheck className="h-4 w-4 text-red-bright" />
            </div>
            <div>
              <p className="text-sm font-medium">{nombre ?? 'Tu cuenta'}</p>
              <p className="text-xs text-text-muted">Rol: {ROL_LABEL[rol] ?? rol}</p>
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-5" hover={false}>
          <div className="mb-3 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red/15">
              <Clock className="h-4 w-4 text-red-bright" />
            </div>
            <div>
              <p className="text-sm font-medium">Mantener sesión iniciada</p>
              <p className="text-xs text-text-muted">Elegí cuánto tiempo querés seguir conectada.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDuracionSesion('siempre')}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                duracionSesion === 'siempre'
                  ? 'border-red/60 bg-red/15 text-white'
                  : 'border-border bg-panel/70 text-text-muted hover:border-red/30'
              }`}
            >
              Siempre
            </button>
            <button
              onClick={() => setDuracionSesion('1h')}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                duracionSesion === '1h'
                  ? 'border-red/60 bg-red/15 text-white'
                  : 'border-border bg-panel/70 text-text-muted hover:border-red/30'
              }`}
            >
              1 hora
            </button>
          </div>
        </GlassCard>

        {esAdmin && <GestionUsuarios />}

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
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm text-text-muted transition-colors hover:border-red/40 hover:text-red-bright"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
