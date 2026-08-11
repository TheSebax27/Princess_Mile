import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Rol, Usuario } from '../types';

type DuracionSesion = 'siempre' | '1h';

interface AuthResult {
  ok: boolean;
  error?: string;
  requiereConfirmacion?: boolean;
}

interface AuthContextValue {
  isUnlocked: boolean;
  loading: boolean;
  nombre: string | null;
  rol: Rol | null;
  puedeEditar: boolean;
  esAdmin: boolean;
  duracionSesion: DuracionSesion;
  setDuracionSesion: (d: DuracionSesion) => void;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string, nombre: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const KEY_LOGIN_AT = 'princesa-mile:login-at';
const KEY_DURACION = 'princesa-mile:duracion-sesion';
const UNA_HORA_MS = 60 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [duracionSesion, setDuracionSesionState] = useState<DuracionSesion>(
    () => (localStorage.getItem(KEY_DURACION) as DuracionSesion) || 'siempre',
  );

  const cargarUsuario = async (authId: string) => {
    if (!supabase) return;
    const { data } = await supabase.from('usuarios').select('*').eq('auth_id', authId).maybeSingle();
    setUsuario((data as Usuario | null) ?? null);
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem(KEY_LOGIN_AT);
    setSession(null);
    setUsuario(null);
  };

  const setDuracionSesion = (d: DuracionSesion) => {
    setDuracionSesionState(d);
    localStorage.setItem(KEY_DURACION, d);
    if (d === 'siempre') localStorage.removeItem(KEY_LOGIN_AT);
    else if (!localStorage.getItem(KEY_LOGIN_AT)) localStorage.setItem(KEY_LOGIN_AT, String(Date.now()));
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase no está configurado' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    localStorage.setItem(KEY_LOGIN_AT, String(Date.now()));
    return { ok: true };
  };

  const signup = async (email: string, password: string, nombre: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: 'Supabase no está configurado' };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { ok: false, error: error.message };
    if (!data.user) return { ok: false, error: 'No se pudo crear la cuenta' };

    if (!data.session) {
      // El proyecto de Supabase pide confirmar el correo antes de dar sesión
      return { ok: true, requiereConfirmacion: true };
    }

    // Siempre "visualizador": nadie puede auto-asignarse admin/editor desde acá
    await supabase.from('usuarios').insert({ auth_id: data.user.id, nombre, rol: 'visualizador' });
    await cargarUsuario(data.user.id);
    localStorage.setItem(KEY_LOGIN_AT, String(Date.now()));
    return { ok: true };
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) cargarUsuario(data.session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) cargarUsuario(s.user.id);
      else setUsuario(null);
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si eligió "1 hora", cierra la sesión sola cuando se cumple
  useEffect(() => {
    if (!session || duracionSesion !== '1h') return;
    const loginAt = Number(localStorage.getItem(KEY_LOGIN_AT) ?? Date.now());
    const restante = UNA_HORA_MS - (Date.now() - loginAt);
    if (restante <= 0) {
      logout();
      return;
    }
    const timer = setTimeout(() => logout(), restante);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, duracionSesion]);

  const rol = usuario?.rol ?? null;

  return (
    <AuthContext.Provider
      value={{
        isUnlocked: !isSupabaseConfigured || Boolean(session),
        loading,
        nombre: usuario?.nombre ?? null,
        rol,
        puedeEditar: rol === 'admin' || rol === 'editor',
        esAdmin: rol === 'admin',
        duracionSesion,
        setDuracionSesion,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
