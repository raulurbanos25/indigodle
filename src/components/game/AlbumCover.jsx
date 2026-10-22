import { usePortada } from '../../hooks/usePortada.js'
import './AlbumCover.css'

// Muestra la portada del álbum si existe; si no, un icono provisional.
//  - "album": el objeto del álbum, o null (single suelto)
//  - "rutaFija": si ya sabemos la ruta de la imagen, se usa directamente
//  - "icono": icono de relleno (por defecto 💿 para álbumes y 🎵 para singles)
function AlbumCover({ album, rutaFija = null, icono }) {
  const { src: srcBuscada, alFallar } = usePortada(rutaFija ? null : album)
  const src = rutaFija ?? srcBuscada

  return (
    <span className="cover" aria-hidden="true">
      <span>{icono ?? (album ? '💿' : '🎵')}</span>
      {src && (
        <img
          className="cover__img"
          src={src}
          alt=""
          loading="lazy"
          onError={rutaFija ? undefined : alFallar}
        />
      )}
    </span>
  )
}

export default AlbumCover