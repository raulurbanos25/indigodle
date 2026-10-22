import { Link } from 'react-router-dom'
import { useIntruso } from '../hooks/useIntruso.js'
import { numeroDeReto } from '../services/dailyChallenge.js'
import IntrusoBoard from '../components/game/IntrusoBoard.jsx'
import ResultPanel from '../components/game/ResultPanel.jsx'
import AlbumCover from '../components/game/AlbumCover.jsx'
import './JuegoIntruso.css'

function JuegoIntruso() {
  const {
    album,
    cartas,
    intrusosIds,
    encontradosIds,
    descartadasIds,
    numIntrusos,
    fallos,
    estado,
    maxFallos,
    elegir,
    reiniciarDev,
  } = useIntruso()

  const terminado = estado !== 'jugando'
  const gano = estado === 'ganada'

  return (
    <section className="page container">
      <header className="intruso__cabecera">
        <p className="intruso__etiqueta">Modo Intruso · Reto nº {numeroDeReto()}</p>
        <h1 className="intruso__titulo">Encuentra a los intrusos</h1>
        <p className="intruso__intro">
          Algunas de estas canciones no son de este álbum.{' '}
          <Link to="/como-se-juega">Cómo se juega</Link>
        </p>
      </header>

      <div className="intruso__album">
        <div className="intruso__portada">
          <AlbumCover album={album} />
        </div>
        <div>
          <h2 className="intruso__album-titulo">{album.titulo}</h2>
          <p className="intruso__album-datos">
            {album.anio} · {numIntrusos} {numIntrusos === 1 ? 'intruso' : 'intrusos'} escondidos
          </p>
        </div>
      </div>

      <div className="intruso__estado">
        <span>
          Encontrados: {encontradosIds.length} / {numIntrusos}
        </span>
        <span>
          Fallos: {fallos} / {maxFallos}
        </span>
        {import.meta.env.DEV && (
          <button type="button" className="btn btn--ghost btn--small" onClick={reiniciarDev}>
            Reiniciar (solo desarrollo)
          </button>
        )}
      </div>

      {terminado ? (
        <ResultPanel
          estado={estado}
          tituloGanada="¡Has encontrado a todos!"
          tituloPerdida="Fin de la partida"
        >
          <p>
            {gano
              ? `Has descubierto los ${numIntrusos} intrusos con ${fallos} ${
                  fallos === 1 ? 'fallo' : 'fallos'
                }.`
              : `Has encontrado ${encontradosIds.length} de ${numIntrusos} intrusos de ${album.titulo}.`}
          </p>
        </ResultPanel>
      ) : (
        <p className="intruso__instruccion">
          Toca las canciones que crees que <strong>no</strong> son de este álbum.
        </p>
      )}

      <IntrusoBoard
        cartas={cartas}
        intrusosIds={intrusosIds}
        encontradosIds={encontradosIds}
        descartadasIds={descartadasIds}
        terminado={terminado}
        onElegir={elegir}
      />
    </section>
  )
}

export default JuegoIntruso
