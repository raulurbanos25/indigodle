import { ALBUMS } from '../data/albums.js'
import { SONGS } from '../data/songs.js'
import AlbumCard from '../components/discography/AlbumCard.jsx'
import SinglesExplorer from '../components/discography/SinglesExplorer.jsx'
import './Discografia.css'

function Discografia() {
  const ordenAlbumes = ['album-1', 'album-2', 'album-3', 'album-5', 'album-4']
  const posicionAlbum = (album) => {
    const posicion = ordenAlbumes.indexOf(album.id)
    return posicion < 0 ? ordenAlbumes.length : posicion
  }
  const albumes = [...ALBUMS].sort((a, b) => posicionAlbum(a) - posicionAlbum(b))
  const singles = SONGS.filter((c) => !c.albumId)

  const primerAnio = albumes.length > 0 ? albumes[albumes.length - 1].anio : null
  const ultimoAnio = albumes.length > 0 ? albumes[0].anio : null

  return (
    <section className="page container disco">
      <header className="disco__cabecera">
        <p className="disco__kicker">Catálogo</p>
        <h1>DISCOGRAFÍA</h1>
        <p className="disco__intro">
          Pasa el ratón por una portada (o enfócala con el teclado) y descubre el disco.
          Pulsa un álbum para ver sus canciones.
        </p>
        {albumes.length > 0 && (
          <p className="disco__resumen">
            {albumes.length} {albumes.length === 1 ? 'álbum' : 'álbumes'}
            {primerAnio !== ultimoAnio ? ` · de ${primerAnio} a ${ultimoAnio}` : ` · ${primerAnio}`}
            {singles.length > 0 && ` · ${singles.length} singles sueltos`}
          </p>
        )}
      </header>

      {albumes.length > 0 ? (
        <ul className="disco__fila">
          {albumes.map((album, i) => (
            <li key={album.id} className="disco__item">
              <AlbumCard
                album={album}
                indice={i}
                numCanciones={SONGS.filter((c) => c.albumId === album.id).length}
              />
            </li>
          ))}
          {albumes.length === 5 && (
            <li className="disco__item disco__item--proximo" aria-label="Espacio reservado para el próximo álbum">
              <div className="disco__proximo">
                <span className="disco__proximo-disco" aria-hidden="true"><span /></span>
                <strong>PRÓXIMO ÁLBUM</strong>
                <small>Espacio reservado</small>
              </div>
            </li>
          )}
        </ul>
      ) : (
        <p className="disco__vacio">Todavía no hay álbumes en el catálogo.</p>
      )}

      <SinglesExplorer singles={singles} />
    </section>
  )
}

export default Discografia
