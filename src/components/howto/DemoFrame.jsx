import { usePasosDemo } from '../../hooks/usePasosDemo.js'
import './DemoFrame.css'

// Marco de una demostración: barra con controles, "pantalla" y pasos.
// "demo" viene de demosConfig.js.
function DemoFrame({ demo }) {
  const { Componente, total, intervalo, titulo, leyendas, descripcion } = demo
  const { ref, paso, reducido, pausado, alternarPausa, reiniciar, irAPaso } = usePasosDemo({
    total,
    intervalo,
  })

  return (
    <figure className="dframe" ref={ref}>
      <div className="dframe__barra">
        <span className="dframe__luces" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="dframe__titulo">{titulo}</span>

        {!reducido && (
          <span className="dframe__controles">
            <button type="button" className="dframe__btn" onClick={reiniciar}>
              ↻ Repetir
            </button>
            <button
              type="button"
              className="dframe__btn"
              aria-pressed={pausado}
              onClick={alternarPausa}
            >
              {pausado ? '▶ Seguir' : '⏸ Pausar'}
            </button>
          </span>
        )}
      </div>

      {/* La demo es decorativa: la explicación completa está en el texto de la página */}
      <div className="dframe__pantalla" aria-hidden="true">
        <Componente paso={paso} />
      </div>

      <div className="dframe__pie">
        <p className="dframe__leyenda" aria-hidden="true">
          {leyendas[paso]}
        </p>
        <div className="dframe__navegacion">
          <ol className="dframe__pasos" aria-label="Pasos de la demostración">
            {leyendas.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`dframe__paso ${i === paso ? 'dframe__paso--activo' : ''}`}
                  aria-label={`Ir al paso ${i + 1} de ${leyendas.length}`}
                  aria-current={i === paso ? 'step' : undefined}
                  onClick={() => irAPaso(i)}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>

      <figcaption className="visually-hidden">{descripcion}</figcaption>
    </figure>
  )
}

export default DemoFrame
