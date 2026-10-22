import './CoverReveal.css'

// Cuánto desenfoque (px) y zoom tiene la portada en cada nivel.
// El nivel es el número de fallos. Al terminar la partida se muestra entera.
const NIVELES = [
  { blur: 24, zoom: 3.2 },
  { blur: 17, zoom: 2.6 },
  { blur: 11, zoom: 2 },
  { blur: 7, zoom: 1.6 },
  { blur: 4, zoom: 1.25 },
  { blur: 2, zoom: 1 },
]

function CoverReveal({ src, nivel, estado, titulo, origen }) {
  const revelada = estado !== 'jugando'
  const { blur, zoom } = revelada
    ? { blur: 0, zoom: 1 }
    : NIVELES[Math.min(nivel, NIVELES.length - 1)]

  return (
    <figure className="rcover">
      <div
        className={`rcover__marco ${revelada ? `rcover__marco--${estado}` : ''}`}
        role="img"
        aria-label={revelada ? `Portada de ${titulo}` : 'Portada difuminada'}
      >
        <img
          className="rcover__img"
          src={src}
          alt=""
          draggable={false}
          style={{
            '--blur': `${blur}px`,
            '--zoom': zoom,
            '--ox': `${origen.x}%`,
            '--oy': `${origen.y}%`,
          }}
        />
      </div>

      <figcaption className="rcover__nitidez">
        <ol className="rcover__puntos" aria-hidden="true">
          {NIVELES.map((_, i) => (
            <li
              key={i}
              className={`rcover__punto ${revelada || i <= nivel ? 'rcover__punto--on' : ''}`}
            />
          ))}
        </ol>
        <span>
          Nitidez: {revelada ? NIVELES.length : Math.min(nivel + 1, NIVELES.length)} /{' '}
          {NIVELES.length}
        </span>
      </figcaption>
    </figure>
  )
}

export default CoverReveal