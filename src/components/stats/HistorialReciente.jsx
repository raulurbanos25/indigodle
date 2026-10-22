import { useState } from 'react'
import { GAMES } from '../../data/games.js'
import { describirResultado, formatearFecha } from '../../services/estadisticas.js'
import GameIcon from '../game/GameIcon.jsx'

function HistorialReciente({ partidas }) {
  const [verTodo, setVerTodo] = useState(false)

  // Las más recientes primero
  const ordenadas = [...partidas].reverse()
  const visibles = verTodo ? ordenadas.slice(0, 200) : ordenadas.slice(0, 10)

  return (
    <div>
      <ol className="hist">
        {visibles.map((partida) => {
          const juego = GAMES.find((j) => j.id === partida.modo)
          const ganada = partida.estado === 'ganada'

          return (
            <li
              key={`${partida.fecha}-${partida.modo}`}
              className={`hist__fila ${ganada ? 'hist__fila--ganada' : 'hist__fila--perdida'}`}
            >
              <span className="hist__fecha">
                {formatearFecha(partida.fecha, { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
              <span className="hist__modo">
                {juego && <GameIcon animado={juego.iconoAnimado ?? juego.id} />}
                <span>{juego?.titulo ?? partida.modo}</span>
              </span>
              <span className="hist__resultado">
                <span className={`hist__estado ${ganada ? 'hist__estado--ganada' : ''}`} aria-hidden="true" />
                {describirResultado(partida)}
              </span>
            </li>
          )
        })}
      </ol>

      {ordenadas.length > 10 && (
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => setVerTodo(!verTodo)}
        >
          {verTodo ? 'Ver menos' : `Ver todas (${Math.min(ordenadas.length, 200)})`}
        </button>
      )}
    </div>
  )
}

export default HistorialReciente
