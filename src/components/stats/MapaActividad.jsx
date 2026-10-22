import { useReveal } from '../../hooks/useReveal.js'
import { formatearFecha } from '../../services/estadisticas.js'

const DIAS = ['L', '', 'X', '', 'V', '', 'D']

const LEYENDA = [
  ['vacio', 'Sin partidas'],
  ['perdido', 'Sin victorias'],
  ['n1', '1-2 victorias'],
  ['n2', '3-5'],
  ['n3', '6 o más'],
]

// Calendario de las últimas semanas: cada cuadrado es un día
function MapaActividad({ celdas }) {
  const [ref, visible] = useReveal({ threshold: 0.3 })
  const diasConPartidas = celdas.filter((celda) => celda.jugadas > 0).length

  return (
    <div ref={ref} className={`mapa ${visible ? 'is-visible' : ''}`}>
      <div className="mapa__cuerpo">
        <div className="mapa__dias" aria-hidden="true">
          {DIAS.map((dia, i) => (
            <span key={i}>{dia}</span>
          ))}
        </div>

        <div
          className="mapa__rejilla"
          role="img"
          aria-label={`Actividad de las últimas ${celdas.length / 7} semanas: ${diasConPartidas} días con partidas.`}
        >
          {celdas.map((celda, i) => (
            <span
              key={celda.fecha}
              className={`mapa__dia nivel--${celda.futuro ? 'futuro' : celda.nivel}`}
              style={{ '--i': i }}
              title={
                celda.futuro
                  ? undefined
                  : `${formatearFecha(celda.fecha)}: ${celda.jugadas} jugadas, ${celda.ganadas} ganadas`
              }
            />
          ))}
        </div>
      </div>

      <ul className="mapa__leyenda" aria-hidden="true">
        {LEYENDA.map(([nivel, texto]) => (
          <li key={nivel}>
            <span className={`mapa__muestra nivel--${nivel}`} /> {texto}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MapaActividad