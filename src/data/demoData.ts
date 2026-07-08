import type {
  Mensaje,
  FotoGaleria,
  CancionPlaylist,
  Razon,
  Gusto,
  EventoTimeline,
  Frase,
  Configuracion,
  BiografiaInfo,
  Rasgo,
  Curiosidad,
} from '../types';

// ⚠️ Todo lo de abajo es solo el "fallback" que se muestra si Supabase no
// está configurado (o no responde). Con Supabase conectado, la página
// "Quién es" lee de las tablas `biografia`, `rasgos`, `curiosidades` y
// `gustos` — edítalas ahí (o desde el futuro panel de administrador).
export const biografiaInfoDemo: BiografiaInfo = {
  nombre: 'Milena Vargas',
  apodo: 'Princesa',
  frase_corta: 'Es de esas personas que llegan sin hacer ruido... y terminan cambiando todo.',
  bio: `Milena Vargas es una señorita oriunda de Boyacá, que ha vivido toda su vida en Floresta. Le encantan los animales, la política y una buena pelea de vez en cuando — tiene un carácter fuerte y no se queda callada ante nada.

Pero detrás de ese carácter hay una niña muy cariñosa, que se ganó mi corazón poco a poco, sin prisa, hasta convertirse en una de las personas más importantes de mi vida.`,
};

export const rasgosDemo: Rasgo[] = [
  { id: 'r1', texto: 'Cariñosa' },
  { id: 'r2', texto: 'Peleona' },
  { id: 'r3', texto: 'Apasionada' },
  { id: 'r4', texto: 'Amante de los animales' },
  { id: 'r5', texto: 'Auténtica' },
  { id: 'r6', texto: 'Boyacense de corazón' },
];

export const curiosidadesDemo: Curiosidad[] = [
  { id: 'c1', emoji: '🐾', texto: 'Ama a los animales más que a casi nada' },
  { id: 'c2', emoji: '🏞️', texto: 'Toda su vida en Floresta, Boyacá' },
  { id: 'c3', emoji: '🗣️', texto: 'Le encanta la política y defender lo que piensa' },
  { id: 'c4', emoji: '⚔️', texto: 'No le teme a una buena pelea' },
];

export const configDemo: Configuracion = {
  nombre_visitante: 'mi niña hermosa',
  nombre_ella: 'Mile',
  lema: 'Un lugar donde cada recuerdo encuentra su espacio.',
};

export const frasesDemo: Frase[] = [
  { id: 'f1', texto: 'Siempre hay algo nuevo para descubrir.' },
  { id: 'f2', texto: 'Cada rincón de este lugar tiene un pedazo de nosotros.' },
  { id: 'f3', texto: 'Hoy, como todos los días, pienso en ti.' },
];

export const mensajesDemo: Mensaje[] = [
  {
    id: 'm1',
    numero: 15,
    titulo: 'Mensaje del día',
    contenido:
      'Hoy solo quería decirte que, sin importar cuánto ruido tenga el día, siempre hay un momento en el que pienso en ti y todo se siente un poco más tranquilo. Gracias por existir de la forma en la que existes.',
    fecha: '2026-06-30',
    leido: false,
  },
  {
    id: 'm2',
    numero: 14,
    titulo: 'Una carta cualquiera',
    contenido:
      'No necesito una fecha especial para escribirte. A veces las mejores cartas nacen de un martes cualquiera, de un recuerdo random, de unas ganas enormes de decirte lo importante que eres.',
    fecha: '2026-06-24',
    leido: true,
  },
  {
    id: 'm3',
    numero: 13,
    titulo: 'Sobre nosotros',
    contenido:
      'Me gusta pensar que estamos construyendo algo que va a envejecer bien, como esas cosas que mejoran con el tiempo. Este espacio es apenas el comienzo.',
    fecha: '2026-06-10',
    leido: true,
  },
];

export const galeriaDemo: FotoGaleria[] = [
  { id: 'g1', url: 'https://picsum.photos/seed/mile01/600/800', titulo: 'Un día cualquiera', ancho: 600, alto: 800 },
  { id: 'g2', url: 'https://picsum.photos/seed/mile02/600/450', titulo: 'Atardecer', ancho: 600, alto: 450 },
  { id: 'g3', url: 'https://picsum.photos/seed/mile03/600/900', titulo: 'Esa sonrisa', ancho: 600, alto: 900 },
  { id: 'g4', url: 'https://picsum.photos/seed/mile04/600/600', titulo: 'Café de domingo', ancho: 600, alto: 600 },
  { id: 'g5', url: 'https://picsum.photos/seed/mile05/600/750', titulo: 'Caminata', ancho: 600, alto: 750 },
  { id: 'g6', url: 'https://picsum.photos/seed/mile06/600/500', titulo: 'Risas', ancho: 600, alto: 500 },
  { id: 'g7', url: 'https://picsum.photos/seed/mile07/600/850', titulo: 'Viaje', ancho: 600, alto: 850 },
  { id: 'g8', url: 'https://picsum.photos/seed/mile08/600/650', titulo: 'Nosotros', ancho: 600, alto: 650 },
];

export const playlistDemo: CancionPlaylist[] = [
  { id: 'p1', titulo: 'Perfect', artista: 'Ed Sheeran', portada_url: 'https://picsum.photos/seed/song1/200/200', audio_url: '', duracion: 263, orden: 1 },
  { id: 'p2', titulo: 'All of Me', artista: 'John Legend', portada_url: 'https://picsum.photos/seed/song2/200/200', audio_url: '', duracion: 269, orden: 2 },
  { id: 'p3', titulo: 'La Bicicleta', artista: 'Carlos Vives, Shakira', portada_url: 'https://picsum.photos/seed/song3/200/200', audio_url: '', duracion: 222, orden: 3 },
  { id: 'p4', titulo: 'Photograph', artista: 'Ed Sheeran', portada_url: 'https://picsum.photos/seed/song4/200/200', audio_url: '', duracion: 258, orden: 4 },
];

export const razonesDemo: Razon[] = [
  { id: 'r1', numero: 18, texto: 'Tu sonrisa', emoji: '❤️' },
  { id: 'r2', numero: 17, texto: 'La forma en que te emocionas contando algo', emoji: '✨' },
  { id: 'r3', numero: 16, texto: 'Tu paciencia conmigo', emoji: '🌷' },
  { id: 'r4', numero: 15, texto: 'Cómo cuidas a las personas que quieres', emoji: '🫶' },
  { id: 'r5', numero: 14, texto: 'Tu curiosidad por todo', emoji: '📚' },
  { id: 'r6', numero: 13, texto: 'Que seas tan tú, siempre', emoji: '🌙' },
];

export const gustosDemo: Gusto[] = [
  { id: 'gu1', categoria: 'Política', nombre: 'Petro, presidente de Colombia', icono: '🇨🇴' },
  { id: 'gu2', categoria: 'Viajes', nombre: 'Ir a pueblos', icono: '🏘️' },
  { id: 'gu3', categoria: 'Personalidad', nombre: 'Que la traten bonito', icono: '💐' },
  { id: 'gu4', categoria: 'Fútbol', nombre: 'Atlético Nacional', icono: '⚽' },
  { id: 'gu5', categoria: 'Animales', nombre: 'Animales en general', icono: '🐾' },
  { id: 'gu6', categoria: 'Política', nombre: 'Debates y política', icono: '🗳️' },
];

export const timelineDemo: EventoTimeline[] = [
  { id: 't1', fecha: '2026-05-14', titulo: 'El primer mensaje', descripcion: 'Todo empezó con una conversación que no queríamos que terminara.', icono: '💬' },
  { id: 't2', fecha: '2026-05-22', titulo: 'La primera vez que nos vimos', descripcion: 'Nervios, risas y la certeza de que valía la pena.', icono: '🌷' },
  { id: 't3', fecha: '2026-08-01', titulo: 'Spider-Man: Brand New Day', descripcion: 'Plan pendiente: verla juntos en el cine.', icono: '🎬' },
  { id: 't4', fecha: '2026-08-31', titulo: 'Cumpleaños de Milena', descripcion: 'Su día. A celebrarla como se merece.', icono: '🎂' },
];

