
import { useEffect, useRef, useState } from 'react'
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
import './album-5.css'

const FOTOS_COLABORACIONES = {
  dellafuente: 'DELLAFUENTE.png',
  'pepe y vizio': 'Pepe y Vizio.png',
  maka: 'Maka.png',
  'la zowi': 'La Zowi.png',
  saiko: 'SAIKO.png',
  'la plazuela': 'La Plazuela.png',
  mimi: 'Mimi.png',
}

const TITULOS_ALBUM = {
  'album-1': '/titulos/Akelarre-transparente.png',
  'album-2': '/titulos/La%20Ni%C3%B1a-transparente.png',
  'album-3': '/titulos/El%20Dragon-transparente.png',
  'album-4': '/titulos/Nave%20Dragon-transparente.png',
  'album-5': '/titulos/GRX-transparente.png',
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

function PistaGRX({ cancion, indice }) {
  return (
    <li className="grx-pista" style={{ '--grx-indice': indice }}>
      <div className="grx-pista__fila">
        <span className="grx-pista__numero">{String(indice + 1).padStart(2, '0')}</span>
        <div className="grx-pista__contenido">
          <div className="grx-pista__titulo">{cancion.titulo}</div>
          {cancion.colaboradores?.length > 0 && <p className="grx-pista__colaboradores">con {cancion.colaboradores.join(', ')}</p>}
        </div>
        <time className="grx-pista__duracion">{formatearDuracion(cancion.duracionSeg)}</time>
      </div>
    </li>
  )
}

function Album5({ album }) {
  const pistas = pistasDeAlbum(album.id)
  const invitados = invitadosConPistas(pistas)
  const colaboraciones = agruparColaboraciones(pistas)
  const { anterior, siguiente } = vecinosDeAlbum(album.id)
  const portada = usePortada(album)
  const disco = useDisco(album)
  const [abierto, setAbierto] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const videoFondo = useRef(null)
  const tono = Number.isFinite(album.tono) ? album.tono : tonoDe(album.id)
  const enlaces = (album.enlaces ?? []).filter((e) => e && typeof e.texto === 'string' && esUrlSegura(e.url))
  const datos = [
    ['Año', album.anio],
    ['Canciones', pistas.length],
    ['Duración', pistas.length ? formatearDuracionTotal(duracionTotal(pistas)) : '—'],
    ['Invitados', invitados.length],
  ]

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    if (videoFondo.current) videoFondo.current.playbackRate = 0.82
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
    <main className="grx-page" style={{ '--grx-tono': tono }}>
      <div className="grx-fondo" aria-hidden="true">
        <span className="grx-fondo__luz grx-fondo__luz--uno" />
        <span className="grx-fondo__luz grx-fondo__luz--dos" />
        <span className="grx-fondo__textura" />
        <span className="grx-fondo__velo-general" />
      </div>

      <section className="grx-era-superior" aria-label={`Cabecera del álbum ${album.titulo}`}>
        <div className="grx-era-superior__capa" aria-hidden="true">
          <video ref={videoFondo} className="grx-era-superior__video" autoPlay muted loop playsInline preload="auto">
            <source src="/fondo/fondo8.mp4" type="video/mp4" />
          </video>
          <span className="grx-era-superior__velo" />
        </div>
        <div className="grx-contenido">
        <nav className="grx-migas" aria-label="Ruta de navegación">
          <Link to="/discografia">Discografía</Link><span>/</span><span aria-current="page">{album.titulo}</span>
        </nav>

        <header className="grx-hero">
          <div className={`grx-cd ${abierto ? 'grx-cd--abierto' : ''}`}>
            <div className="grx-cd__escenario">
              <span className="grx-cd__aro grx-cd__aro--uno" />
              <span className="grx-cd__aro grx-cd__aro--dos" />
              <div className="grx-cd__disco" aria-hidden="true">
                <div className={`grx-cd__giro ${disco.cargada ? 'grx-cd__giro--imagen' : ''}`}>
                  {disco.src && <img src={disco.src} loading="eager" decoding="async" alt="" onLoad={disco.alCargar} onError={disco.alFallar} />}
                </div>
                <span className="grx-cd__centro" />
              </div>
              <button type="button" className="grx-cd__portada" aria-pressed={abierto}
                aria-label={abierto ? 'Guardar el CD' : 'Sacar el CD'} onClick={() => setAbierto((v) => !v)}>
                {portada.src ? <img src={portada.src} loading="eager" decoding="async" fetchPriority="high" alt={`Portada de ${album.titulo}`} onError={portada.alFallar} /> : <span>{album.titulo}</span>}
              </button>
            </div>
          </div>

          <div className="grx-info">
            <h1><img className="grx-info__titulo-imagen" src="/titulos/GRX-transparente.png" alt={album.titulo} /></h1>
            <dl className="grx-datos">
              {datos.map(([etiqueta, valor]) => <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor}</dd></div>)}
            </dl>
            <div className="grx-acciones">
              <button type="button" onClick={copiarEnlace}>↗ COMPARTIR ÁLBUM</button>
              <Link to="/discografia">← VER DISCOGRAFÍA</Link>
              {enlaces.map((e) => <a key={e.url} href={e.url} target="_blank" rel="noopener noreferrer">{e.texto} ↗</a>)}
            </div>
            <p className="grx-mensaje" role="status">{mensaje}</p>
          </div>
        </header>
        </div>
      </section>

      <div className="grx-era-inferior">
        <div className="grx-era-inferior__capa" aria-hidden="true">
          <video className="grx-era-inferior__video" autoPlay muted loop playsInline preload="auto">
            <source src="/fondo/fondo9.mp4" type="video/mp4" />
          </video>
          <span className="grx-era-inferior__velo" />
        </div>
      <div className="grx-contenido">
        <div className="grx-disco-layout">
        <section className="grx-seccion grx-seccion--tracklist" aria-labelledby="grx-canciones">
          <div className="grx-seccion__titulo"><div><h2 id="grx-canciones">TRACKLIST</h2></div><span>{String(pistas.length).padStart(2, '0')} TEMAS</span></div>
          {pistas.length ? (
            <ol className="grx-lista">
              {pistas.map((c, i) => <PistaGRX key={c.id} cancion={c} indice={i} />)}
            </ol>
          ) : <p className="grx-vacio">Todavía no hay canciones de este álbum en el catálogo.</p>}
        </section>

        {colaboraciones.length > 0 && <section className="grx-seccion grx-seccion--colaboraciones" aria-labelledby="grx-invitados">
          <div className="grx-seccion__titulo"><div><h2 id="grx-invitados">COLABORACIONES</h2></div></div>
          <ul className="grx-invitados">
            {colaboraciones.map((colaboracion) => <li key={colaboracion.artistas.join('|')}>
              <div className={`grx-invitado__artistas ${colaboracion.artistas.length > 1 ? 'grx-invitado__artistas--varios' : ''}`}>
                {colaboracion.artistas.map((artista) => fotoColaboracion(artista)
                  ? <img key={artista} className="grx-invitado__foto" src={fotoColaboracion(artista)} alt={`Foto de ${artista}`} loading="eager" decoding="async" />
                  : <span key={artista} className="grx-invitado__foto grx-invitado__foto--iniciales" aria-label={artista}>{artista.slice(0, 1)}</span>)}
              </div>
              <h3>{colaboracion.artistas.join(' + ')}</h3>
              <p>{colaboracion.canciones.length} {colaboracion.canciones.length === 1 ? 'canción' : 'canciones'}</p>
              <small>{colaboracion.canciones.map((c) => c.titulo).join(' · ')}</small>
            </li>)}
          </ul>
        </section>}
        </div>

        {(anterior || siguiente) && <nav className="grx-vecinos" aria-label="Otros álbumes">
          {anterior ? <Link to={`/discografia/${anterior.id}`}><span>← ÁLBUM ANTERIOR</span><strong>{TITULOS_ALBUM[anterior.id] ? <img src={TITULOS_ALBUM[anterior.id]} alt={anterior.titulo} /> : anterior.titulo}</strong><small>{anterior.anio}</small></Link> : <span />}
          {siguiente && <Link to={`/discografia/${siguiente.id}`} className="grx-vecino--siguiente"><span>SIGUIENTE ÁLBUM →</span><strong>{TITULOS_ALBUM[siguiente.id] ? <img src={TITULOS_ALBUM[siguiente.id]} alt={siguiente.titulo} /> : siguiente.titulo}</strong><small>{siguiente.anio}</small></Link>}
        </nav>}
      </div>
      </div>
    </main>
  )
}

export default Album5
