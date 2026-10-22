import { Link } from 'react-router-dom'
import { useCronologia } from '../hooks/useCronologia.js'
import { numeroDeReto } from '../services/dailyChallenge.js'
import TimelineBoard from '../components/game/TimelineBoard.jsx'
import ResultPanel from '../components/game/ResultPanel.jsx'
import './JuegoCronologia.css'

function JuegoCronologia() {
  const { orden, cartas, colocadasIds, malasIds, fallos, estado, maxFallos, elegir, reiniciarDev } =
    useCronologia()

  if (orden.length < 2) {
    return (
      <section className="page container">
        <h1>Modo Cronología</h1>
        <p>
          Este modo necesita canciones de al menos dos años distintos. Revisa el campo{' '}
          <code>anio</code> en <code>src/data/songs.js</code>.
        </p>
        <Link to="/jugar">Volver a los modos de juego</Link>
      </section>
    )
  }

  const terminado = estado !== 'jugando'
  const gano = estado === 'ganada'

  return (
    <section className="page container">
      <header className="cronologia__cabecera">
        <p className="cronologia__etiqueta">Modo Cronología · Reto nº {numeroDeReto()}</p>
        <h1 className="cronologia__titulo">Ordena las canciones</h1>
        <p className="cronologia__intro">
          De la más antigua a la más reciente. <Link to="/como-se-juega">Cómo se juega</Link>
        </p>
      </header>

      <div className="cronologia__estado">
        <span>
          Colocadas: {colocadasIds.length} / {orden.length}
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
          tituloGanada="¡Orden perfecto!"
          tituloPerdida="Fin de la partida"
        >
          <p>
            {gano
              ? `Has ordenado las ${orden.length} canciones con ${fallos} ${
                  fallos === 1 ? 'fallo' : 'fallos'
                }.`
              : `Has colocado ${colocadasIds.length} de ${orden.length} canciones. Este era el orden correcto.`}
          </p>
        </ResultPanel>
      ) : (
        <p className="cronologia__instruccion">
          Toca la canción que va en el hueco <strong>{colocadasIds.length + 1}</strong>.
        </p>
      )}

      <TimelineBoard
        orden={orden}
        cartas={cartas}
        colocadasIds={colocadasIds}
        malasIds={malasIds}
        terminado={terminado}
        onElegir={elegir}
      />
    </section>
  )
}

export default JuegoCronologia
