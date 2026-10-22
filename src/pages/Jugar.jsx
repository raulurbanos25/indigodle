import { Link } from 'react-router-dom'
import { GAMES } from '../data/games.js'
import { useResultadosDeHoy } from '../hooks/useResultadosDeHoy.js'
import GameCard from '../components/game/GameCard.jsx'
import './Jugar.css'

// Modo temporal para las fotos del portfolio: oculta los bloqueos visuales del día,
// sin borrar los resultados ni el historial guardado. Cambiar a false para restaurarlos.
const DISPONIBLES_PARA_PORTFOLIO = false

function Jugar() {
  const resultados = useResultadosDeHoy()

  const disponibles = GAMES.filter((juego) => juego.listo)
  const resultadosVisibles = DISPONIBLES_PARA_PORTFOLIO ? {} : resultados
  const completados = disponibles.filter((juego) => resultadosVisibles[juego.id]).length
  const porcentaje = disponibles.length > 0 ? (completados / disponibles.length) * 100 : 0

  return (
    <section className="page container jugar">
      <h1>Jugar</h1>
      <p className="jugar__intro">
        Elige un modo de juego. Solo puedes jugar una partida al día en cada modo, y a
        medianoche hay un reto nuevo.
      </p>

      {disponibles.length > 0 && (
        <div className="jugar__progreso">
          <p role="status">
            Hoy has completado <strong>{completados}</strong> de{' '}
            <strong>{disponibles.length}</strong> modos disponibles.
          </p>
          <div className="jugar__barra" aria-hidden="true">
            <span style={{ width: `${porcentaje}%` }} />
          </div>
        </div>
      )}

      <div className="jugar__grid">
        {GAMES.map((juego) => (
          <GameCard
            key={juego.id}
            titulo={juego.titulo}
            descripcion={juego.descripcion}
            ruta={juego.ruta}
            icono={juego.icono}
            iconoAnimado={juego.iconoAnimado || juego.id}
            listo={juego.listo}
            resultado={resultadosVisibles[juego.id]}
          />
        ))}
      </div>

      <p className="jugar__ayuda">
        ¿Primera vez? Lee <Link to="/como-se-juega">cómo se juega</Link>.
      </p>
    </section>
  )
}

export default Jugar
