import { Link, useParams } from 'react-router-dom'
import { GAMES } from '../data/games.js'

function JuegoEnConstruccion() {
  const { modoId } = useParams()
  const juego = GAMES.find((j) => j.id === modoId)

  if (!juego) {
    return (
      <section className="page container">
        <h1>Modo no encontrado</h1>
        <p>Ese modo de juego no existe.</p>
        <Link to="/jugar">Volver a los modos de juego</Link>
      </section>
    )
  }

  return (
    <section className="page container">
      <h1>
        <span aria-hidden="true">{juego.icono}</span> {juego.titulo}
      </h1>
      <p>{juego.descripcion}</p>
      <p>Este modo está en construcción.</p>
      <Link to="/jugar">Volver a los modos de juego</Link>
    </section>
  )
}

export default JuegoEnConstruccion