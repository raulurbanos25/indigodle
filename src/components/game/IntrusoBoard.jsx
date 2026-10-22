import './IntrusoBoard.css'

// Texto solo para lectores de pantalla (el color no puede ser lo único que informe)
const TEXTO_OCULTO = {
  acierto: 'Intruso, acierto',
  fallo: 'Es del álbum, fallo',
  perdido: 'Era un intruso',
  album: 'Es del álbum',
}

// Cuadrícula de canciones. Al tocar una, se revela al instante si acertaste.
function IntrusoBoard({ cartas, intrusosIds, encontradosIds, descartadasIds, terminado, onElegir }) {
  const estadoDe = (id) => {
    if (encontradosIds.includes(id)) return 'acierto'
    if (descartadasIds.includes(id)) return 'fallo'
    if (terminado) return intrusosIds.includes(id) ? 'perdido' : 'album'
    return 'normal'
  }

  return (
    <ul className="intruso-board">
      {cartas.map((cancion) => {
        const estado = estadoDe(cancion.id)
        const bloqueada = estado !== 'normal'

        return (
          <li key={cancion.id}>
            <button
              type="button"
              className={`intruso-card intruso-card--${estado}`}
              disabled={bloqueada}
              onClick={() => onElegir(cancion.id)}
            >
              <span className="intruso-card__title">{cancion.titulo}</span>
              {TEXTO_OCULTO[estado] && (
                <span className="visually-hidden">{TEXTO_OCULTO[estado]}</span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default IntrusoBoard