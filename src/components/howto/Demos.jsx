import { evaluarIntento } from '../../models/Palabra.js'
import './Demos.css'

/* =====================================================
   Piezas compartidas
   ===================================================== */

// Buscador simulado
function Entrada({ texto, placeholder }) {
  return (
    <div className="d-entrada">
      <span className={texto ? 'd-entrada__texto' : 'd-entrada__vacio'}>
        {texto || placeholder}
      </span>
      {texto && <span className="d-caret" />}
    </div>
  )
}

// Cartel de victoria. Siempre ocupa su sitio: solo se hace visible.
function Victoria({ visible, texto = '¡Lo has adivinado!' }) {
  return <div className={`d-victoria ${visible ? 'd-victoria--on' : ''}`}>{texto}</div>
}

function Contadores({ items }) {
  return (
    <div className="d-estado">
      {items.map((texto, i) => (
        <span key={i}>{texto}</span>
      ))}
    </div>
  )
}

// Lista de intentos con huecos reservados (null = hueco vacío)
function Intentos({ intentos }) {
  return (
    <ul className="d-intentos">
      {intentos.map((intento, i) =>
        intento ? (
          <li
            key={intento.t}
            className={`d-intento ${intento.ok ? 'd-intento--ok' : 'd-intento--ko'}`}
          >
            {intento.t}
          </li>
        ) : (
          <li key={`v${i}`} className="d-intento d-intento--vacio" />
        ),
      )}
    </ul>
  )
}

/* =====================================================
   1. Clásico
   ===================================================== */

const COLUMNAS = ['Álbum', 'Año', 'Duración', 'Pista', 'Colab.', 'Single']

const FILA_FALLO = {
  titulo: 'Mujer Bruja',
  celdas: [
    { t: 'Álbum B', ok: false },
    { t: '2021', ok: false, f: '↓' },
    { t: '2:50', ok: false, f: '↑' },
    { t: '3', ok: false, f: '↓' },
    { t: 'No', ok: true },
    { t: 'Sí', ok: false },
  ],
}

const FILA_ACIERTO = {
  titulo: 'Maldición',
  celdas: [
    { t: 'Álbum A', ok: true },
    { t: '2019', ok: true },
    { t: '3:12', ok: true },
    { t: '2', ok: true },
    { t: 'No', ok: true },
    { t: 'No', ok: true },
  ],
}

function FilaClasico({ fila }) {
  return (
    <div className="d-fila">
      <div className="d-fila__titulo">{fila.titulo}</div>
      {fila.celdas.map((celda, i) => (
        <div
          key={i}
          className={`d-celda ${celda.ok ? 'd-celda--ok' : 'd-celda--ko'}`}
          style={{ '--i': i }}
        >
          <span>
            {celda.t}
            {celda.f ? ` ${celda.f}` : ''}
          </span>
          <small>{celda.ok ? '✔' : '✖'}</small>
        </div>
      ))}
    </div>
  )
}

export function DemoClasico({ paso }) {
  // El intento más reciente va arriba
  const filas = paso >= 4 ? [FILA_ACIERTO, FILA_FALLO] : paso >= 2 ? [FILA_FALLO, null] : [null, null]
  const texto = paso === 1 ? 'Mujer Bruja' : paso === 3 ? 'Maldición' : ''
  const intentos = paso >= 4 ? 2 : paso >= 2 ? 1 : 0

  return (
    <div className="d-root">
      <Contadores items={[`Intentos: ${intentos} / 6`]} />
      <Entrada texto={texto} placeholder="Busca una canción..." />

      <div className="d-scroll">
        <div className="d-tabla">
          <div className="d-cabecera">
            <span>Canción</span>
            {COLUMNAS.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          {filas.map((fila, i) =>
            fila ? (
              <FilaClasico key={fila.titulo} fila={fila} />
            ) : (
              <div key={`v${i}`} className="d-fila d-fila--vacia" />
            ),
          )}
        </div>
      </div>

      <Victoria visible={paso >= 5} />
    </div>
  )
}

/* =====================================================
   2. Tracklist
   ===================================================== */

export function DemoTracklist({ paso }) {
  const rellenos = paso >= 6 ? [1, 2, 3, 4] : paso >= 5 ? [1, 3, 4] : paso >= 2 ? [3] : []
  const hayFallo = paso >= 4
  const texto = paso === 1 ? 'Maldición' : paso === 3 ? 'La Niña de la Escuela' : ''

  return (
    <div className="d-root">
      <div className="d-album">
        <span className="d-tapa" />
        <div>
          <strong className="d-bloque">Akelarre</strong>
          <span className="d-sub">2019 · 4 canciones</span>
        </div>
      </div>

      <Contadores
        items={[`Encontradas: ${rellenos.length} / 4`, `Fallos: ${hayFallo ? 1 : 0} / 5`]}
      />
      <Entrada texto={texto} placeholder="Busca una canción..." />

      <ol className="d-huecos">
        {[1, 2, 3, 4].map((n) => {
          const ok = rellenos.includes(n)
          return (
            <li key={n} className={`d-hueco ${ok ? 'd-hueco--ok' : ''}`}>
              <span className="d-hueco__n">{n}</span>
              <span>{ok ? ['Mujer Bruja', 'Maldición', 'Inocente', 'Subliminal'][n - 1] : '? ? ? ? ?'}</span>
            </li>
          )
        })}
      </ol>

      <div className="d-chips">
        {hayFallo && <span className="d-chip d-chip--ko">✖ La Niña de la Escuela</span>}
      </div>

      <Victoria visible={paso >= 6} texto="¡Álbum completado!" />
    </div>
  )
}

/* =====================================================
   3. Intruso
   ===================================================== */

const TARJETAS = [
  'Mujer Bruja',
  'La Niña de la Escuela',
  'Maldición',
  'Inocente',
  'EL TONTO',
  'Subliminal',
]

export function DemoIntruso({ paso }) {
  // Intrusos: tarjetas 1 y 4. La tarjeta 0 es del álbum.
  const estadoDe = (i) => {
    if (i === 0) return paso >= 2 ? 'ko' : paso === 1 ? 'pulsada' : ''
    if (i === 1) return paso >= 4 ? 'ok' : paso === 3 ? 'pulsada' : ''
    if (i === 4) return paso >= 5 ? 'ok' : ''
    return ''
  }
  const encontrados = (paso >= 4 ? 1 : 0) + (paso >= 5 ? 1 : 0)

  return (
    <div className="d-root">
      <div className="d-album">
        <span className="d-tapa" />
        <div>
          <strong className="d-bloque">Akelarre</strong>
          <span className="d-sub">2019 · 2 intrusos escondidos</span>
        </div>
      </div>

      <Contadores
        items={[`Encontrados: ${encontrados} / 2`, `Fallos: ${paso >= 2 ? 1 : 0} / 3`]}
      />

      <ul className="d-tarjetas">
        {TARJETAS.map((titulo, i) => (
          <li key={titulo} className={`d-tarjeta d-tarjeta--${estadoDe(i) || 'normal'}`}>
            {titulo}
          </li>
        ))}
      </ul>

      <Victoria visible={paso >= 5} texto="¡Has encontrado a todos!" />
    </div>
  )
}

/* =====================================================
   4. Invitados
   ===================================================== */

const INVITADOS = ['Mala Rodríguez', 'TINI', 'Quevedo']

export function DemoInvitados({ paso }) {
  const visibles = paso >= 4 ? 3 : paso >= 2 ? 2 : 1
  const texto = paso === 1 ? 'El Dragón' : paso === 3 ? 'Akelarre' : ''
  const intentos = [
    paso >= 2 ? { t: 'El Dragón', ok: false } : null,
    paso >= 4 ? { t: 'Akelarre', ok: true } : null,
  ]

  return (
    <div className="d-root">
      <Contadores
        items={[
          `Intentos: ${intentos.filter(Boolean).length} / 5`,
          `Pistas: ${visibles} / 3`,
        ]}
      />

      <ol className="d-pistas d-pistas--columna">
        {INVITADOS.map((nombre, i) => (
          <li key={nombre} className={`d-pista ${i < visibles ? 'd-pista--visible' : ''}`}>
            <span className="d-hueco__n">{i + 1}</span>
            <span>{i < visibles ? nombre : '? ? ? ? ?'}</span>
          </li>
        ))}
      </ol>

      <Entrada texto={texto} placeholder="Busca un álbum..." />
      <Intentos intentos={intentos} />
      <Victoria visible={paso >= 4} />
    </div>
  )
}

/* =====================================================
   5. Dúo
   ===================================================== */

const PISTAS_DUO = ['Año: 2023', 'Álbum: El Dragón', 'Duración: 3:07', 'Inicial: Q']

export function DemoDuo({ paso }) {
  const visibles = paso >= 4 ? 4 : paso >= 2 ? 1 : 0
  const texto = paso === 1 ? 'Mala Rodríguez' : paso === 3 ? 'Quevedo' : ''
  const intentos = [
    paso >= 2 ? { t: 'Mala Rodríguez', ok: false } : null,
    paso >= 4 ? { t: 'Quevedo', ok: true } : null,
  ]

  return (
    <div className="d-root">
      <div className="d-cancion">
        <span className="d-icono">🎵</span>
        <div>
          <span className="d-sub d-bloque">Canción de hoy</span>
          <strong>EL TONTO</strong>
        </div>
      </div>

      <Contadores
        items={[
          `Intentos: ${intentos.filter(Boolean).length} / 5`,
          `Pistas: ${visibles} / 4`,
        ]}
      />

      <ol className="d-pistas">
        {PISTAS_DUO.map((pista, i) => (
          <li key={pista} className={`d-pista ${i < visibles ? 'd-pista--visible' : ''}`}>
            <span className="d-hueco__n">{i + 1}</span>
            <span>{i < visibles ? pista : '? ? ? ? ?'}</span>
          </li>
        ))}
      </ol>

      <Entrada texto={texto} placeholder="Busca un artista..." />
      <Intentos intentos={intentos} />
      <Victoria visible={paso >= 4} />
    </div>
  )
}

/* =====================================================
   6. Cronología
   ===================================================== */

// Orden correcto: de la más antigua a la más reciente
const CANCIONES = [
  { id: 'a', titulo: 'Mujer Bruja', anio: 2018 },
  { id: 'b', titulo: 'La Niña de la Escuela', anio: 2021 },
  { id: 'c', titulo: 'AN1MAL', anio: 2023 },
  { id: 'd', titulo: 'MISSION005', anio: 2025 },
]
// Orden en que aparecen mezcladas
const ORDEN_CARTAS = ['c', 'a', 'd', 'b']

export function DemoCronologia({ paso }) {
  const colocadas =
    paso >= 5
      ? ['a', 'b', 'c', 'd']
      : paso >= 4
        ? ['a', 'b', 'c']
        : paso >= 3
          ? ['a', 'b']
          : paso >= 2
            ? ['a']
            : []

  return (
    <div className="d-root">
      <Contadores
        items={[`Colocadas: ${colocadas.length} / 4`, `Fallos: ${paso >= 1 ? 1 : 0} / 3`]}
      />

      <ol className="d-linea">
        {CANCIONES.map((cancion, i) => {
          const puesta = colocadas.includes(cancion.id)
          const actual = paso < 5 && i === colocadas.length
          let extremo = ''
          if (i === 0) extremo = 'Más antigua'
          if (i === CANCIONES.length - 1) extremo = 'Más reciente'

          return (
            <li
              key={cancion.id}
              className={`d-slot ${puesta ? 'd-slot--ok' : ''} ${actual ? 'd-slot--actual' : ''}`}
            >
              <span className="d-hueco__n">{i + 1}</span>
              <span className="d-slot__texto">
                <small>{extremo || '\u00A0'}</small>
                {puesta ? cancion.titulo : '? ? ? ? ?'}
              </span>
              <span>{puesta ? cancion.anio : ''}</span>
            </li>
          )
        })}
      </ol>

      <ul className="d-cartas">
        {ORDEN_CARTAS.map((id) => {
          const cancion = CANCIONES.find((c) => c.id === id)
          const puesta = colocadas.includes(id)
          const ko = id === 'c' && paso === 1
          return (
            <li
              key={id}
              className={`d-carta ${ko ? 'd-carta--ko' : ''} ${puesta ? 'd-carta--oculta' : ''}`}
            >
              {cancion.titulo}
            </li>
          )
        })}
      </ul>

      <Victoria visible={paso >= 5} texto="¡Orden perfecto!" />
    </div>
  )
}

/* =====================================================
   7. Palabra (usa la lógica real del juego para los colores)
   ===================================================== */

const OBJETIVO = 'RITMO'
const PALABRAS = ['NOCHE', 'PISTA', 'RITMO']

export function DemoPalabra({ paso }) {
  const filas = [
    paso >= 2 ? 'evaluada' : paso >= 1 ? 'escrita' : 'vacia',
    paso >= 3 ? 'evaluada' : 'vacia',
    paso >= 4 ? 'evaluada' : 'vacia',
    'vacia',
  ]
  const enviados = filas.filter((f) => f === 'evaluada').length

  return (
    <div className="d-root">
      <Contadores items={[`Intentos: ${enviados} / 6`]} />

      <div className="d-malla">
        {filas.map((modo, fila) => {
          const palabra = PALABRAS[fila]
          const evaluacion =
            palabra && modo === 'evaluada' ? evaluarIntento(palabra, OBJETIVO) : null

          return (
            <div key={fila} className="d-malla__fila">
              {[0, 1, 2, 3, 4].map((j) => {
                const letra = palabra && modo !== 'vacia' ? palabra[j] : ''
                const estado = evaluacion ? evaluacion[j] : letra ? 'escrita' : 'vacia'
                return (
                  <span key={j} className={`d-tile d-tile--${estado}`} style={{ '--i': j }}>
                    {letra}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>

      <Victoria visible={paso >= 4} />
    </div>
  )
}

/* =====================================================
   8. Portada
   ===================================================== */

const NIVELES_PORTADA = [
  { blur: 18, zoom: 2.8 },
  { blur: 18, zoom: 2.8 },
  { blur: 11, zoom: 2 },
  { blur: 5, zoom: 1.4 },
  { blur: 0, zoom: 1 },
]

export function DemoPortada({ paso }) {
  const { blur, zoom } = NIVELES_PORTADA[paso]
  const texto = paso === 1 ? 'El Dragón' : ''
  const intentos = [
    paso >= 2 ? { t: 'El Dragón', ok: false } : null,
    paso >= 3 ? { t: 'La Niña', ok: false } : null,
    paso >= 4 ? { t: 'Akelarre', ok: true } : null,
  ]

  return (
    <div className="d-root">
      <Contadores items={[`Intentos: ${intentos.filter(Boolean).length} / 6`]} />

      <div className="d-portada">
        <div className={`d-portada__marco ${paso >= 4 ? 'd-portada__marco--ok' : ''}`}>
          <div className="d-portada__arte" style={{ '--blur': `${blur}px`, '--zoom': zoom }}>
            A
          </div>
        </div>
      </div>

      <Entrada texto={texto} placeholder="Busca un álbum o single..." />
      <Intentos intentos={intentos} />
      <Victoria visible={paso >= 4} />
    </div>
  )
  
}
/* =====================================================
   9. Escucha
   ===================================================== */

export function DemoEscucha({ paso }) {
  const desbloqueados = paso >= 3 ? 3 : paso >= 2 ? 2 : 1
  const texto = paso === 1 ? 'La Niña de la Escuela' : paso === 4 ? 'Maldición' : ''
  const intentos = [
    paso >= 2 ? { t: 'La Niña de la Escuela', ok: false } : null,
    paso >= 3 ? { t: '⏭ Saltado', ok: false } : null,
    paso >= 5 ? { t: 'Maldición', ok: true } : null,
  ]

  return (
    <div className="d-root">
      <Contadores items={[`Intentos: ${intentos.filter(Boolean).length} / 6`]} />

      <div className="d-clip">
        <span className="d-clip__play">▶</span>
        <div className="d-clip__barra">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`d-seg ${i < desbloqueados ? 'd-seg--on' : ''}`} />
          ))}
        </div>
        <span className="d-clip__seg">{desbloqueados} s</span>
      </div>

      <Entrada texto={texto} placeholder="Título de la canción..." />
      <Intentos intentos={intentos} />

      <div className={`d-reveal ${paso >= 5 ? 'd-reveal--on' : ''}`}>
        <span className="d-tapa" />
        <div>
          <strong className="d-bloque">Maldición</strong>
          <span className="d-sub">Akelarre · 2019</span>
        </div>
      </div>
      <Victoria visible={paso >= 5} />
    </div>
  )
}
