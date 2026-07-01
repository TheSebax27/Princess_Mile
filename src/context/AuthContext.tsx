import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface AuthContextValue {
  isUnlocked: boolean;
  unlock: (code: string) => boolean;
  lock: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'princesa-mile:unlocked';

// Optional access code. Set VITE_ACCESS_CODE in .env to require one;
// leave it empty to let anyone with the link straight in.
const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE as string | undefined;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (!ACCESS_CODE) return true;
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    if (isUnlocked) sessionStorage.setItem(STORAGE_KEY, 'true');
  }, [isUnlocked]);

  const unlock = (code: string) => {
    if (!ACCESS_CODE || code.trim().toLowerCase() === ACCESS_CODE.trim().toLowerCase()) {
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  const lock = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsUnlocked(false);
  };

  return (
    <AuthContext.Provider value={{ isUnlocked, unlock, lock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
