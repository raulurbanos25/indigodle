import './TracklistBoard.css'
import { inicialesTitulo } from '../../models/Cancion.js'

// Lista de huecos del álbum. Si "revelar" es true, enseña también las que faltaban.
function TracklistBoard({ pistas, aciertosIds, revelar }) {
  return (
    <ol className="board" aria-label="Canciones del álbum">
      {pistas.map((pista) => {
        const acertada = aciertosIds.includes(pista.id)
        const visible = acertada || revelar
        const clase = acertada ? 'slot slot--acierto' : revelar ? 'slot slot--perdida' : 'slot'

        return (
          <li key={pista.id} className={clase}>
            <span className="slot__num">{pista.numeroPista}</span>
            <span className="slot__title">
              {visible ? (
                pista.titulo
              ) : (
                <>
                  <span className="slot__pista" aria-hidden="true">({inicialesTitulo(pista.titulo)})</span>
                  <span className="visually-hidden">Sin descubrir</span>
                </>
              )}
            </span>
            {acertada && <span aria-hidden="true">✔</span>}
            {!acertada && revelar && <span aria-hidden="true">✖</span>}
          </li>
        )
      })}
    </ol>
  )
}

export default TracklistBoard
