import { COLUMNAS_CLASICO } from '../../models/Cancion.js'
import AttemptRow from './AttemptRow.jsx'
import './AttemptsTable.css'

// Tabla con las categorías siempre visibles y una fila por intento
// (el intento más reciente arriba).
function AttemptsTable({ intentos, objetivo }) {
  const filas = [...intentos].reverse()
  const totalColumnas = COLUMNAS_CLASICO.length + 1

  return (
    <div className="attempts" role="region" aria-label="Tus intentos" tabIndex={0}>
      <table className="attempts__table">
        <caption className="visually-hidden">
          Intentos comparados con la canción secreta
        </caption>
        <thead>
          <tr>
            <th scope="col" className="attempts__head attempts__head--song">
              Canción
            </th>
            {COLUMNAS_CLASICO.map((col) => (
              <th key={col.clave} scope="col" className="attempts__head">
                {col.etiqueta}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={totalColumnas} className="attempts__empty">
                Todavía no has probado ninguna canción.
              </td>
            </tr>
          ) : (
            filas.map((cancion) => (
              <AttemptRow key={cancion.id} cancion={cancion} objetivo={objetivo} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AttemptsTable