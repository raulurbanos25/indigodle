import './TimelineBoard.css'

// Fila de huecos (de más antigua a más reciente) y, debajo, las canciones por colocar.
function TimelineBoard({ orden, cartas, colocadasIds, malasIds, terminado, onElegir }) {
  const siguiente = colocadasIds.length
  const pendientes = cartas.filter((c) => !colocadasIds.includes(c.id))

  return (
    <div className="timeline">
      <ol className="timeline__slots" aria-label="Orden cronológico">
        {orden.map((cancion, i) => {
          const colocada = colocadasIds.includes(cancion.id)
          const revelada = !colocada && terminado
          const esActual = !terminado && i === siguiente

          let clase = 'slot-t'
          if (colocada) clase += ' slot-t--acierto'
          else if (revelada) clase += ' slot-t--revelada'
          else if (esActual) clase += ' slot-t--actual'

          let extremo = null
          if (i === 0) extremo = 'Más antigua'
          if (i === orden.length - 1) extremo = 'Más reciente'

          return (
            <li key={cancion.id} className={clase} aria-current={esActual ? 'step' : undefined}>
              <span className="slot-t__num">{i + 1}</span>
              <span className="slot-t__body">
                {extremo && <span className="slot-t__extremo">{extremo}</span>}
                {colocada || revelada ? (
                  <span className="slot-t__title">{cancion.titulo}</span>
                ) : (
                  <>
                    <span aria-hidden="true">? ? ? ? ?</span>
                    <span className="visually-hidden">Hueco vacío</span>
                  </>
                )}
              </span>
              {(colocada || revelada) && <span className="slot-t__year">{cancion.anio}</span>}
            </li>
          )
        })}
      </ol>

      {!terminado && (
        <ul className="timeline__cards">
          {pendientes.map((cancion) => {
            const mala = malasIds.includes(cancion.id)

            return (
              <li key={cancion.id}>
                <button
                  type="button"
                  className={`timeline-card ${mala ? 'timeline-card--fallo' : ''}`}
                  disabled={mala}
                  onClick={() => onElegir(cancion.id)}
                >
                  <span>{cancion.titulo}</span>
                  {mala && <span className="visually-hidden">No va en este hueco</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default TimelineBoard
