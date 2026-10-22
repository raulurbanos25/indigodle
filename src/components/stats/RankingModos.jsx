import { GAMES } from '../../data/games.js'
import GameIcon from '../game/GameIcon.jsx'

function RankingModos({ ranking }) {
  if (ranking.length === 0) return null

  return (
    <ol className="ranking">
      {ranking.map((fila, i) => {
        const juego = GAMES.find((j) => j.id === fila.modo)
        if (!juego) return null

        return (
          <li key={fila.modo} className="ranking__fila">
            <span className="ranking__modo">
              <span className="ranking__puesto" aria-label={`Puesto ${i + 1}`}>#{i + 1}</span>
              <GameIcon animado={juego.iconoAnimado ?? juego.id} />
              <span>{juego.titulo}</span>
            </span>
            <span className="ranking__datos">
              {fila.porcentaje}% · {fila.ganadas} de {fila.jugadas}
            </span>
            <span className="ranking__barra" aria-hidden="true">
              <span style={{ '--w': `${fila.porcentaje}%` }} />
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default RankingModos
