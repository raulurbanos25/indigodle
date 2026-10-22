import {
  DemoClasico,
  DemoTracklist,
  DemoIntruso,
  DemoInvitados,
  DemoDuo,
  DemoCronologia,
  DemoPalabra,
  DemoPortada,
  DemoEscucha,
} from './Demos.jsx'

// "total" es el número de pasos y debe coincidir con la cantidad de "leyendas".
// La clave es la que usa "demo" en data/rules.js.
export const DEMOS = {
  clasico: {
    Componente: DemoClasico,
    total: 6,
    intervalo: 1900,
    titulo: 'Modo Clásico',
    leyendas: [
      'Empiezas con la tabla vacía y 6 intentos.',
      'Escribes el nombre de una canción en el buscador.',
      'Cada casilla se compara con la secreta: ✔ coincide, ✖ no. Las flechas indican si el valor buscado es mayor (↑) o menor (↓).',
      'Con esa información eliges mejor la siguiente canción.',
      'Todas las casillas en verde: es la canción secreta.',
      '¡Resuelto en 2 de 6 intentos!',
    ],
    descripcion:
      'Vista animada del modo Clásico: se escribe una canción, la tabla compara sus atributos con la canción secreta con casillas verdes y rojas y flechas, y en el segundo intento todas las casillas salen en verde.',
  },
  tracklist: {
    Componente: DemoTracklist,
    total: 7,
    intervalo: 1600,
    titulo: 'Modo Tracklist',
    leyendas: [
      'Hay un álbum del día con sus huecos por descubrir.',
      'Escribes el nombre de una canción.',
      'Es del álbum: ocupa el hueco de su número de pista y se pone en verde.',
      'Pruebas otra canción.',
      'No es del álbum: aparece como fallo (máximo 5).',
      'Sigues encontrando canciones.',
      '¡Álbum completado!',
    ],
    descripcion:
      'Vista animada del modo Tracklist: se escriben canciones, las que pertenecen al álbum rellenan su hueco en verde, una que no pertenece aparece como fallo, y al final se completa el álbum.',
  },
  intruso: {
    Componente: DemoIntruso,
    total: 6,
    intervalo: 1700,
    titulo: 'Modo Intruso',
    leyendas: [
      'Entre estas canciones hay 2 intrusas que no son del álbum.',
      'Tocas una canción que crees que es intrusa.',
      'Era del álbum: se marca en rojo y cuenta como fallo.',
      'Pruebas con otra.',
      '¡Intrusa encontrada! Se marca en verde.',
      'Encuentras la última: ¡has ganado!',
    ],
    descripcion:
      'Vista animada del modo Intruso: se tocan tarjetas de canciones, una del álbum se marca en rojo como fallo y las dos intrusas se marcan en verde hasta ganar.',
  },
  invitados: {
    Componente: DemoInvitados,
    total: 5,
    intervalo: 1800,
    titulo: 'Modo Invitados',
    leyendas: [
      'Solo ves un invitado del álbum secreto. Los demás están ocultos.',
      'Escribes el nombre de un álbum.',
      'Fallo: aparece un invitado más como pista.',
      'Con más información, pruebas otro álbum.',
      '¡Es ese! Se revela el álbum y todos sus invitados.',
    ],
    descripcion:
      'Vista animada del modo Invitados: empieza con un invitado visible, un fallo desvela otro, y el segundo intento acierta el álbum y muestra todos los invitados.',
  },
  duo: {
    Componente: DemoDuo,
    total: 5,
    intervalo: 1800,
    titulo: 'Modo Dúo',
    leyendas: [
      'Solo ves el título de la canción. Hay que adivinar quién colabora.',
      'Escribes el nombre de un artista.',
      'Fallo: se desbloquea la primera pista, el año.',
      'Pruebas con otro artista.',
      '¡Acierto! Se revelan todas las pistas.',
    ],
    descripcion:
      'Vista animada del modo Dúo: se ve un título de canción, un artista erróneo desbloquea la pista del año, y el segundo artista acierta y revela todas las pistas.',
  },
  cronologia: {
    Componente: DemoCronologia,
    total: 6,
    intervalo: 1700,
    titulo: 'Modo Cronología',
    leyendas: [
      'Hay que ordenar de la más antigua a la más reciente. Empiezas por el hueco 1.',
      'Tocas una canción que no va ahí: se marca en rojo (fallo).',
      'Tocas la correcta: ocupa el hueco y descubres su año.',
      'Sigues con el hueco 2.',
      'Y con el hueco 3.',
      'La última se coloca sola: ¡orden perfecto!',
    ],
    descripcion:
      'Vista animada del modo Cronología: se coloca una canción equivocada que falla, y luego las canciones se ordenan por año en sus huecos hasta completar el orden.',
  },
  palabra: {
    Componente: DemoPalabra,
    total: 5,
    intervalo: 1900,
    titulo: 'Modo Palabra',
    leyendas: [
      'Tienes que adivinar una palabra de 5 letras en 6 intentos.',
      'Escribes una palabra de 5 letras.',
      'Verde: letra bien colocada. Amarillo: está en otro sitio. Gris: no está.',
      'Usas las pistas para elegir la siguiente palabra.',
      '¡Todas en verde: palabra acertada!',
    ],
    descripcion:
      'Vista animada del modo Palabra: se envían tres palabras de cinco letras, las letras se colorean en verde, amarillo o gris, y la tercera palabra sale toda en verde.',
  },
  portada: {
    Componente: DemoPortada,
    total: 5,
    intervalo: 1900,
    titulo: 'Modo Portada',
    leyendas: [
      'La portada aparece muy borrosa y ampliada.',
      'Escribes el nombre de un álbum o single.',
      'Fallo: la imagen se ve más nítida y más completa.',
      'Otro fallo: aún más clara.',
      '¡Acierto! La portada se revela entera.',
    ],
    descripcion:
      'Vista animada del modo Portada: una imagen muy borrosa se va haciendo más nítida con cada fallo hasta que se acierta y se muestra entera.',
  },
    escucha: {
    Componente: DemoEscucha,
    total: 6,
    intervalo: 1800,
    titulo: 'Modo Escucha',
    leyendas: [
      'Suena solo 1 segundo del principio de la canción. Hay que adivinarla.',
      'Escribes el título de la canción que crees que es.',
      'Fallo: el fragmento crece a 2 segundos.',
      'También puedes saltar para oír un segundo más sin responder.',
      'Con 3 segundos, escribes otra respuesta.',
      '¡Acierto! Se revela el título y la portada.',
    ],
    descripcion:
      'Vista animada del modo Escucha: la barra empieza con un segundo desbloqueado, un fallo y un salto la amplían hasta tres segundos, y la tercera respuesta acierta y revela la canción.',
  },
}
