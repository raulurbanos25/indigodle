import { Link } from 'react-router-dom'
import './ResultPanel.css'

function ResultPanel({
  estado,
  tituloGanada = '¡Lo has adivinado!',
  tituloPerdida = 'Se acabaron los intentos',
  children,
}) {
  const gano = estado === 'ganada'

  return (
    <div
      className={`result ${gano ? 'result--ganada' : 'result--perdida'}`}
      role="status"
    >
      <h2 className="result__title">{gano ? tituloGanada : tituloPerdida}</h2>
      {children}
      <p className="result__vuelve">Vuelve mañana para un nuevo reto.</p>
      <div className="result__actions">
        <Link to="/jugar" className="btn btn--primary">
          Probar otros modos
        </Link>
      </div>
    </div>
  )
}

export default ResultPanel