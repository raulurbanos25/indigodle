
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  duracionTotal,
  formatearDuracionTotal,
  invitadosConPistas,
  pistasDeAlbum,
  vecinosDeAlbum,
} from '../../models/Pistas.js'
import { tonoDe } from '../../services/color.js'
import { esUrlSegura } from '../../services/url.js'
import AlbumHero from './AlbumHero.jsx'
import ListaPistas from './ListaPistas.jsx'
import Reveal from '../home/Reveal.jsx'

// Página estándar de un álbum.
function AlbumPagina({
  album,
  personalizacion = {},
  despuesDeLaCabecera = null,
  antesDeCanciones = null,
  despuesDeCanciones = null,
  ocultar = [],
}) {
  const pistas = pistasDeAlbum(album.id)
  const invitados = invitadosConPistas(pistas)
  const { anterior, siguiente } = vecinosDeAlbum(album.id)
  const [mensaje, setMensaje] = useState('')

  // Prioridad: personalización individual, datos del álbum y tono predeterminado.
  const tono = Number.isFinite(personalizacion.tono)
    ? personalizacion.tono
    : Number.isFinite(album.tono)
      ? album.tono
      : tonoDe(album.id)

  const fondo = personalizacion.fondo
  const ComponenteFondo = personalizacion.componenteFondo

  const parrafos =
    typeof album.descripcion === 'string'
      ? album.descripcion
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      : []

  const enlaces = (album.enlaces ?? []).filter(
    (e) => e && typeof e.texto === 'string' && esUrlSegura(e.url),
  )

  const creditos = (album.creditos ?? []).filter(
    (c) => c && c.rol && c.nombre,
  )

  const mostrar = (parte) => !ocultar.includes(parte)

  // Abrir cada álbum desde arriba.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setMensaje('Enlace copiado al portapapeles.')
    } catch {
      setMensaje('No se ha podido copiar el enlace.')
    }
  }

  const datos = [
    ['Año', album.anio],
    ...(album.fechaLanzamiento
      ? [['Lanzamiento', album.fechaLanzamiento]]
      : []),
    ['Canciones', pistas.length],
    [
      'Duración',
      pistas.length > 0
        ? formatearDuracionTotal(duracionTotal(pistas))
        : '—',
    ],
    ...(invitados.length > 0
      ? [['Invitados', invitados.length]]
      : []),
  ]

  return (
    <section
      className={`page container album-pagina album-pagina--${album.id}`}
      style={{
        '--tono': tono,
        ...(fondo ? { '--album-fondo': fondo } : {}),
      }}
    >
      {/* Fondo personalizado del álbum, si tiene uno configurado */}
      {ComponenteFondo && <ComponenteFondo />}

      <nav aria-label="Ruta de navegación">
        <ol className="migas">
          <li>
            <Link to="/discografia">Discografía</Link>
          </li>
          <li aria-current="page">{album.titulo}</li>
        </ol>
      </nav>

      <div className="album-pagina__hero">
        <AlbumHero album={album} tono={tono} />

        <div className="album-pagina__info">
          <p className="album-pagina__kicker">Álbum</p>
          <h1 className="album-pagina__titulo">{album.titulo}</h1>

          {parrafos.length > 0 && (
            <div className="album-pagina__descripcion">
              {parrafos.map((parrafo) => (
                <p key={parrafo}>{parrafo}</p>
              ))}
            </div>
          )}

          <dl className="album-datos">
            {datos.map(([etiqueta, valor]) => (
              <div key={etiqueta} className="album-dato">
                <dt>{etiqueta}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>

          <div className="album-pagina__acciones">
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={copiarEnlace}
            >
              🔗 Copiar enlace
            </button>

            <Link to="/discografia" className="btn btn--ghost btn--small">
              ← Volver a la discografía
            </Link>

            {enlaces.map((enlace) => (
              <a
                key={enlace.url}
                href={enlace.url}
                className="btn btn--ghost btn--small"
                target="_blank"
                rel="noopener noreferrer"
              >
                {enlace.texto} ↗
              </a>
            ))}
          </div>

          <p className="album-pagina__mensaje" role="status">
            {mensaje}
          </p>
        </div>
      </div>

      {despuesDeLaCabecera}

      {antesDeCanciones}

      <Reveal
        as="section"
        className="album-pagina__seccion"
        aria-labelledby="titulo-canciones"
      >
        <h2 id="titulo-canciones">Canciones</h2>

        {pistas.length > 0 ? (
          <ListaPistas pistas={pistas} />
        ) : (
          <p className="album-pagina__vacio">
            Todavía no hay canciones de este álbum en el catálogo.
          </p>
        )}
      </Reveal>

      {despuesDeCanciones}

      {mostrar('invitados') && invitados.length > 0 && (
        <Reveal
          as="section"
          className="album-pagina__seccion"
          aria-labelledby="titulo-invitados"
        >
          <h2 id="titulo-invitados">Artistas invitados</h2>

          <ul className="invitados-album">
            {invitados.map((invitado) => (
              <li key={invitado.nombre} className="invitado-album">
                <p className="invitado-album__nombre">
                  {invitado.nombre}
                </p>

                <p className="invitado-album__n">
                  {invitado.canciones.length}{' '}
                  {invitado.canciones.length === 1
                    ? 'canción'
                    : 'canciones'}
                </p>

                <p className="invitado-album__canciones">
                  {invitado.canciones
                    .map((c) => c.titulo)
                    .join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {mostrar('creditos') && creditos.length > 0 && (
        <Reveal
          as="section"
          className="album-pagina__seccion"
          aria-labelledby="titulo-creditos"
        >
          <h2 id="titulo-creditos">Créditos</h2>

          <dl className="album-creditos">
            {creditos.map((credito) => (
              <div
                key={`${credito.rol}-${credito.nombre}`}
                className="album-credito"
              >
                <dt>{credito.rol}</dt>
                <dd>{credito.nombre}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      {mostrar('vecinos') && (anterior || siguiente) && (
        <nav className="vecinos" aria-label="Otros álbumes">
          {anterior ? (
            <Link
              to={`/discografia/${anterior.id}`}
              className="vecino vecino--anterior"
            >
              <span className="vecino__etiqueta">← Anterior</span>
              <span className="vecino__titulo">
                {anterior.titulo}
              </span>
              <span className="vecino__anio">{anterior.anio}</span>
            </Link>
          ) : (
            <span />
          )}

          {siguiente && (
            <Link
              to={`/discografia/${siguiente.id}`}
              className="vecino vecino--siguiente"
            >
              <span className="vecino__etiqueta">Siguiente →</span>
              <span className="vecino__titulo">
                {siguiente.titulo}
              </span>
              <span className="vecino__anio">{siguiente.anio}</span>
            </Link>
          )}
        </nav>
      )}
    </section>
  )
}

export default AlbumPagina
