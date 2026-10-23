import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GAMES } from '../data/games.js'
import { NORMAS_GENERALES, REGLAS, PREGUNTAS } from '../data/rules.js'
import { DEMOS } from '../components/howto/demosConfig.js'
import DemoFrame from '../components/howto/DemoFrame.jsx'
import Reveal from '../components/home/Reveal.jsx'
import Countdown from '../components/home/Countdown.jsx'
import GameIcon from '../components/game/GameIcon.jsx'
import './ComoSeJuega.css'

const ICONOS_BASICO = [
  <><rect x="4" y="6" width="16" height="15" rx="3"/><path d="M8 3v6m8-6v6M4 11h16m-12 4 2 2 4-4"/></>,
  <><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/><circle cx="12" cy="14" r=".7"/></>,
  <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18m0-18a14 14 0 0 0 0 18M7 6.5a8 8 0 0 0 10 0m-10 11a8 8 0 0 1 10 0"/></>,
  <><rect x="4" y="4" width="16" height="17" rx="3"/><path d="M8 4V2m8 2V2M8 9h8m-8 4h5m-5 4h8"/><path d="m15 16 2 2 4-4"/></>,
]

function IconoBasico({ indice }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {ICONOS_BASICO[indice]}
    </svg>
  )
}

function ComoSeJuega() {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const modos = GAMES.filter((juego) => juego.listo)
  const proximos = GAMES.filter((juego) => !juego.listo)
  const [modoActivo, setModoActivo] = useState(() => {
    const modoEnlace = modos.find((juego) => `#modo-${juego.id}` === window.location.hash)
    return modoEnlace?.id ?? modos[0]?.id ?? ''
  })
  const [faqActivo, setFaqActivo] = useState(() => window.location.hash === '#faq')
  const [mostrarArriba, setMostrarArriba] = useState(false)

  // Abre el modo enlazado y desplaza la vista hasta su explicación.
  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    const modoEnlace = modos.find((juego) => `modo-${juego.id}` === id)
    if (modoEnlace) setModoActivo(modoEnlace.id)
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [hash])

  useEffect(() => {
    const actualizarVisibilidad = () => setMostrarArriba(window.scrollY > 500)
    actualizarVisibilidad()
    window.addEventListener('scroll', actualizarVisibilidad, { passive: true })
    return () => window.removeEventListener('scroll', actualizarVisibilidad)
  }, [])

  return (
    <section className="page container how">
      {/* ---------- Cabecera ---------- */}
      <header className="how__hero">
        <p className="how__kicker">Guía completa</p>
        <h1>Cómo se juega</h1>
        <p className="how__lead">
          Cada modo es un reto distinto sobre la música de Lola Índigo. Aquí tienes las reglas
          de todos, con una demostración animada al final de cada uno.
        </p>
      </header>

      {/* ---------- Lo básico ---------- */}
      <section aria-labelledby="basico" className="how__bloque">
        <h2 id="basico" className="how__titulo">
          Lo básico
        </h2>
        <div className="how__basico">
          {NORMAS_GENERALES.map((norma, i) => (
            <Reveal key={norma.titulo} delay={i * 80} direccion="zoom" className="norma">
              <span className="norma__icono">
                <IconoBasico indice={i} />
              </span>
              <h3 className="norma__titulo">{norma.titulo}</h3>
              <p className="norma__texto">{norma.texto}</p>
            </Reveal>
          ))}
        </div>
        <div className="how__cuenta">
          <Countdown etiqueta="Los retos cambian en" />
        </div>
      </section>

      {/* ---------- Índice ---------- */}
      <nav id="indice" className="how__indice" aria-label="Ir a un modo de juego">
        <ul>
          {modos.map((juego) => (
            <li key={juego.id}>
              <a
                href={`#modo-${juego.id}`}
                aria-label={juego.titulo}
                title={juego.titulo}
                aria-current={!faqActivo && modoActivo === juego.id ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  setFaqActivo(false)
                  setModoActivo(juego.id)
                  navigate(`#modo-${juego.id}`)
                }}
              >
                <span className="how__indice-icono">
                  <GameIcon
                    animado={
                      juego.id === 'tracklist'
                        ? 'album-rotatorio'
                        : juego.iconoAnimado ?? juego.id
                    }
                  />
                </span>
                <span className="how__indice-nombre">{juego.titulo}</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href="#faq"
              aria-label="Preguntas"
              title="Preguntas"
              aria-current={faqActivo ? 'page' : undefined}
              onClick={() => setFaqActivo(true)}
            >
              <span className="how__indice-icono" aria-hidden="true">?</span>
              <span className="how__indice-nombre">Preguntas</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* ---------- Un apartado por modo ---------- */}
      {modos.filter((juego) => juego.id === modoActivo).map((juego) => {
        const i = modos.findIndex((modo) => modo.id === juego.id)
        const regla = REGLAS[juego.id]
        const demo = regla ? DEMOS[regla.demo] : null

        return (
          <Reveal
            as="section"
            key={juego.id}
            id={`modo-${juego.id}`}
            className="modo"
            aria-labelledby={`titulo-${juego.id}`}
          >
            <header className="modo__cabecera">
              <span className="modo__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="modo__icono" aria-hidden="true">
                <GameIcon
                  animado={
                    juego.id === 'tracklist'
                      ? 'album-rotatorio'
                      : juego.iconoAnimado ?? juego.id
                  }
                />
              </span>
              <div>
                <h2 id={`titulo-${juego.id}`} className="modo__titulo">
                  {juego.titulo}
                </h2>
                <p className="modo__resumen">{regla?.resumen ?? juego.descripcion}</p>
              </div>
            </header>

            {regla ? (
              <>
                <div className="modo__cuerpo">
                  <div>
                    <h3 className="modo__subtitulo">Cómo se juega</h3>
                    <ol className="pasos-modo">
                      {regla.pasos.map((paso) => (
                        <li key={paso}>{paso}</li>
                      ))}
                    </ol>
                  </div>

                  <aside className="modo__lateral">
                    <h3 className="modo__subtitulo">Reglas clave</h3>
                    <dl className="datos">
                      {regla.datos.map((dato) => (
                        <div key={dato.etiqueta} className="datos__fila">
                          <dt>{dato.etiqueta}</dt>
                          <dd>{dato.valor}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="consejo">
                      <strong>Consejo:</strong> {regla.consejo}
                    </p>
                  </aside>
                </div>

                {demo && (
                  <div className="modo__demo">
                    <h3 className="modo__subtitulo">Míralo en acción</h3>
                    <DemoFrame demo={demo} />
                  </div>
                )}
              </>
            ) : (
              <p className="modo__resumen">La explicación detallada de este modo está en preparación.</p>
            )}

            <div className="modo__acciones">
              <Link to={juego.ruta} className="btn btn--primary">
                Jugar {juego.titulo}
              </Link>
            </div>
          </Reveal>
        )
      })}

      {/* ---------- Modos en camino ---------- */}
      {proximos.length > 0 && (
        <section aria-labelledby="proximos" className="how__bloque">
          <h2 id="proximos" className="how__titulo">
            Modos en camino
          </h2>
          <p className="how__lead how__lead--centro">
            Estos modos están planificados pero todavía no se pueden jugar.
          </p>
          <ul className="proximos">
            {proximos.map((juego) => (
              <li key={juego.id} className="proximo">
                <span className="proximo__icono" aria-hidden="true">
                  <GameIcon animado={juego.iconoAnimado ?? juego.id} />
                </span>
                <div>
                  <h3 className="proximo__titulo">{juego.titulo}</h3>
                  <p className="proximo__texto">{juego.descripcion}</p>
                </div>
                <span className="proximo__etiqueta">Próximamente</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- Preguntas frecuentes ---------- */}
      <section id="faq" aria-labelledby="titulo-faq" className="how__bloque">
        <h2 id="titulo-faq" className="how__titulo">
          Preguntas frecuentes
        </h2>
        <div className="faq">
          {PREGUNTAS.map((item) => (
            <details key={item.pregunta} className="faq__item">
              <summary>{item.pregunta}</summary>
              <p>{item.respuesta}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Llamada final ---------- */}
      <Reveal direccion="zoom" className="how__final">
        <h2>¿Listo para jugar?</h2>
        <p>Elige un modo y demuestra cuánto sabes.</p>
        <Link to="/jugar" className="btn btn--primary">
          Ir a los modos de juego
        </Link>
      </Reveal>

      {mostrarArriba && (
        <button
          type="button"
          className="how__top"
          aria-label="Volver al inicio de la página"
          title="Volver al inicio"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span aria-hidden="true">↑</span>
        </button>
      )}
    </section>
  )
}

export default ComoSeJuega
