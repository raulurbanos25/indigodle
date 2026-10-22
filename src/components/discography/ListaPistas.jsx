import { formatearDuracion } from '../../models/Cancion.js'
import Reveal from '../home/Reveal.jsx'
import './ListaPistas.css'

function Pista({ cancion, indice }) {
  const numero = cancion.numeroPista ?? indice + 1

  return (
    <Reveal as="li" direccion="left" delay={Math.min(indice, 8) * 50} className="pista-item">
      <div className="pista-fila">
        <span className="pista-fila__num pista-fila__num--static" aria-label={`Canción ${numero}`}>
          {numero}
        </span>
        <div className="pista-fila__centro">
          <p className="pista-fila__titulo">{cancion.titulo}</p>
          {cancion.colaboradores?.length > 0 && (
            <p className="pista-fila__con">con {cancion.colaboradores.join(', ')}</p>
          )}
        </div>
        <time className="pista-fila__dur" dateTime={`PT${cancion.duracionSeg}S`}>
          {formatearDuracion(cancion.duracionSeg)}
        </time>
      </div>
    </Reveal>
  )
}

function ListaPistas({ pistas }) {
  return (
    <ol className="lista-pistas">
      {pistas.map((cancion, indice) => (
        <Pista key={cancion.id} cancion={cancion} indice={indice} />
      ))}
    </ol>
  )
}

export default ListaPistas
