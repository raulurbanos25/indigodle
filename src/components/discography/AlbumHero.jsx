import { useEffect, useState } from 'react'
import { usePortada, useDisco } from '../../hooks/usePortada.js'
import './AlbumHero.css'

// La portada del álbum con el CD detrás. El CD sale solo al cargar y gira.
// Al pulsar la portada, el CD se guarda o se vuelve a sacar.
function AlbumHero({ album, tono }) {
  const portada = usePortada(album)
  const disco = useDisco(album)
  const [abierto, setAbierto] = useState(false)

  // Sale tras una pequeña pausa para que se vea la animación (de golpe con "reducir movimiento")
  useEffect(() => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = setTimeout(() => setAbierto(true), reducir ? 0 : 700)
    return () => clearTimeout(id)
  }, [])

  return (
    <div
      className={`hero-disco ${abierto ? 'hero-disco--abierto' : ''}`}
      style={{ '--tono': tono }}
    >
      <div className="hero-disco__escenario">
        <div className="hero-disco__cd" aria-hidden="true">
          <div className={`hero-disco__giro ${disco.cargada ? 'hero-disco__giro--img' : ''}`}>
            {disco.src && (
              <img
                className="hero-disco__img-cd"
                src={disco.src}
                alt=""
                loading="eager"
                decoding="async"
                onLoad={disco.alCargar}
                onError={disco.alFallar}
              />
            )}
          </div>
          <span className="hero-disco__brillo" />
        </div>

        <button
          type="button"
          className="hero-disco__caja"
          aria-pressed={abierto}
          aria-label="Sacar el CD de la caja"
          onClick={() => setAbierto((actual) => !actual)}
        >
          <span className="hero-disco__placeholder" aria-hidden="true">
            💿
          </span>
          {portada.src && (
            <img
              className="hero-disco__img"
              src={portada.src}
              alt=""
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onError={portada.alFallar}
            />
          )}
          <span className="hero-disco__destello" aria-hidden="true" />
        </button>

        <span className="hero-disco__sombra" aria-hidden="true" />
      </div>

      <p className="hero-disco__ayuda">Pulsa la portada para sacar o guardar el CD</p>
    </div>
  )
}

export default AlbumHero
