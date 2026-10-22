import { usePortada, useDisco, useImagenCancion } from '../../hooks/usePortada.js'
import './CaratulaCancion.css'

// Portada de una canción:
//  - si es de un álbum: la caja (public/albumes/); si no existe, el disco (public/discos/)
//  - si es un single suelto: su imagen (public/portadas/)
// Si no hay ninguna imagen, se ve un icono. "album" es null para los singles.
function CaratulaCancion({ cancion, album }) {
  const caja = usePortada(album)
  const disco = useDisco(album)
  const single = useImagenCancion(album ? null : cancion)

  const esDisco = Boolean(album) && !caja.src
  const fuente = album ? (caja.src ? caja : disco) : single

  return (
    <div className={`caratula ${esDisco ? 'caratula--disco' : ''}`} aria-hidden="true">
      <span className="caratula__vacia">{album ? '💿' : '🎵'}</span>
      {fuente.src && (
        <img className="caratula__img" src={fuente.src} alt="" onError={fuente.alFallar} />
      )}
    </div>
  )
}

export default CaratulaCancion