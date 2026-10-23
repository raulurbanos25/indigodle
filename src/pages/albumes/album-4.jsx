
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
import './album-4.css'

const TITULOS_VECINOS = {
  'album-1': '/titulos/Akelarre-transparente.png',
  'album-2': '/titulos/La%20Ni%C3%B1a-transparente.png',
  'album-3': '/titulos/El%20Dragon-transparente.png',
  'album-4': '/titulos/Nave%20Dragon-transparente.png',
  'album-5': '/titulos/GRX-transparente.png',
  'album-6': '/titulos/La%20Bruja,%20La%20Ni%C3%B1a%20y%20El%20Dragon-transparente.png',
}

const FOTOS_COLABORACIONES = {
  'manuel turizo': 'Manuel Turizo.png',
  'kidd voodoo': 'Kidd Voodoo.png',
  'paulo londra': 'Paulo Londra.png',
  'maria becerra': 'Maria Becerra.png',
  'villano antillano': 'Villano Antillano.png',
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

function PistaNave({ cancion, indice }) {
  return (
    <li className="nave-pista" style={{ '--nave-indice': indice }}>
      <div className="nave-pista__fila">
        <span className="nave-pista__numero">{String(indice + 1).padStart(2, '0')}</span>
        <div className="nave-pista__contenido">
          <div className="nave-pista__titulo">{cancion.titulo}</div>
          {cancion.colaboradores?.length > 0 && <p className="nave-pista__colaboradores">con {cancion.colaboradores.join(', ')}</p>}
        </div>
        <time className="nave-pista__duracion">{formatearDuracion(cancion.duracionSeg)}</time>
      </div>
    </li>
  )
}

function Album4({ album }) {
  const pistas = pistasDeAlbum(album.id)
  const invitados = invitadosConPistas(pistas)
  const colaboraciones = agruparColaboraciones(pistas)
  const { anterior, siguiente } = vecinosDeAlbum(album.id)
  const portada = usePortada(album)
  const disco = useDisco(album)
  const [abierto, setAbierto] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const tono = Number.isFinite(album.tono) ? album.tono : tonoDe(album.id)
  const enlaces = (album.enlaces ?? []).filter((e) => e && typeof e.texto === 'string' && esUrlSegura(e.url))
  const creditos = (album.creditos ?? []).filter((c) => c?.rol && c?.nombre)
  const datos = [
    ['Año', album.anio],
    ['Canciones', pistas.length],
    ['Duración', pistas.length ? formatearDuracionTotal(duracionTotal(pistas)) : '—'],
    ['Artistas', invitados.length],
  ]

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  async function copiarEnlace() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setMensaje('Enlace copiado.')
    } catch {
      setMensaje('No se ha podido copiar el enlace.')
    }
  }

  return (
    <main className="nave-page" style={{ '--nave-tono': tono }}>
      <div className="nave-fondo" aria-hidden="true">
        <span className="nave-fondo__nebulosa nave-fondo__nebulosa--uno" />
        <span className="nave-fondo__nebulosa nave-fondo__nebulosa--dos" />
        <span className="nave-fondo__estrellas" />
        <span className="nave-fondo__orbita" />
      </div>

      <div className="nave-contenido">
        <div className="nave-era-superior">
          <video className="nave-era-superior__video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
            <source src="/fondo/fondo6.mp4" type="video/mp4" />
          </video>
          <span className="nave-era-superior__velo" aria-hidden="true" />
        <nav className="nave-migas" aria-label="Ruta de navegación">
          <Link to="/discografia">Discografía</Link><span>/</span><span aria-current="page">{album.titulo}</span>
        </nav>

        <header className="nave-hero">
          <div className={`nave-cd ${abierto ? 'nave-cd--abierto' : ''}`}>
            <div className="nave-cd__escenario">
              <span className="nave-cd__anillo nave-cd__anillo--uno" />
              <span className="nave-cd__anillo nave-cd__anillo--dos" />
              <div className="nave-cd__disco" aria-hidden="true">
                <div className={`nave-cd__giro ${disco.cargada ? 'nave-cd__giro--imagen' : ''}`}>
                  {disco.src && <img src={disco.src} loading="eager" decoding="async" alt="" onLoad={disco.alCargar} onError={disco.alFallar} />}
                </div>
                <span className="nave-cd__centro" />
              </div>
              <button type="button" className="nave-cd__portada" aria-pressed={abierto}
                aria-label={abierto ? 'Guardar el CD' : 'Sacar el CD'} onClick={() => setAbierto((v) => !v)}>
                {portada.src ? <img src={portada.src} loading="eager" decoding="async" fetchPriority="high" alt={`Portada de ${album.titulo}`} onError={portada.alFallar} /> : <span>{album.titulo}</span>}
              </button>
            </div>
          </div>

          <div className="nave-info">
            <h1>
              <img
                className="nave-info__titulo-imagen"
                src="/titulos/Nave%20Dragon-transparente.png"
                alt={album.titulo}
              />
            </h1>
            <dl className="nave-datos">
              {datos.map(([etiqueta, valor]) => <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor}</dd></div>)}
            </dl>
            <div className="nave-acciones">
              <button type="button" onClick={copiarEnlace}>↗ COMPARTIR ÁLBUM</button>
              <Link to="/discografia">← VER DISCOGRAFÍA</Link>
              {enlaces.map((e) => <a key={e.url} href={e.url} target="_blank" rel="noopener noreferrer">{e.texto} ↗</a>)}
            </div>
            <p className="nave-mensaje" role="status">{mensaje}</p>
          </div>
        </header>
        </div>

        <div className="nave-era-inferior">
          <div className="nave-era-inferior__capa" aria-hidden="true">
            <video className="nave-era-inferior__video" autoPlay muted loop playsInline preload="auto">
              <source src="/fondo/fondo7.mp4" type="video/mp4" />
            </video>
            <span className="nave-era-inferior__velo" />
          </div>
        <div className="nave-disco-layout">
        <section className="nave-seccion nave-seccion--tracklist" aria-labelledby="nave-canciones">
          <div className="nave-seccion__titulo"><div><h2 id="nave-canciones">TRACKLIST</h2></div><span>{String(pistas.length).padStart(2, '0')} TEMAS</span></div>
          {pistas.length ? (
            <ol className="nave-lista">
              {pistas.map((c, i) => <PistaNave key={c.id} cancion={c} indice={i} />)}
            </ol>
          ) : <p className="nave-vacio">Todavía no hay canciones de este álbum en el catálogo.</p>}
        </section>

        {colaboraciones.length > 0 && <section className="nave-seccion nave-seccion--colaboraciones" aria-labelledby="nave-invitados">
          <div className="nave-seccion__titulo"><div><h2 id="nave-invitados">COLABORACIONES</h2></div></div>
          <ul className="nave-invitados">
            {colaboraciones.map((colaboracion) => <li key={colaboracion.artistas.join('|')}>
              <div className={`nave-invitado__artistas ${colaboracion.artistas.length > 1 ? 'nave-invitado__artistas--varios' : ''}`}>
                {colaboracion.artistas.map((artista) => fotoColaboracion(artista)
                  ? <img key={artista} className="nave-invitado__foto" src={fotoColaboracion(artista)} alt={`Foto de ${artista}`} loading="eager" decoding="async" />
                  : <span key={artista} className="nave-invitado__foto nave-invitado__foto--iniciales" aria-label={artista}>{artista.slice(0, 1)}</span>)}
              </div>
              <h3>{colaboracion.artistas.join(' + ')}</h3>
              <p>{colaboracion.canciones.length} {colaboracion.canciones.length === 1 ? 'canción' : 'canciones'}</p>
              <small>{colaboracion.canciones.map((c) => c.titulo).join(' · ')}</small>
            </li>)}
          </ul>
        </section>}
        </div>

        {creditos.length > 0 && <section className="nave-seccion" aria-labelledby="nave-creditos">
          <div className="nave-seccion__titulo"><div><p>REGISTRO DE PRODUCCIÓN</p><h2 id="nave-creditos">Créditos</h2></div></div>
          <dl className="nave-creditos">{creditos.map((c) => <div key={`${c.rol}-${c.nombre}`}><dt>{c.rol}</dt><dd>{c.nombre}</dd></div>)}</dl>
        </section>}

        {(anterior || siguiente) && <nav className="nave-vecinos" aria-label="Otros álbumes">
          {anterior ? <Link to={`/discografia/${anterior.id}`}><span>← Álbum anterior</span><strong>{TITULOS_VECINOS[anterior.id] ? <img src={TITULOS_VECINOS[anterior.id]} alt={anterior.titulo} /> : anterior.titulo}</strong><small>{anterior.anio}</small></Link> : <span />}
          {siguiente && <Link to={`/discografia/${siguiente.id}`} className="nave-vecino--siguiente"><span>Siguiente álbum →</span><strong>{TITULOS_VECINOS[siguiente.id] ? <img className={siguiente.id === 'album-6' ? 'nave-vecino__logo--album6' : undefined} src={TITULOS_VECINOS[siguiente.id]} alt={siguiente.titulo} /> : siguiente.titulo}</strong><small>{siguiente.anio}</small></Link>}
        </nav>}
        </div>
      </div>
    </main>
  )
}

export default Album4


