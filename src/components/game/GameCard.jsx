import { Link } from 'react-router-dom'
import Countdown from '../home/Countdown.jsx'
import GameIcon from './GameIcon.jsx'
import './GameCard.css'

const TEXTO_RESULTADO = { ganada: 'Acertaste', perdida: 'No acertaste' }

// "resultado" es 'ganada' o 'perdida' si el modo ya se ha jugado hoy (tarjeta bloqueada).
// "iconoAnimado" es el nombre de un icono animado de GameIcon (opcional).
function GameCard({ titulo, descripcion, ruta, icono, iconoAnimado, listo, resultado }) {
  if (resultado) {
    return (
      <div className="game-card game-card--bloqueada">
        <span className="game-card__icon game-card__icon--bloqueado" aria-hidden="true">
          <span className="game-card__emoji">
            <GameIcon icono={icono} animado={iconoAnimado} />
          </span>
          <span className="game-card__candado">🔒</span>
        </span>
        <h2 className="game-card__title">{titulo}</h2>
        <p className="game-card__text">{descripcion}</p>
        <span className={`game-card__badge game-card__badge--${resultado}`}>
          Completado · {TEXTO_RESULTADO[resultado] ?? 'Jugado'}
        </span>
        <div className="game-card__cuenta">
          <Countdown etiqueta="Nuevo reto en" />
        </div>
        <Link to={ruta} className="game-card__ver">
          Ver resultado
        </Link>
      </div>
    )
  }

  return (
    <Link to={ruta} className="game-card">
      <span className="game-card__icon" aria-hidden="true">
        <GameIcon icono={icono} animado={iconoAnimado} />
      </span>
      <h2 className="game-card__title">{titulo}</h2>
      <p className="game-card__text">{descripcion}</p>
      <span
        className={`game-card__badge ${listo ? 'game-card__badge--listo' : ''}`}
      >
        {listo ? 'Disponible' : 'En construcción'}
      </span>
    </Link>
  )
}

export default GameCard