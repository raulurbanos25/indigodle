
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
import './album-3.css'
import './transicion-era.css'

const TITULOS_VECINOS = {
  'album-1': '/titulos/Akelarre-transparente.png',
  'album-2': '/titulos/La%20Ni%C3%B1a-transparente.png',
  'album-3': '/titulos/El%20Dragon-transparente.png',
  'album-4': '/titulos/Nave%20Dragon-transparente.png',
  'album-5': '/titulos/GRX-transparente.png',
}

const FOTOS_COLABORACIONES = {
  emilia: 'Emilia.png',
  'luis fonsi': 'Luis Fonsi.png',
  'maria becerra': 'Maria Becerra.png',
  quevedo: 'Quevedo.png',
  sael: 'Sael.png',
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

function PistaDragon({ cancion, indice }) {
  return (
    <li className="dragon-pista" style={{ '--dragon-indice': indice }}>
      <div className="dragon-pista__fila">
        <span className="dragon-pista__numero">{String(indice + 1).padStart(2, '0')}</span>
        <div className="dragon-pista__contenido">
          <div className="dragon-pista__titulo">{cancion.titulo}</div>
          {cancion.colaboradores?.length > 0 && (
            <p className="dragon-pista__colaboradores">con {cancion.colaboradores.join(', ')}</p>
          )}
        </div>
        <time className="dragon-pista__duracion">{formatearDuracion(cancion.duracionSeg)}</time>
      </div>
    </li>
  )
}

function Album3({ album }) {
  const transicionEntrada = useTransicionEraEntrada()
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
    <main className="dragon-page" style={{ '--dragon-tono': tono }}>
      <div className="dragon-fondo" aria-hidden="true">
        <video className="dragon-fondo__video" autoPlay muted loop playsInline preload="auto" poster="/fondo/fondo5-poster.jpg">
          <source src="/fondo/fondo5.mp4" type="video/mp4" />
        </video>
        <span className="dragon-fondo__velo" />
        <span className="dragon-fondo__llama dragon-fondo__llama--uno" />
        <span className="dragon-fondo__llama dragon-fondo__llama--dos" />
        <span className="dragon-fondo__brasas" />
      </div>

      <div className="dragon-contenido">
        <nav className="dragon-migas" aria-label="Ruta de navegación">
          <Link to="/discografia">Discografía</Link><span>/</span><span aria-current="page">{album.titulo}</span>
        </nav>

        <header className="dragon-hero">
          <div className={`dragon-cd ${abierto ? 'dragon-cd--abierto' : ''}`}>
            <div className="dragon-cd__escenario">
              <div className="dragon-cd__disco" aria-hidden="true">
                <div className={`dragon-cd__giro ${disco.cargada ? 'dragon-cd__giro--imagen' : ''}`}>
                  {disco.src && <img src={disco.src} loading="eager" decoding="async" alt="" onLoad={disco.alCargar} onError={disco.alFallar} />}
                </div>
                <span className="dragon-cd__centro" />
              </div>
              <button type="button" className="dragon-cd__portada" aria-pressed={abierto}
                aria-label={abierto ? 'Guardar el CD' : 'Sacar el CD'} onClick={() => setAbierto((v) => !v)}>
                {portada.src ? <img src={portada.src} loading="eager" decoding="async" fetchPriority="high" alt={`Portada de ${album.titulo}`} onError={portada.alFallar} /> : <span>{album.titulo}</span>}
              </button>
            </div>
          </div>

          <div className="dragon-info">
            <h1>
              <img
                className="dragon-info__titulo-imagen"
                src="/titulos/El%20Dragon-transparente.png"
                alt="El Dragón"
              />
            </h1>
            <dl className="dragon-datos">
              {datos.map(([etiqueta, valor]) => <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor}</dd></div>)}
            </dl>
            <div className="dragon-acciones">
              <button className="dragon-boton dragon-boton--principal" type="button" onClick={copiarEnlace}>↗ COMPARTIR ÁLBUM</button>
              <Link className="dragon-boton dragon-boton--discografia" to="/discografia">← VER DISCOGRAFÍA</Link>
              {enlaces.map((e) => <a key={e.url} href={e.url} target="_blank" rel="noopener noreferrer">{e.texto} ↗</a>)}
            </div>
            <p className="dragon-mensaje" role="status">{mensaje}</p>
          </div>
        </header>

        <div className="dragon-disco-layout">
        <section className="dragon-seccion dragon-seccion--tracklist" aria-labelledby="dragon-canciones">
          <div className="dragon-seccion__titulo"><div><h2 id="dragon-canciones">TRACKLIST</h2></div><span>{pistas.length} TEMAS</span></div>
          {pistas.length ? (
            <ol className="dragon-lista">
              {pistas.map((c, i) => <PistaDragon key={c.id} cancion={c} indice={i} />)}
            </ol>
          ) : <p className="dragon-vacio">Todavía no hay canciones de este álbum en el catálogo.</p>}
        </section>

        {colaboraciones.length > 0 && <section className="dragon-seccion dragon-seccion--colaboraciones" aria-labelledby="dragon-invitados">
          <div className="dragon-seccion__titulo"><div><h2 id="dragon-invitados">COLABORACIONES</h2></div></div>
          <ul className="dragon-invitados">
            {colaboraciones.map((colaboracion, indice) => <li className="dragon-invitado" key={colaboracion.artistas.join('|')} style={{ '--dragon-indice': indice }}>
              <div className={`dragon-invitado__artistas ${colaboracion.artistas.length > 1 ? 'dragon-invitado__artistas--varios' : ''}`}>
                {colaboracion.artistas.map((artista) => fotoColaboracion(artista) ? <img key={artista} className="dragon-invitado__foto" src={fotoColaboracion(artista)} alt={`Foto de ${artista}`} loading="eager" decoding="async" /> : <span key={artista} className="dragon-invitado__foto dragon-invitado__foto--iniciales" aria-label={artista}>{artista.slice(0, 1)}</span>)}
              </div>
              <h3>{colaboracion.artistas.join(' + ')}</h3>
              <p>{colaboracion.canciones.length} {colaboracion.canciones.length === 1 ? 'canción' : 'canciones'}</p>
              <small>{colaboracion.canciones.map((c) => c.titulo).join(' · ')}</small>
            </li>)}
          </ul>
        </section>}
        </div>

        {creditos.length > 0 && <section className="dragon-seccion" aria-labelledby="dragon-creditos">
          <div className="dragon-seccion__titulo"><div><p>DETRÁS DEL PROYECTO</p><h2 id="dragon-creditos">Créditos</h2></div></div>
          <dl className="dragon-creditos">{creditos.map((c) => <div key={`${c.rol}-${c.nombre}`}><dt>{c.rol}</dt><dd>{c.nombre}</dd></div>)}</dl>
        </section>}

        {(anterior || siguiente) && <nav className="dragon-vecinos" aria-label="Otros álbumes">
          {anterior ? <Link to={`/discografia/${anterior.id}`} className="dragon-vecino dragon-vecino--anterior">
            <span className="dragon-vecino__tipo">← ÁLBUM ANTERIOR</span>
            <span className="dragon-vecino__destino">
              <span className="dragon-vecino__flecha" aria-hidden="true">⟵</span>
              {TITULOS_VECINOS[anterior.id] ? <img className="dragon-vecino__logo" src={TITULOS_VECINOS[anterior.id]} alt={anterior.titulo} /> : <strong>{anterior.titulo}</strong>}
            </span>
            <small className="dragon-vecino__anio">{anterior.anio}</small>
          </Link> : <span />}
          {siguiente && <Link to={`/discografia/${siguiente.id}`} className="dragon-vecino dragon-vecino--siguiente"><span className="dragon-vecino__tipo">SIGUIENTE ÁLBUM</span><span className="dragon-vecino__destino">{TITULOS_VECINOS[siguiente.id] ? <img className="dragon-vecino__logo" src={TITULOS_VECINOS[siguiente.id]} alt={siguiente.titulo} /> : <strong>{siguiente.titulo}</strong>}<span className="dragon-vecino__flecha" aria-hidden="true">⟶</span></span><small className="dragon-vecino__anio">{siguiente.anio}</small></Link>}
        </nav>}
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

export default Album3


