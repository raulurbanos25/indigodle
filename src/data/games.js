// Lista de modos de juego. Para añadir uno, basta con añadir un objeto aquí.
// "listo" cambiará a true cuando el modo esté terminado.
// "bloque" indica qué tipo de datos necesita (A, B o C, ver plan del proyecto).
export const GAMES = [
  // Bloque A: solo necesitan datos de discografía verificados
  {
    id: 'clasico',
    titulo: 'CLASICO',
    descripcion:
      'Adivina la canción secreta del día comparando álbum, año, duración y colaboraciones.',
    ruta: '/jugar/clasico',
    icono: '🎯',
    listo: true,
    bloque: 'A',
  },
   {
    id: 'tracklist',
    titulo: 'TRACKLIST',
    descripcion: 'Escribe todas las canciones de un álbum.',
    ruta: '/jugar/tracklist',
    icono: '💿', // icono de texto de reserva (la cinta de Inicio, por ejemplo)
    iconoAnimado: 'albumes', // en las tarjetas sale la escalera de álbumes animada
    listo: true,
    bloque: 'A',
  },
  {
    id: 'intruso',
    titulo: 'INTRUSO',
    descripcion: 'Encuentra las canciones que no pertenecen al álbum.',
    ruta: '/jugar/intruso',
    icono: '🕵️',
    listo: true,
    bloque: 'A',
  },
  {
    id: 'invitados',
    titulo: 'INVITADOS',
    descripcion:
      'Van apareciendo los artistas invitados de un álbum. Adivina el álbum en 5 intentos.',
    ruta: '/jugar/invitados',
    icono: '🎭',
    listo: true,
    bloque: 'A',
  },
  {
    id: 'duo',
    titulo: 'DUO',
    descripcion: 'Te damos una canción y tienes que adivinar el artista invitado.',
    ruta: '/jugar/duo',
    icono: '🤝',
    listo: true,
    bloque: 'A',
  },
  {
    id: 'cronologia',
    titulo: 'CRONOLOGIA',
    descripcion: 'Ordena canciones de la más antigua a la más reciente.',
    ruta: '/jugar/cronologia',
    icono: '⏳',
    listo: true,
    bloque: 'A',
  },

  // Bloque B: necesitan datos de popularidad (con fuente y fecha)
  {
    id: 'top10',
    titulo: 'TOP 10',
    descripcion: 'Coloca las 10 canciones más escuchadas en su orden correcto.',
    ruta: '/jugar/top10',
    icono: '🔟',
    listo: true,
    bloque: 'B',
  },
  {
    id: 'ranking',
    titulo: 'DUELO MUSICAL',
    descripcion: 'Compara canciones: descubre cuál salió antes o cuál dura más.',
    ruta: '/jugar/ranking',
    icono: '📊',
    listo: true,
    bloque: 'B',
  },

  // Bloque C: dependen de derechos de uso o de decisiones técnicas
  {
    id: 'palabra',
    titulo: 'PALABRA DEL DIA',
    descripcion: 'Adivina la palabra del día, tipo Wordle, relacionada con su música.',
    ruta: '/jugar/palabra',
    icono: '🔤',
    listo: true,
    bloque: 'C',
  },
  {
    id: 'portada',
    titulo: 'PORTADA',
    descripcion: 'Adivina el álbum o single a partir de su portada difuminada.',
    ruta: '/jugar/portada',
    icono: '🖼️',
    listo: true,
    bloque: 'C',
  },
  {
    id: 'escucha',
    titulo: 'ESCUCHA',
    descripcion: 'Adivina la canción con fragmentos cada vez más largos.',
    ruta: '/jugar/escucha',
    icono: '🎧',
    listo: true,
    bloque: 'C',
  },
]
