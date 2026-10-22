import './LineaAnios.css'

function textoDelRango(rango) {
  if (!rango) return 'Todos los años'
  if (rango.desde === rango.hasta) return String(rango.desde)
  return `${rango.desde} – ${rango.hasta}`
}

// Línea de tiempo para filtrar por años.
//  - "anios": [{ anio, cantidad }] ordenados de menor a mayor
//  - "rango": null (todos) o { desde, hasta }
function LineaAnios({ anios, rango, onElegir, onLimpiar }) {
  return (
    <div className="lineaanios">
      <div className="lineaanios__cabecera">
        <span className="lineaanios__titulo">Años</span>
        <span className="lineaanios__estado" role="status">
          {textoDelRango(rango)}
        </span>
        {rango && (
          <button type="button" className="enlace" onClick={onLimpiar}>
            Ver todos
          </button>
        )}
      </div>

      <ol className="lineaanios__pista" aria-label="Filtrar por años">
        {anios.map((item, i) => {
          const dentro = Boolean(rango) && item.anio >= rango.desde && item.anio <= rango.hasta
          const extremo = Boolean(rango) && (item.anio === rango.desde || item.anio === rango.hasta)
          const siguiente = anios[i + 1]
          const tramo =
            dentro &&
            Boolean(siguiente) &&
            siguiente.anio >= rango.desde &&
            siguiente.anio <= rango.hasta

          return (
            <li
              key={item.anio}
              className={`nodo ${dentro ? 'nodo--dentro' : ''} ${extremo ? 'nodo--extremo' : ''} ${
                tramo ? 'nodo--tramo' : ''
              }`}
            >
              <button
                type="button"
                className="nodo__boton"
                aria-pressed={dentro}
                aria-label={`${item.anio}, ${item.cantidad} ${
                  item.cantidad === 1 ? 'single' : 'singles'
                }`}
                onClick={() => onElegir(item.anio)}
              >
                <span className="nodo__punto" aria-hidden="true" />
                <span className="nodo__anio" aria-hidden="true">
                  {item.anio}
                </span>
                <span className="nodo__n" aria-hidden="true">
                  {item.cantidad}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <p className="lineaanios__ayuda">Pulsa un año, o dos para elegir un rango.</p>
    </div>
  )
}

export default LineaAnios