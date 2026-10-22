import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page container">
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}

export default NotFound