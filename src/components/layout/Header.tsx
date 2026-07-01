import { Search, Menu } from 'lucide-react';
import { useMemo } from 'react';
import { configDemo } from '../../data/demoData';

const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const fecha = useMemo(() => {
    const now = new Date();
    return `${dias[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]}`;
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-bg/70 px-5 py-4 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-text-muted hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-medium sm:text-2xl">
            Hola, {configDemo.nombre_visitante}
          </h1>
          <p className="text-xs capitalize text-text-muted sm:text-sm">{fecha}</p>
        </div>
      </div>

      <label className="relative hidden w-64 items-center sm:flex">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full rounded-full border border-border bg-panel/70 py-2 pl-9 pr-4 text-sm text-white placeholder:text-text-muted focus:border-red/60 focus:outline-none focus:ring-2 focus:ring-red/20"
        />
      </label>
    </header>
  );
}
