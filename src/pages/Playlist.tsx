import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { SectionTitle } from '../components/ui/GlassCard';

// Puedes cambiar la playlist sin tocar código: define VITE_SPOTIFY_PLAYLIST_URL
// en tu .env con el link de "Compartir > Copiar enlace" de Spotify.
const SPOTIFY_PLAYLIST_URL =
  (import.meta.env.VITE_SPOTIFY_PLAYLIST_URL as string | undefined) ??
  'https://open.spotify.com/playlist/54vCPeGO08V1BkjmN1FTBF?si=80887541af7e4d8f';

function getSpotifyPlaylistId(url: string): string | null {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function SpotifyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.719-.66 13.439 1.62.361.181.54.78.302 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function SpotifyEmbed() {
  const playlistId = getSpotifyPlaylistId(SPOTIFY_PLAYLIST_URL);

  if (!playlistId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative overflow-hidden rounded-3xl"
    >
      <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-red/10 blur-3xl" />
      <div className="relative flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1DB954]/15">
            <SpotifyLogo className="h-4.5 w-4.5 text-[#1DB954]" />
          </span>
          <div>
            <p className="text-sm font-medium">Su playlist</p>
            <p className="text-xs text-text-muted">Conectada en vivo con Spotify</p>
          </div>
        </div>
        <a
          href={SPOTIFY_PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-text-muted transition-colors hover:border-[#1DB954]/40 hover:text-[#1DB954]"
        >
          Abrir en Spotify <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="relative p-3 sm:p-5">
        <iframe
          title="Playlist de Spotify"
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
          width="100%"
          height="660"
          style={{ borderRadius: '16px', border: 0, display: 'block' }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}

export function Playlist() {
  return (
    <div>
      <SectionTitle eyebrow="Nuestra playlist" title="Playlist" subtitle="Las canciones que nos han acompañado." />
      <SpotifyEmbed />
    </div>
  );
}
