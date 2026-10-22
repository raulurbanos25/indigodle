import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal.js'
import { usePortada, useDisco } from '../../hooks/usePortada.js'
import './AlbumCard.css'

// Convierte el id del álbum en un tono de color (0 a 359), siempre el mismo para el mismo id.
// Solo se ve cuando el álbum no tiene portada.
function tonoDe(texto) {
  let h = 0
  for (let i = 0; i < texto.length; i++) {
    h = (h * 31 + texto.charCodeAt(i)) >>> 0
  }
  return h % 360
}

const limitar = (n) => Math.max(-0.5, Math.min(0.5, n))

function AlbumCard({ album, numCanciones, indice = 0 }) {
  const [revealRef, visible] = useReveal()
  const escenarioRef = useRef(null)
  const portada = usePortada(album)
  const disco = useDisco(album)
  // Hasta que la imagen del disco carga, se ve el disco dibujado con CSS
  const [discoListo, setDiscoListo] = useState(false)

  // Inclina la portada hacia el cursor. Solo con ratón y si no se pidió "reducir movimiento".
  const inclinar = (e) => {
    if (e.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const escenario = escenarioRef.current
    if (!escenario) return

    const caja = escenario.getBoundingClientRect()
    const x = limitar((e.clientX - caja.left) / caja.width - 0.5)
    const y = limitar((e.clientY - caja.top) / caja.height - 0.5)
    escenario.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`)
    escenario.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`)
  }

  const enderezar = () => {
    const escenario = escenarioRef.current
    if (!escenario) return
    escenario.style.setProperty('--rx', '0deg')
    escenario.style.setProperty('--ry', '0deg')
  }

  return (
    <Link
      ref={revealRef}
      to={`/discografia/${album.id}`}
      className={`album reveal reveal--up ${visible ? 'is-visible' : ''}`}
      style={{
        '--tono': tonoDe(album.id),
        '--delay': `${Math.min(indice, 8) * 110}ms`,
        '--asoma': `${900 + Math.min(indice, 8) * 160}ms`,
      }}
      onPointerMove={inclinar}
      onPointerLeave={enderezar}
    >
      {/* Parte decorativa: el disco va detrás de la portada */}
      <div className="album__stage" ref={escenarioRef} aria-hidden="true">
        <div className="album__disc">
          <div className={`album__disc-inner ${discoListo ? 'album__disc-inner--img' : ''}`}>
            {disco.src && (
              <img
                className="album__disc-img"
                src={disco.src}
                alt=""
                onLoad={() => setDiscoListo(true)}
                onError={disco.alFallar}
              />
            )}
          </div>
        </div>

        <div className="album__cover">
          <span className="album__placeholder">💿</span>
          {portada.src && (
            <img
              className="album__img"
              src={portada.src}
              alt=""
              loading="lazy"
              onError={portada.alFallar}
            />
          )}
          <span className="album__brillo" />
        </div>

        <span className="album__sombra" />
      </div>

      <div className="album__info">
        <h2 className="album__titulo">{album.titulo}</h2>
        <p className="album__datos">
          {album.anio} · {numCanciones} {numCanciones === 1 ? 'canción' : 'canciones'}
        </p>
        <span className="album__ver" aria-hidden="true">
          Ver canciones →
        </span>
      </div>
    </Link>
  )
}

export default AlbumCard
