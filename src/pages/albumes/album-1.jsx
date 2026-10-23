
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  duracionTotal,
  formatearDuracionTotal,
  invitadosConPistas,
  pistasDeAlbum,
  vecinosDeAlbum,
} from '../../models/Pistas.js'

import { formatearDuracion } from '../../models/Cancion.js'
import { tonoDe } from '../../services/color.js'
import { esUrlSegura } from '../../services/url.js'
import { usePortada, useDisco } from '../../hooks/usePortada.js'
import { useTransicionEraEntrada } from '../../hooks/useTransicionEraEntrada.js'

import './album-1.css'
import './transicion-era.css'

const FOTOS_COLABORACIONES = {
  belinda: 'Belinda.png',
  beret: 'Beret.png',
  cauty: 'Cauty.png',
  'don patricio': 'Don Patricio.png',
  guaynaa: 'Guaynaa.png',
  khea: 'KHEA.png',
  'lalo ebratt': 'Lalo Ebratt.png',
  lyanno: 'Lyanno.png',
  'maikel delacalle': 'Maikel Delacalle.png',
  'mala rodriguez': 'Mala Rodriguez.png',
  nabalez: 'Nabález.png',
  'the rudeboyz': 'The Rudeboyz.png',
  'rauw alejandro': 'Rauw Alejandro.png',
  'roy borland': 'Roy Borland.png',
  tini: 'TINI.png',
}

function fotoColaboracion(nombre) {
  const clave = nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')
  const archivo = FOTOS_COLABORACIONES[clave]
  return archivo ? `/colaboraciones/${encodeURIComponent(archivo)}` : null
}

function agruparColaboraciones(pistas) {
  const grupos = new Map()
  for (const cancion of pistas) {
    const artistas = (cancion.colaboradores ?? []).map((nombre) => nombre.trim()).filter(Boolean)
    if (!artistas.length) continue
    const clave = artistas.map((nombre) => nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')).sort().join('|')
    if (!grupos.has(clave)) grupos.set(clave, { artistas, canciones: [] })
    grupos.get(clave).canciones.push(cancion)
  }
  return [...grupos.values()]
}

function CancionAkelarre({ cancion, indice }) {
  return (
    <li className="akelarre-pista" style={{ '--numero-pista': indice + 1 }}>
      <div className="akelarre-pista__fila">
        <span className="akelarre-pista__numero">
          {String(indice + 1).padStart(2, '0')}
        </span>
        <div className="akelarre-pista__contenido">
          <span className="akelarre-pista__titulo">{cancion.titulo}</span>

          {cancion.colaboradores?.length > 0 && (
            <p className="akelarre-pista__colaboradores">
              con {cancion.colaboradores.join(', ')}
            </p>
          )}
        </div>

        <time className="akelarre-pista__duracion">
          {formatearDuracion(cancion.duracionSeg)}
        </time>
      </div>
    </li>
  )
}

function Album1({ album }) {
  const transicionEntrada = useTransicionEraEntrada()
  const pistas = pistasDeAlbum(album.id)
  const invitados = invitadosConPistas(pistas)
  const colaboraciones = agruparColaboraciones(pistas)
  const { anterior, siguiente } = vecinosDeAlbum(album.id)

  const portada = usePortada(album)
  const disco = useDisco(album)

  const [cdAbierto, setCdAbierto] = useState(true)
  const [deluxeActiva, setDeluxeActiva] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const tono = Number.isFinite(album.tono)
    ? album.tono
    : tonoDe(album.id)

  const enlaces = (album.enlaces ?? []).filter(
    (enlace) =>
      enlace &&
      typeof enlace.texto === 'string' &&
      esUrlSegura(enlace.url),
  )

  const creditos = (album.creditos ?? []).filter(
    (credito) => credito?.rol && credito?.nombre,
  )

  const datos = [
    ['Año', album.anio],
    ['Canciones', pistas.length],
    [
      'Duración',
      pistas.length
        ? formatearDuracionTotal(duracionTotal(pistas))
        : '—',
    ],
    ['Artistas', invitados.length],
  ]

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

  return (
    <main
      className="akelarre-page"
      style={{ '--akelarre-tono': tono }}
    >
      <div className="akelarre-page__fondo" aria-hidden="true">
        <video className="akelarre-page__video" autoPlay muted loop playsInline preload="auto">
          <source src="/fondo/fondo4.mp4" type="video/mp4" />
        </video>
        <span className="akelarre-page__velo" />
        <span className="akelarre-page__orb akelarre-page__orb--uno" />
        <span className="akelarre-page__orb akelarre-page__orb--dos" />
        <span className="akelarre-page__rejilla" />
      </div>

      <div className="akelarre-page__contenido">
        <nav className="akelarre-migas" aria-label="Ruta de navegación">
          <Link to="/discografia">Discografía</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{album.titulo}</span>
        </nav>

        <header className="akelarre-hero">
          <div className={`akelarre-cd ${cdAbierto ? 'akelarre-cd--abierto' : ''}`}>
            <div className="akelarre-cd__escenario">
              <div className="akelarre-cd__disco" aria-hidden="true">
                <div
                  className={`akelarre-cd__giro ${
                    disco.cargada ? 'akelarre-cd__giro--imagen' : ''
                  }`}
                >
                  {disco.src && (
                    <img
                      src={disco.src} loading="eager" decoding="async"
                      alt=""
                      onLoad={disco.alCargar}
                      onError={disco.alFallar}
                    />
                  )}
                </div>
                <span className="akelarre-cd__centro" />
              </div>

              <button
                type="button"
                className="akelarre-cd__portada"
                aria-label={cdAbierto ? 'Guardar el CD' : 'Sacar el CD'}
                aria-pressed={cdAbierto}
                onClick={() => setCdAbierto((actual) => !actual)}
              >
                {portada.src ? (
                  <img
                    key={deluxeActiva ? 'akelarre-deluxe' : 'akelarre-original'}
                    className="akelarre-cd__imagen-portada"
                    src={deluxeActiva ? '/covers/Akelarre1.webp' : portada.src}
                    alt={`Portada ${deluxeActiva ? 'deluxe' : 'original'} del álbum ${album.titulo}`}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={deluxeActiva ? undefined : portada.alFallar}
                  />
                ) : (
                  <span className="akelarre-cd__sin-portada">
                    {album.titulo}
                  </span>
                )}
              </button>

            <button
              type="button"
              className="akelarre-cd__deluxe-toggle"
              aria-pressed={deluxeActiva}
              onClick={() => setDeluxeActiva((actual) => !actual)}
            >
              {deluxeActiva ? 'VOLVER A LA ORIGINAL' : 'VER PORTADA DEL DELUXE'}
            </button>
            </div>

          </div>

          <div className="akelarre-hero__info">
            <h1>
              <img
                className="akelarre-hero__titulo-imagen"
                src="/titulos/Akelarre-transparente.png"
                alt="Aquelarre"
              />
            </h1>

            <dl className="akelarre-estadisticas">
              {datos.map(([etiqueta, valor], indice) => (
                <div key={etiqueta} className={`akelarre-estadistica akelarre-estadistica--${indice}`}>
                  <dt>{etiqueta}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>

            <div className="akelarre-acciones">
              <button
                type="button"
                className="akelarre-boton akelarre-boton--principal"
                onClick={copiarEnlace}
              >
                ↗ COMPARTIR ÁLBUM
              </button>

              <Link
                to="/discografia"
                className="akelarre-boton akelarre-boton--secundario akelarre-boton--discografia"
              >
                ← VER DISCOGRAFÍA
              </Link>

              {enlaces.map((enlace) => (
                <a
                  key={enlace.url}
                  href={enlace.url}
                  className="akelarre-boton akelarre-boton--secundario"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {enlace.texto} ↗
                </a>
              ))}
            </div>

            <p className="akelarre-mensaje" role="status">
              {mensaje}
            </p>
          </div>
        </header>

        <div className="akelarre-disco-layout">
        <section className="akelarre-seccion akelarre-seccion--tracklist" aria-labelledby="akelarre-canciones">
          <div className="akelarre-seccion__encabezado">
            <div>
              <h2 id="akelarre-canciones">TRACKLIST</h2>
            </div>

            <span className="akelarre-seccion__contador">
              {String(pistas.length).padStart(2, '0')} pistas
            </span>
          </div>

          {pistas.length > 0 ? (
            <ol className="akelarre-lista">
              {pistas.map((cancion, indice) => (
                <CancionAkelarre
                  key={cancion.id}
                  cancion={cancion}
                  indice={indice}
                />
              ))}
            </ol>
          ) : (
            <p className="akelarre-vacio">
              Todavía no hay canciones de este álbum en el catálogo.
            </p>
          )}

        </section>

        {colaboraciones.length > 0 && (
          <section
            className="akelarre-seccion akelarre-seccion--colaboraciones"
            aria-labelledby="akelarre-invitados"
          >
            <div className="akelarre-seccion__encabezado">
              <div>
                <h2 id="akelarre-invitados">COLABORACIONES</h2>
              </div>
            </div>

            <ul className="akelarre-invitados">
              {colaboraciones.map((colaboracion) => (
                <li key={colaboracion.artistas.join('|')} className="akelarre-invitado">
                  <div className={`akelarre-invitado__artistas ${colaboracion.artistas.length > 1 ? 'akelarre-invitado__artistas--varios' : ''}`}>
                    {colaboracion.artistas.map((artista) => fotoColaboracion(artista) ? <img key={artista} className="akelarre-invitado__foto" src={fotoColaboracion(artista)} alt={`Foto de ${artista}`} loading="eager" decoding="async" /> : <span key={artista} className="akelarre-invitado__foto akelarre-invitado__foto--iniciales" aria-label={artista}>{artista.slice(0, 1)}</span>)}
                  </div>
                  <h3>{colaboracion.artistas.join(' + ')}</h3>
                  <p className="akelarre-invitado__cantidad">
                    {colaboracion.canciones.length}{' '}
                    {colaboracion.canciones.length === 1
                      ? 'canción'
                      : 'canciones'}
                  </p>
                  <p className="akelarre-invitado__temas">
                    {colaboracion.canciones.map((c) => c.titulo).join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
        </div>

        {creditos.length > 0 && (
          <section
            className="akelarre-seccion"
            aria-labelledby="akelarre-creditos"
          >
            <div className="akelarre-seccion__encabezado">
              <div>
                <p className="akelarre-seccion__kicker">DETRÁS DEL ÁLBUM</p>
                <h2 id="akelarre-creditos">Créditos</h2>
              </div>
            </div>

            <dl className="akelarre-creditos">
              {creditos.map((credito) => (
                <div key={`${credito.rol}-${credito.nombre}`}>
                  <dt>{credito.rol}</dt>
                  <dd>{credito.nombre}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {(anterior || siguiente) && (
          <nav className="akelarre-vecinos" aria-label="Otros álbumes">
            {anterior ? (
              <Link
                to={`/discografia/${anterior.id}`}
                className="akelarre-vecino"
              >
                <span className="akelarre-vecino__tipo">← ÁLBUM ANTERIOR</span>
                <strong>{anterior.titulo}</strong>
                <small className="akelarre-vecino__anio">{anterior.anio}</small>
              </Link>
            ) : (
              <span />
            )}

            {siguiente && (
              <Link
                to={`/discografia/${siguiente.id}`}
                className="akelarre-vecino akelarre-vecino--siguiente"
              >
                <span className="akelarre-vecino__tipo">SIGUIENTE ÁLBUM</span>
                <span className="akelarre-vecino__destino">
                  {siguiente.titulo === 'La Niña' ? (
                    <img
                      className="akelarre-vecino__logo"
                      src="/titulos/La%20Ni%C3%B1a-transparente.png"
                      alt="La Niña"
                    />
                  ) : (
                    <strong>{siguiente.titulo}</strong>
                  )}
                  <span className="akelarre-vecino__flecha" aria-hidden="true">⟶</span>
                </span>
                <small className="akelarre-vecino__anio">{siguiente.anio}</small>
              </Link>
            )}
          </nav>
        )}
      </div>
      {transicionEntrada && (
        <div
          className="nina-transicion-era nina-transicion-era--entrada"
          style={{ '--era-transicion': transicionEntrada }}
          aria-hidden="true"
        />
      )}
    </main>
  )
}

export default Album1
