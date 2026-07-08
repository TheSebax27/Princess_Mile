export interface Mensaje {
  id: string;
  numero: number;
  titulo: string;
  contenido: string;
  fecha: string;
  leido: boolean;
}

export interface FotoGaleria {
  id: string;
  url: string;
  titulo?: string;
  descripcion?: string;
  fecha?: string;
  ancho: number;
  alto: number;
}

export interface CancionPlaylist {
  id: string;
  titulo: string;
  artista: string;
  portada_url: string;
  audio_url: string;
  duracion: number; // segundos
  orden: number;
}

export interface Razon {
  id: string;
  numero: number;
  texto: string;
  emoji: string;
}

export interface Gusto {
  id: string;
  categoria: string;
  nombre: string;
  icono: string;
}

export interface EventoTimeline {
  id: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  icono?: string;
}

export interface Secreto {
  id: string;
  fecha_desbloqueo: string;
  contenido?: string;
  desbloqueado: boolean;
}

export interface Frase {
  id: string;
  texto: string;
}

// "Quién es": datos base (fila única, tabla `biografia`)
export interface BiografiaInfo {
  id?: number;
  nombre: string;
  apodo?: string;
  frase_corta: string;
  bio: string;
}

// "Quién es": rasgos de personalidad (tabla `rasgos`, una fila por rasgo)
export interface Rasgo {
  id: string;
  texto: string;
  orden?: number;
}

// "Quién es": curiosidades (tabla `curiosidades`, una fila por curiosidad)
export interface Curiosidad {
  id: string;
  emoji: string;
  texto: string;
  orden?: number;
}

export interface Configuracion {
  nombre_visitante: string;
  nombre_ella: string;
  lema: string;
}
