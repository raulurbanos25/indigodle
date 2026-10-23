
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

import './album-2.css'

const FOTOS_COLABORACIONES = {
  belinda: 'Belinda.png',
  beret: 'Beret.png',
  cauty: 'Cauty.png',
  'don patricio': 'Don Patricio.png',
  guaynaa: 'Guaynaa.png',
  khea: 'KHEA.png',
  'lalo ebratt': 'Lalo Ebratt.png',
  lyanno: 'Lyanno.png',
  'mala rodriguez': 'Mala Rodriguez.png',
  'rauw alejandro': 'Rauw Alejandro.png',
  'roy borland': 'Roy Borland.png',
  tini: 'TINI.png',
}

function fotoColaboracion(nombre) {
  const clave = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
  const archivo = FOTOS_COLABORACIONES[clave]
  return archivo ? `/colaboraciones/${encodeURIComponent(archivo)}` : null
}

function agruparColaboraciones(pistas) {
  const grupos = new Map()

  for (const cancion of pistas) {
    const artistas = (cancion.colaboradores ?? [])
      .map((nombre) => nombre.trim())
      .filter(Boolean)
    if (artistas.length === 0) continue

    const clave = artistas
      .map((nombre) => nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es'))
      .sort()
      .join('|')

    if (!grupos.has(clave)) grupos.set(clave, { artistas, canciones: [] })
    grupos.get(clave).canciones.push(cancion)
  }

  return [...grupos.values()]
}

function CancionLaNina({ cancion, indice }) {
  return (
    <li className="nina-pista">
      <div className="nina-pista__fila">
        <span className="nina-pista__numero">
          {String(indice + 1).padStart(2, '0')}
        </span>
        <div className="nina-pista__contenido">
          <span className="nina-pista__titulo">{cancion.titulo}</span>

          {cancion.colaboradores?.length > 0 && (
            <p className="nina-pista__colaboradores">
              con {cancion.colaboradores.join(', ')}
            </p>
          )}
        </div>

        <time className="nina-pista__duracion">
          {formatearDuracion(cancion.duracionSeg)}
        </time>
      </div>
    </li>
  )
}

function Album2({ album }) {
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
      className="nina-page"
      style={{ '--nina-tono': tono }}
    >
      <div className="nina-page__contenido">
        <div className="nina-era-fondo">
          <div className="nina-era-fondo__capa" aria-hidden="true">
            <div className="nina-era-fondo__carrusel">
              <img className="nina-era-fondo__foto nina-era-fondo__foto--uno" src="/fondo/fondo2.jpg" alt="" />
              <img className="nina-era-fondo__foto nina-era-fondo__foto--dos" src="/fondo/fondo2.jpg" alt="" />
              <img className="nina-era-fondo__foto nina-era-fondo__foto--tres" src="/fondo/fondo2.jpg" alt="" />
              <img className="nina-era-fondo__foto nina-era-fondo__foto--cuatro" src="/fondo/fondo2.jpg" alt="" />
              <img className="nina-era-fondo__foto nina-era-fondo__foto--uno" src="/fondo/fondo2.jpg" alt="" />
              <img className="nina-era-fondo__foto nina-era-fondo__foto--dos" src="/fondo/fondo2.jpg" alt="" />
              <img className="nina-era-fondo__foto nina-era-fondo__foto--tres" src="/fondo/fondo2.jpg" alt="" />
              <img className="nina-era-fondo__foto nina-era-fondo__foto--cuatro" src="/fondo/fondo2.jpg" alt="" />
            </div>
          </div>
        <div className="nina-intro">
          <div className="nina-page__fondo" aria-hidden="true">
            <div className="nina-page__carrusel">
              <img className="nina-page__foto nina-page__foto--ancha" src="/fondo/fondo1.png" alt="" />
              <img className="nina-page__foto nina-page__foto--ancha" src="/fondo/fondo3.png" alt="" />
              <img className="nina-page__foto nina-page__foto--ancha" src="/fondo/fondo1.png" alt="" />
              <img className="nina-page__foto nina-page__foto--ancha" src="/fondo/fondo3.png" alt="" />
            </div>
            <span className="nina-page__burbuja nina-page__burbuja--uno" />
            <span className="nina-page__burbuja nina-page__burbuja--dos" />
            <span className="nina-page__burbuja nina-page__burbuja--tres" />
          </div>

        <nav className="nina-migas" aria-label="Ruta de navegación">
          <Link to="/discografia">Discografía</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{album.titulo}</span>
        </nav>

        <header className="nina-hero">
          <div className={`nina-cd ${cdAbierto ? 'nina-cd--abierto' : ''}`}>
            <div className="nina-cd__escenario">
              <span className="nina-cd__aro nina-cd__aro--uno" />
              <span className="nina-cd__aro nina-cd__aro--dos" />

              <div className="nina-cd__disco" aria-hidden="true">
                <div
                  className={`nina-cd__giro ${
                    disco.cargada ? 'nina-cd__giro--imagen' : ''
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
                <span className="nina-cd__centro" />
              </div>

              <button
                type="button"
                className="nina-cd__portada"
                aria-label={cdAbierto ? 'Guardar el CD' : 'Sacar el CD'}
                aria-pressed={cdAbierto}
                onClick={() => setCdAbierto((actual) => !actual)}
              >
                {portada.src ? (
                  <img
                    key={deluxeActiva ? 'nina-deluxe' : 'nina-original'}
                    className="nina-cd__imagen-portada"
                    src={deluxeActiva ? '/covers/La%20Ni%C3%B1a1.webp' : portada.src}
                    alt={`Portada ${deluxeActiva ? 'deluxe' : 'original'} del álbum ${album.titulo}`}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={deluxeActiva ? undefined : portada.alFallar}
                  />
                ) : (
                  <span className="nina-cd__sin-portada">
                    {album.titulo}
                  </span>
                )}
                <span className="nina-cd__reflejo" aria-hidden="true" />
              </button>

            <button
              type="button"
              className="nina-cd__deluxe-toggle"
              aria-pressed={deluxeActiva}
              onClick={() => setDeluxeActiva((actual) => !actual)}
            >
              {deluxeActiva ? 'VOLVER A LA ORIGINAL' : 'VER PORTADA DEL DELUXE'}
            </button>
            </div>

          </div>

          <div className="nina-hero__info">
            <h1>
              {album.titulo === 'La Niña' ? (
                <img
                  className="nina-hero__titulo-imagen"
                  src="/titulos/La%20Ni%C3%B1a-transparente.png"
                  alt="La Niña"
                />
              ) : (
                album.titulo
              )}
            </h1>

            <dl className="nina-estadisticas">
              {datos.map(([etiqueta, valor], indice) => (
                <div
                  key={etiqueta}
                  className={`nina-estadistica nina-estadistica--${indice}`}
                >
                  <dt>{etiqueta}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>

            <div className="nina-acciones">
              <button
                type="button"
                className="nina-boton nina-boton--principal"
                onClick={copiarEnlace}
              >
                <span aria-hidden="true">♡</span> Compartir álbum
              </button>

              <Link
                to="/discografia"
                className="nina-boton nina-boton--secundario nina-boton--discografia"
              >
                ← Ver discografía
              </Link>

              {enlaces.map((enlace) => (
                <a
                  key={enlace.url}
                  href={enlace.url}
                  className="nina-boton nina-boton--secundario"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {enlace.texto} ↗
                </a>
              ))}
            </div>

            <p className="nina-mensaje" role="status">
              {mensaje}
            </p>
          </div>
        </header>

        </div>

        <div className="nina-disco-layout">
        <section className="nina-seccion nina-seccion--tracklist" aria-labelledby="nina-canciones">
          <div className="nina-seccion__encabezado">
            <div>
              <h2 id="nina-canciones">TRACKLIST</h2>
            </div>

            <span className="nina-seccion__contador">
              {String(pistas.length).padStart(2, '0')} TEMAS
            </span>
          </div>

          {pistas.length > 0 ? (
            <ol className="nina-lista">
              {pistas.map((cancion, indice) => (
                <CancionLaNina
                  key={cancion.id}
                  cancion={cancion}
                  indice={indice}
                />
              ))}
            </ol>
          ) : (
            <p className="nina-vacio">
              Todavía no hay canciones de este álbum en el catálogo.
            </p>
          )}

        </section>

        {colaboraciones.length > 0 && (
          <section
            className="nina-seccion nina-seccion--colaboraciones"
            aria-labelledby="nina-invitados"
          >
            <div className="nina-seccion__encabezado">
              <div>
                <h2 id="nina-invitados">COLABORACIONES</h2>
              </div>
            </div>

            <ul className="nina-invitados">
              {colaboraciones.map((colaboracion, indice) => (
                <li
                  key={colaboracion.artistas.join('|')}
                  className="nina-invitado"
                  style={{ '--nina-indice': indice }}
                >
                  <div className={`nina-invitado__artistas ${colaboracion.artistas.length > 1 ? 'nina-invitado__artistas--varios' : ''}`}>
                    {colaboracion.artistas.map((artista) => (
                      fotoColaboracion(artista) ? (
                        <img
                          key={artista}
                          className="nina-invitado__foto"
                          src={fotoColaboracion(artista)}
                          alt={`Foto de ${artista}`}
                          loading="eager" decoding="async"
                        />
                      ) : (
                        <span key={artista} className="nina-invitado__foto nina-invitado__foto--iniciales" aria-label={artista}>
                          {artista.slice(0, 1)}
                        </span>
                      )
                    ))}
                  </div>
                  <h3>{colaboracion.artistas.join(' + ')}</h3>
                  <p className="nina-invitado__cantidad">
                    {colaboracion.canciones.length}{' '}
                    {colaboracion.canciones.length === 1
                      ? 'canción'
                      : 'canciones'}
                  </p>
                  <p className="nina-invitado__temas">
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
            className="nina-seccion"
            aria-labelledby="nina-creditos"
          >
            <div className="nina-seccion__encabezado">
              <div>
                <p className="nina-seccion__kicker">EL EQUIPO CREATIVO</p>
                <h2 id="nina-creditos">Créditos</h2>
              </div>
            </div>

            <dl className="nina-creditos">
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
          <nav className="nina-vecinos" aria-label="Otros álbumes">
            {anterior ? (
              <Link
                to={`/discografia/${anterior.id}`}
                className="nina-vecino"
              >
                <span className="nina-vecino__tipo">← ÁLBUM ANTERIOR</span>
                <span className="nina-vecino__destino">
                  <span className="nina-vecino__flecha" aria-hidden="true">⟵</span>
                  {anterior.id === 'album-1' ? (
                    <img className="nina-vecino__logo" src="/titulos/Akelarre-transparente.png" alt="Aquelarre" />
                  ) : (
                    <strong>{anterior.titulo}</strong>
                  )}
                </span>
                <small className="nina-vecino__anio">{anterior.anio}</small>
              </Link>
            ) : (
              <span />
            )}

            {siguiente && (
              <Link
                to={`/discografia/${siguiente.id}`}
                className="nina-vecino nina-vecino--siguiente"
              >
                <span className="nina-vecino__tipo">SIGUIENTE ÁLBUM</span>
                <span className="nina-vecino__destino">
                  {siguiente.id === 'album-3' ? (
                    <img className="nina-vecino__logo" src="/titulos/El%20Dragon-transparente.png" alt="El Dragón" />
                  ) : (
                    <strong>{siguiente.titulo}</strong>
                  )}
                  <span className="nina-vecino__flecha" aria-hidden="true">⟶</span>
                </span>
                <small className="nina-vecino__anio">{siguiente.anio}</small>
              </Link>
            )}
          </nav>
        )}
        </div>
      </div>

    </main>
  )
}

export default Album2

