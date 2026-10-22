
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { GAMES } from '../data/games.js'
import { numeroDeReto } from '../services/dailyChallenge.js'
import { useResultadosDeHoy } from '../hooks/useResultadosDeHoy.js'
import { useParallax } from '../hooks/useScrollEffects.js'
import GameCard from '../components/game/GameCard.jsx'
import Reveal from '../components/home/Reveal.jsx'
import Countdown from '../components/home/Countdown.jsx'
import CommunityPanel from '../components/home/CommunityPanel.jsx'
import ScrollProgress from '../components/home/ScrollProgress.jsx'
import './Home.css'

const PASOS = [
  {
    titulo: 'Escoge un reto',
    texto: 'Canciones, álbumes, portadas y más modos para poner a prueba tu memoria musical.',
  },
  {
    titulo: 'Sigue las pistas',
    texto: 'Cada intento te acerca a la respuesta. El reto diario es igual para todos.',
  },
  {
    titulo: 'Vuelve mañana',
    texto: 'Tu partida queda guardada en este navegador y cada día aparece un desafío nuevo.',
  },
]

function Home() {
  const heroRef = useRef(null)
  const resultados = useResultadosDeHoy()

  useParallax(heroRef)

  const hoy = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const modosListos = GAMES.filter((juego) => juego.listo)

  return (
    <>
      <ScrollProgress />

      {/* ---------- Hero ---------- */}
      <section
        className="hero"
        ref={heroRef}
        aria-labelledby="titulo-inicio"
      >
        <div className="hero__fondo" aria-hidden="true">
          <span className="hero__blob hero__blob--1" />
          <span className="hero__blob hero__blob--2" />
          <span className="hero__blob hero__blob--3" />
        </div>

        <div className="container hero__inner">
          <p
            className="hero__etiqueta anim"
            style={{ '--d': '0ms' }}
          >
            <span className="hero__fecha">{hoy}</span>
            <span className="hero__etiqueta-separador" aria-hidden="true">·</span>
            <span className="hero__reto">
              <span className="hero__reto-indicador" aria-hidden="true" />
              Reto nº <strong>{numeroDeReto()}</strong>
            </span>
          </p>

          <h1
            id="titulo-inicio"
            className="hero__titulo anim"
            style={{ '--d': '120ms' }}
          >
            Indigodle
          </h1>

          <p
            className="hero__texto anim"
            style={{ '--d': '260ms' }}
          >
            Juegos diarios para poner a prueba cuánto sabes de la música de
            Lola Índigo. Proyecto de fans, sin relación oficial con la artista.
          </p>

          <div
            className="hero__cuenta anim"
            style={{ '--d': '400ms' }}
          >
            <Countdown />
          </div>

          <div
            className="hero__acciones anim"
            style={{ '--d': '540ms' }}
          >
            <Link to="/jugar" className="btn btn--primary hero__btn hero__btn--play">
              <span className="hero__btn-icon hero__btn-icon--play" aria-hidden="true" />
              <span>Jugar ahora</span>
              <span className="hero__btn-arrow" aria-hidden="true">→</span>
            </Link>

            <Link to="/discografia" className="btn btn--ghost hero__btn hero__btn--discography">
              <span className="hero__btn-icon hero__btn-icon--record" aria-hidden="true" />
              <span>Ver discografía</span>
            </Link>
          </div>
        </div>

        <div className="hero__divider">
          <svg className="hero__divider-shape" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
            <path className="hero__divider-shadow" d="M0,64 C190,112 360,15 590,56 C820,97 1000,118 1210,65 C1310,40 1385,43 1440,55 L1440,120 L0,120 Z" />
            <path className="hero__divider-fill" d="M0,78 C210,110 370,40 590,70 C820,102 1010,109 1210,76 C1310,60 1385,60 1440,68 L1440,120 L0,120 Z" />
          </svg>
          <a href="#retos" className="hero__discover">Explora los retos <span aria-hidden="true">✦</span></a>
        </div>
      </section>

      <div className="home__flow">

      {/* ---------- Retos de hoy ---------- */}
      <section
        id="retos"
        className="home__seccion container"
        aria-labelledby="retos-hoy"
      >
        <Reveal className="home__cabecera">
          <p className="home__kicker">Hoy</p>

          <h2 id="retos-hoy">Retos de hoy</h2>

          <p className="home__lead">
            Un reto nuevo en cada modo, igual para todos. Elige por dónde
            empezar.
          </p>
        </Reveal>

        {modosListos.length > 0 ? (
          <div className="home__grid">
            {modosListos.map((juego, i) => (
              <Reveal
                key={juego.id}
                direccion="zoom"
                delay={Math.min(i, 5) * 80}
              >
                <GameCard
                  titulo={juego.titulo}
                  descripcion={juego.descripcion}
                  ruta={juego.ruta}
                  icono={juego.icono}
                  iconoAnimado={juego.iconoAnimado || juego.id}
                  listo={juego.listo}
                  resultado={resultados[juego.id]}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="home__vacio">
            Todavía no hay modos disponibles. Vuelve pronto.
          </p>
        )}

        <p className="home__mas">
          <Link to="/jugar">
            Ver todos los modos →
          </Link>
        </p>
      </section>

      {/* ---------- Cómo funciona ---------- */}
      <section
        className="home__seccion container"
        aria-labelledby="como-funciona"
      >
        <Reveal className="home__cabecera">
          <p className="home__kicker">Paso a paso</p>

          <h2 id="como-funciona">
            Cómo funciona
          </h2>

          <p className="home__lead">
            Tres pasos sencillos para entrar en juego.
          </p>
        </Reveal>

        <ol className="home__pasos">
          {PASOS.map((paso, i) => (
            <Reveal
              as="li"
              key={paso.titulo}
              direccion="left"
              className="home__paso"
            >
              <span
                className="home__paso-num"
                aria-hidden="true"
              >
                {i + 1}
              </span>

              <h3 className="home__paso-titulo">
                {paso.titulo}
              </h3>

              <p className="home__paso-texto">
                {paso.texto}
              </p>
            </Reveal>
          ))}
        </ol>

        <p className="home__mas">
          <Link to="/como-se-juega">
            Leer las reglas completas →
          </Link>
        </p>
      </section>

      {/* ---------- Cifras ---------- */}
      <section
        className="container"
        aria-label="Cifras del proyecto"
      >
        <Reveal direccion="up" className="home__resumen">
          <div className="home__resumen-item">
            <span className="home__resumen-num">{modosListos.length}</span>
            <span><strong>Modos disponibles</strong><small>Listos para jugar</small></span>
          </div>
          <div className="home__resumen-item">
            <span className="home__resumen-num">{GAMES.length - modosListos.length}</span>
            <span><strong>En preparación</strong><small>Nuevos modos en camino</small></span>
          </div>
          <div className="home__resumen-item">
            <span className="home__resumen-icon" aria-hidden="true">↻</span>
            <span><strong>Un reto diario</strong><small>Cambia cada medianoche</small></span>
          </div>
        </Reveal>
      </section>

      {/* ---------- Llamada final ---------- */}
      <section
        className="home__final container"
        aria-labelledby="cta-titulo"
      >
        <Reveal direccion="zoom" className="cta">
          <div className="cta__copy">
            <p className="home__kicker">Tu próxima partida</p>
            <h2 id="cta-titulo" className="cta__titulo">¿Qué reto te apetece hoy?</h2>
            <p className="cta__texto">Elige un modo y empieza cuando quieras.</p>
          </div>
          <div className="cta__acciones">
            <Link
              to="/jugar"
              className="btn btn--primary"
            >
              Explorar los retos <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </section>
      </div>
      <CommunityPanel />
    </>
  )
}

export default Home
