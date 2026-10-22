
import { Link, useParams } from 'react-router-dom'

import { ALBUMS } from '../data/albums.js'
import { useTituloPagina } from '../hooks/useTituloPagina.js'
import AlbumPagina from '../components/discography/AlbumPagina.jsx'
import './AlbumDetalle.css'

// Carga las páginas y configuraciones individuales de los álbumes.
const MODULOS = import.meta.glob('./albumes/*.jsx', {
  eager: true,
})

function AlbumDetalle() {
  const { albumId } = useParams()
  const album = ALBUMS.find((a) => a.id === albumId)

  useTituloPagina(album ? album.titulo : 'Álbum no encontrado')

  if (!album) {
    return (
      <section className="page container">
        <h1>Álbum no encontrado</h1>
        <p>No existe ningún álbum con esa dirección.</p>
        <Link to="/discografia">Volver a la discografía</Link>
      </section>
    )
  }

  const modulo = MODULOS[`./albumes/${album.id}.jsx`]
  const PaginaPropia = modulo?.default

  // Si el archivo exporta un componente React, utiliza su página independiente.
  if (typeof PaginaPropia === 'function') {
    return <PaginaPropia key={album.id} album={album} />
  }

  // Mientras un álbum no tenga página propia, conserva la página anterior.
  return (
    <AlbumPagina
      key={album.id}
      album={album}
      personalizacion={PaginaPropia ?? {}}
    />
  )
}

export default AlbumDetalle
