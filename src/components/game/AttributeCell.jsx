import './AttributeCell.css'

function textoAccesible(acierto, direccion) {
  let texto = acierto ? 'Acierto' : 'Fallo'
  if (direccion === 'subir') texto += '. El valor buscado es mayor'
  if (direccion === 'bajar') texto += '. El valor buscado es menor'
  return texto
}

// Una celda de la tabla. "media" es un elemento opcional (por ejemplo la portada).
function AttributeCell({ texto, acierto, direccion, media, indice }) {
  const flecha = direccion === 'subir' ? '↑' : direccion === 'bajar' ? '↓' : null

  return (
    <td className="cell-td">
      <div
        className={`cell ${acierto ? 'cell--acierto' : 'cell--fallo'}`}
        style={{ animationDelay: `${indice * 110}ms` }}
      >
        <span className="cell__mark" aria-hidden="true">
          {acierto ? '✔' : '✖'}
        </span>
        {media}
        <span className="cell__value">
          {texto}
          {flecha && (
            <span className="cell__arrow" aria-hidden="true">
              {' '}
              {flecha}
            </span>
          )}
        </span>
        <span className="visually-hidden">{textoAccesible(acierto, direccion)}</span>
      </div>
    </td>
  )
}

export default AttributeCell