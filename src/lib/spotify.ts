// Link de "Compartir > Copiar enlace" de Spotify. Se puede sobreescribir sin tocar
// código definiendo VITE_SPOTIFY_PLAYLIST_URL en el .env.
export const SPOTIFY_PLAYLIST_URL =
  (import.meta.env.VITE_SPOTIFY_PLAYLIST_URL as string | undefined) ??
  'https://open.spotify.com/playlist/54vCPeGO08V1BkjmN1FTBF?si=80887541af7e4d8f';

export function getSpotifyPlaylistId(url: string): string | null {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}
