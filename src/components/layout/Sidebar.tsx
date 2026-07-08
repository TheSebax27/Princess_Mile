import { NavLink } from 'react-router-dom';
import {
  Home,
  Mail,
  Image,
  Music,
  Flower2,
  CalendarHeart,
  MapPin,
  Lock,
  Settings,
  Heart,
} from 'lucide-react';
import clsx from 'clsx';

const links = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/mensajes', label: 'Mensajes', icon: Mail },
  { to: '/galeria', label: 'Galería', icon: Image },
  { to: '/playlist', label: 'Playlist', icon: Music },
  { to: '/quien-es', label: 'Quién es', icon: Flower2 },
  { to: '/fechas', label: 'Fechas', icon: CalendarHeart },
  { to: '/planes', label: 'Planes', icon: MapPin },
  { to: '/secreto', label: 'Secreto', icon: Lock },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-panel/60 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-6 py-6">
        <Heart className="h-5 w-5 text-red-bright" fill="currentColor" />
        <span className="font-display text-lg font-semibold tracking-wide">
          princesa-Mile
        </span>
      </div>

      <div className="mx-5 h-px bg-border" />

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300',
                isActive
                  ? 'bg-red/15 text-white shadow-[inset_0_0_0_1px_rgba(193,18,31,0.35)]'
                  : 'text-text-muted hover:bg-white/[0.04] hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-red-bright" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mx-5 h-px bg-border" />

      <div className="px-3 py-4">
        <NavLink
          to="/configuracion"
          onClick={onNavigate}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
              isActive ? 'text-white' : 'text-text-muted hover:text-white',
            )
          }
        >
          <Settings className="h-4 w-4" />
          Configuración
        </NavLink>
      </div>
    </aside>
  );
}
