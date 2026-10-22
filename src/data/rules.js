// Normas que valen para todos los modos
export const NORMAS_GENERALES = [
  {
    icono: '📅',
    titulo: 'Un reto nuevo cada día',
    texto: 'Cada modo estrena reto a medianoche, hora de tu zona. Mañana tendrás uno distinto.',
  },
  {
    icono: '🔒',
    titulo: 'Una partida por modo',
    texto:
      'Cuando terminas un modo, ganes o pierdas, se bloquea hasta el día siguiente. Podrás ver tu resultado, pero no volver a jugarlo.',
  },
  {
    icono: '🌍',
    titulo: 'El mismo reto para todos',
    texto: 'La canción, el álbum o la palabra del día son los mismos para todos los jugadores.',
  },
  {
    icono: '💾',
    titulo: 'Se guarda en tu navegador',
    texto:
      'Tu partida se guarda en este dispositivo, así que puedes cerrar la pestaña y seguir luego. Si borras los datos del navegador, se pierde.',
  },
]

// Explicación de cada modo. La clave es el id del modo en games.js.
// "demo" es la clave de la animación en components/howto/demosConfig.js.
export const REGLAS = {
  clasico: {
    resumen:
      'Hay una canción secreta del día. Tú escribes canciones y la web compara cada una con la secreta, atributo por atributo, para que vayas acercándote.',
    pasos: [
      'Escribe el nombre de una canción en el buscador y elígela de la lista.',
      'Aparece una fila nueva. Cada casilla compara un atributo con la canción secreta: verde con ✔ si coincide y rojo con ✖ si no.',
      'En Año, Duración y Pista, una flecha te indica hacia dónde buscar: ↑ si el valor buscado es mayor que el tuyo y ↓ si es menor.',
      'Usa lo que has descubierto para elegir mejor la siguiente canción. Tienes 6 intentos.',
    ],
    datos: [
      { etiqueta: 'Intentos', valor: '6' },
      { etiqueta: 'Se compara', valor: 'Álbum, año, duración, pista, colaboración y single' },
      { etiqueta: 'Repetir canciones', valor: 'No se puede' },
    ],
    consejo:
      'Empieza por una canción de un álbum con muchas canciones: si aciertas la casilla del álbum, descartas de golpe todas las demás.',
    demo: 'clasico',
  },

  tracklist: {
    resumen:
      'Cada día hay un álbum. Tu misión es encontrar todas sus canciones escribiéndolas una a una.',
    pasos: [
      'Mira el álbum del día: verás su título, el año y cuántas canciones tiene.',
      'Escribe el nombre de una canción. Si pertenece al álbum, ocupa su hueco (el que corresponde a su número de pista) y se pone en verde.',
      'Si no pertenece al álbum, aparece abajo como fallo. Puedes cometer hasta 5.',
      'Ganas cuando rellenas todos los huecos. Si te atascas, puedes rendirte y ver las que faltaban.',
    ],
    datos: [
      { etiqueta: 'Fallos permitidos', valor: '5' },
      { etiqueta: 'Buscador', valor: 'No muestra el álbum de cada canción, para no regalar la respuesta' },
      { etiqueta: 'Rendirse', valor: 'Se puede en cualquier momento' },
    ],
    consejo:
      'Los huecos siguen el orden del álbum: si recuerdas que una canción abría o cerraba el disco, ya sabes qué hueco ocupa.',
    demo: 'tracklist',
  },

  intruso: {
    resumen:
      'Te enseñamos un álbum y una mezcla de canciones. Algunas son del álbum y otras no: tu trabajo es descubrir las intrusas.',
    pasos: [
      'Lee el título del álbum y cuántos intrusos hay escondidos.',
      'Toca una canción que creas que no es del álbum. Se revela al instante: verde si es un intruso, rojo si en realidad es del álbum.',
      'Cada canción roja cuenta como un fallo. Con 3 fallos termina la partida.',
      'Ganas cuando encuentras a todos los intrusos.',
    ],
    datos: [
      { etiqueta: 'Fallos permitidos', valor: '3' },
      { etiqueta: 'Intrusos', valor: 'Hasta 5, mezclados con canciones del álbum' },
      { etiqueta: 'Qué ves', valor: 'Solo el título de cada canción' },
    ],
    consejo:
      'Los intrusos pueden ser canciones de otros álbumes o singles sueltos. Si dudas, piensa en el año: ¿encaja con la época del álbum?',
    demo: 'intruso',
  },

  invitados: {
    resumen:
      'Hay un álbum secreto. Para descubrirlo, te vamos desvelando los artistas que colaboran en él, poco a poco.',
    pasos: [
      'Al empezar ves un único artista invitado del álbum. El resto aparecen como huecos.',
      'Escribe el nombre de un álbum en el buscador y elígelo.',
      'Si fallas, el álbum se queda marcado en rojo y se desvela un invitado más.',
      'Tienes 5 intentos. Al terminar se revela el álbum con su portada y todos los invitados.',
    ],
    datos: [
      { etiqueta: 'Intentos', valor: '5' },
      { etiqueta: 'Buscador', valor: 'Ofrece todos los álbumes, no solo los posibles' },
      { etiqueta: 'Oculto hasta el final', valor: 'La portada y el año del álbum' },
    ],
    consejo:
      'Un mismo artista puede colaborar en varios álbumes: no te quedes con el primero que se te ocurra.',
    demo: 'invitados',
  },

  duo: {
    resumen:
      'Te damos el título de una canción con colaboración. Debes adivinar quién es el artista invitado.',
    pasos: [
      'Lee el título de la canción. No ves nada más: ni álbum, ni año, ni invitados.',
      'Escribe el nombre de un artista en el buscador y elígelo.',
      'Cada fallo desbloquea una pista, por este orden: año, álbum, duración e inicial del invitado.',
      'Si la canción tiene varios invitados, basta con acertar uno. Tienes 5 intentos.',
    ],
    datos: [
      { etiqueta: 'Intentos', valor: '5' },
      { etiqueta: 'Pistas', valor: '4: año, álbum, duración e inicial' },
      { etiqueta: 'Buscador', valor: 'Ofrece todos los artistas que colaboran en alguna canción' },
    ],
    consejo:
      'Cada fallo te regala una pista, así que un fallo bien elegido también te acerca a la respuesta.',
    demo: 'duo',
  },

  cronologia: {
    resumen:
      'Te damos varias canciones mezcladas y tienes que colocarlas en orden, de la más antigua a la más reciente.',
    pasos: [
      'Ves una fila de huecos numerados, del más antiguo al más reciente, y debajo las canciones sin ordenar.',
      'Toca la canción que va en el hueco resaltado. Si aciertas, se coloca en verde y descubres su año.',
      'Si fallas, la canción se marca en rojo y se bloquea solo para ese hueco. Con 3 fallos termina la partida.',
      'Cuando solo queda una canción, se coloca sola. Ganas al completar el orden.',
    ],
    datos: [
      { etiqueta: 'Fallos permitidos', valor: '3' },
      { etiqueta: 'Canciones', valor: 'Hasta 5, todas de años distintos' },
      { etiqueta: 'Solución', valor: 'Siempre hay un único orden correcto' },
    ],
    consejo:
      'Fíjate en los extremos: es más fácil reconocer la más antigua o la más reciente que las del medio.',
    demo: 'cronologia',
  },

  ranking: {
    resumen:
      'Compara parejas de canciones con preguntas sobre su año de lanzamiento y su duración.',
    pasos: [
      'Cada día aparecen cinco parejas distintas de canciones.',
      'Lee la pregunta de la ronda: qué canción salió antes según su año o cuál dura más.',
      'Elige una canción y después se revelan los años o las duraciones.',
      'Al terminar, verás cuántos duelos has acertado.',
    ],
    datos: [
      { etiqueta: 'Duelos diarios', valor: '5 parejas' },
      { etiqueta: 'Preguntas', valor: 'Año y duración' },
      { etiqueta: 'Selección', valor: 'Parejas aleatorias' },
    ],
    consejo:
      'Recuerda la etapa de cada canción y compara su duración cuando aparezca esa pregunta.',
  },

  palabra: {
    resumen:
      'Adivina la palabra secreta de 5 letras. Cada intento te dice qué letras has acertado y cuáles están en otro sitio.',
    pasos: [
      'Escribe una palabra de 5 letras con tu teclado o con el del propio juego, y pulsa Enter para enviarla.',
      'Cada letra se colorea: verde si está en su sitio, amarillo si está en la palabra pero en otra posición y gris si no está.',
      'Usa las pistas para construir la siguiente palabra. Tienes 6 intentos.',
      'Al terminar se revela la palabra y de dónde sale.',
    ],
    datos: [
      { etiqueta: 'Intentos', valor: '6' },
      { etiqueta: 'Longitud', valor: '5 letras' },
      { etiqueta: 'Diccionario', valor: 'No hay: se acepta cualquier combinación de 5 letras' },
      { etiqueta: 'Tildes', valor: 'No cuentan. La Ñ es una letra aparte' },
    ],
    consejo:
      'Las letras repetidas se cuentan bien: si la palabra tiene una sola A y tú pones dos, solo una se marca en amarillo o verde.',
    demo: 'palabra',
  },

  portada: {
    resumen:
      'Te enseñamos la portada de un álbum o de un single muy borrosa y ampliada. Con cada fallo se vuelve más nítida.',
    pasos: [
      'Observa la imagen: colores, formas, letras... aunque esté borrosa, hay pistas.',
      'Escribe el nombre de un álbum o single y elígelo en el buscador.',
      'Cada fallo reduce el desenfoque y el zoom, y la imagen se ve un poco más completa.',
      'Tienes 6 intentos. Al terminar, la portada se revela entera.',
    ],
    datos: [
      { etiqueta: 'Intentos', valor: '6' },
      { etiqueta: 'Qué puede salir', valor: 'Un álbum o un single suelto' },
      { etiqueta: 'Nitidez', valor: '6 niveles, de muy borrosa a casi clara' },
    ],
    consejo:
      'Los colores dominantes suelen bastar para descartar muchos álbumes desde el primer intento.',
    demo: 'portada',
  },
    escucha: {
    resumen:
      'Suena el principio de una canción secreta. Tienes que adivinar cuál es, y con cada intento oyes un segundo más.',
    pasos: [
      'Pulsa el botón de play. Al empezar solo suena 1 segundo.',
      'Escribe el nombre de la canción. No hay lista de sugerencias: tienes que escribirlo tú.',
      'Si fallas, el fragmento crece 1 segundo. También puedes pulsar "Saltar" para oír un segundo más sin responder.',
      'Tienes 6 intentos. Al terminar se revela el título y la portada, y puedes escuchar la canción entera.',
    ],
    datos: [
      { etiqueta: 'Intentos', valor: '6' },
      { etiqueta: 'Fragmentos', valor: '1, 2, 3, 4, 5 y 6 segundos, siempre desde el principio' },
      { etiqueta: 'Respuesta', valor: 'Da igual mayúsculas, tildes y signos de puntuación' },
      { etiqueta: 'Saltar', valor: 'Gasta un intento y añade un segundo' },
    ],
    consejo:
      'Fíjate en el ritmo, el instrumento o la voz del primer segundo: a veces es más que suficiente.',
    demo: 'escucha',
  },
}

// Preguntas frecuentes
export const PREGUNTAS = [
  {
    pregunta: '¿Puedo volver a jugar un modo que ya he terminado?',
    respuesta:
      'No hasta el día siguiente. Hay una partida por modo y día. Puedes abrir el modo para ver tu resultado y la solución, pero no volver a jugar. A medianoche, hora de tu zona, aparece un reto nuevo.',
  },
  {
    pregunta: '¿Qué pasa si cierro la pestaña a mitad de una partida?',
    respuesta:
      'Tu progreso se guarda en este navegador y lo encuentras al volver. En Palabra, lo que estabas escribiendo y no habías enviado se pierde.',
  },
  {
    pregunta: '¿Por qué he perdido mi partida o puedo jugar otra vez?',
    respuesta:
      'Las partidas se guardan en el navegador. Si borras los datos del navegador, usas otro dispositivo o navegas en modo privado, no se conservan.',
  },
  {
    pregunta: '¿Todos los jugadores tienen el mismo reto?',
    respuesta:
      'Sí. El reto de cada día sale de la fecha, así que es el mismo para todos, sin necesidad de cuentas.',
  },
  {
    pregunta: '¿Puedo jugar solo con el teclado?',
    respuesta:
      'Sí. Los buscadores, las tarjetas y los botones se manejan con Tab, Enter y las flechas, y las animaciones respetan la opción de reducir movimiento de tu sistema. El modo Portada, por su naturaleza, es visual.',
  },
  {
    pregunta: '¿Es una web oficial?',
    respuesta: 'No. Es un proyecto de fans, sin relación con Lola Índigo ni con su discográfica.',
  },
  
]
