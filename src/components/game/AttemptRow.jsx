import { compararCanciones, buscarAlbum } from '../../models/Cancion.js'
import AttributeCell from './AttributeCell.jsx'
import AlbumCover from './AlbumCover.jsx'

// Una fila de la tabla: el título de la canción y una celda por categoría.
function AttemptRow({ cancion, objetivo }) {
  const columnas = compararCanciones(cancion, objetivo)

  return (
    <tr>
      <th scope="row" className="attempts__song">
        {cancion.titulo}
      </th>
      {columnas.map((col, i) => (
        <AttributeCell
          key={col.clave}
          texto={col.texto}
          acierto={col.acierto}
          direccion={col.direccion}
          indice={i}
          media={
            col.clave === 'album' ? (
              <AlbumCover album={buscarAlbum(col.albumId)} />
            ) : null
          }
        />
      ))}
    </tr>
  )
}

export default AttemptRow