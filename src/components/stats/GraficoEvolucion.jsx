import { useReveal } from '../../hooks/useReveal.js'
import { formatearFecha } from '../../services/estadisticas.js'

const ANCHO = 640
const ALTO = 240
const MARGEN = { izq: 44, der: 16, arriba: 16, abajo: 30 }

// Gráfico de línea hecho con SVG: tu % de victorias acumulado, día a día
function GraficoEvolucion({ puntos }) {
  const [ref, visible] = useReveal({ threshold: 0.3 })

  const contenido = () => {
    if (puntos.length < 2) {
      return (
        <p className="stats__nota">
          Juega en al menos dos días distintos para ver cómo evoluciona tu porcentaje de
          victorias.
        </p>
      )
    }

    const ancho = ANCHO - MARGEN.izq - MARGEN.der
    const alto = ALTO - MARGEN.arriba - MARGEN.abajo
    const x = (i) => MARGEN.izq + (i / (puntos.length - 1)) * ancho
    const y = (porcentaje) => MARGEN.arriba + (1 - porcentaje / 100) * alto

    const linea = puntos
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(p.porcentaje).toFixed(1)}`)
      .join(' ')
    const area = `${linea} L${x(puntos.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`

    const primero = puntos[0]
    const ultimo = puntos[puntos.length - 1]
    const resumen = `Evolución de tu porcentaje de victorias: del ${primero.porcentaje}% el ${formatearFecha(primero.fecha)} al ${ultimo.porcentaje}% el ${formatearFecha(ultimo.fecha)}.`

    return (
      <svg
        className="grafico__svg"
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        role="img"
        aria-label={resumen}
      >
        <defs>
          {/* userSpaceOnUse: así también se ve si la línea es completamente plana */}
          <linearGradient
            id="grafico-gradiente"
            gradientUnits="userSpaceOnUse"
            x1={MARGEN.izq}
            y1="0"
            x2={ANCHO - MARGEN.der}
            y2="0"
          >
            <stop offset="0%" style={{ stopColor: 'var(--color-primary)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-accent)' }} />
          </linearGradient>
          <linearGradient id="grafico-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0.35 }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {[0, 25, 50, 75, 100].map((valor) => (
          <g key={valor}>
            <line
              className="grafico__rejilla"
              x1={MARGEN.izq}
              x2={ANCHO - MARGEN.der}
              y1={y(valor)}
              y2={y(valor)}
            />
            <text className="grafico__texto" x={MARGEN.izq - 8} y={y(valor) + 4} textAnchor="end">
              {valor}%
            </text>
          </g>
        ))}

        <path className="grafico__area" d={area} fill="url(#grafico-area)" />
        <path
          className="grafico__linea"
          d={linea}
          pathLength="1"
          stroke="url(#grafico-gradiente)"
        />

        {puntos.map((p, i) => (
          <circle
            key={p.fecha}
            className="grafico__punto"
            cx={x(i)}
            cy={y(p.porcentaje)}
            r="3.5"
            style={{ '--i': i }}
          >
            <title>{`${formatearFecha(p.fecha)}: ${p.porcentaje}% (${p.ganadas} de ${p.jugadas})`}</title>
          </circle>
        ))}

        <text className="grafico__texto" x={MARGEN.izq} y={ALTO - 8}>
          {formatearFecha(primero.fecha)}
        </text>
        <text className="grafico__texto" x={ANCHO - MARGEN.der} y={ALTO - 8} textAnchor="end">
          {formatearFecha(ultimo.fecha)}
        </text>
      </svg>
    )
  }

  // El contenedor siempre existe, para que la animación se active al aparecer en pantalla
  return (
    <div ref={ref} className={`grafico ${visible ? 'is-visible' : ''}`}>
      {contenido()}
    </div>
  )
}

export default GraficoEvolucion