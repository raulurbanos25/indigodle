import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  duracionTotal,
  formatearDuracionTotal,
  pistasDeAlbum,
  vecinosDeAlbum,
} from '../../models/Pistas.js'
import { formatearDuracion } from '../../models/Cancion.js'
import { tonoDe } from '../../services/color.js'
import { esUrlSegura } from '../../services/url.js'
import { usePortada, useDisco } from '../../hooks/usePortada.js'
import './album-5.css'
import './album-6.css'

const DISCOS_ALBUM = [25, 13, 15]
const TOTAL_PISTAS_PREVISTAS = DISCOS_ALBUM.reduce((total, cantidad) => total + cantidad, 0)

const TITULOS_VECINOS = {
  'album-1': '/titulos/Akelarre-transparente.png',
  'album-2': '/titulos/La%20Ni%C3%B1a-transparente.png',
  'album-3': '/titulos/El%20Dragon-transparente.png',
  'album-4': '/titulos/Nave%20Dragon-transparente.png',
  'album-5': '/titulos/GRX-transparente.png',
}

function imagenArtista(nombre) {
  const sinTildes = nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return `/colaboraciones/${encodeURIComponent(sinTildes)}.png`
}

function agruparColaboraciones(pistas) {
  const grupos = new Map()
  pistas.forEach((pista) => {
    const artistas = (pista.colaboradores ?? []).map((nombre) => nombre.trim()).filter(Boolean)
    if (!artistas.length) return
    const clave = artistas.map((nombre) => nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()).sort().join('|')
    if (!grupos.has(clave)) grupos.set(clave, { artistas, canciones: [] })
    grupos.get(clave).canciones.push(pista)
  })
  return [...grupos.values()]
}

function PistaAlbum6({ cancion, numeroGlobal, indice }) {
  return (
    <li className="grx-pista" style={{ '--grx-indice': indice }}>
      <div className="grx-pista__fila">
        <span className="grx-pista__numero">{String(numeroGlobal).padStart(2, '0')}</span>
        <div className="grx-pista__contenido">
          <div className="grx-pista__titulo">{cancion.titulo}</div>
          {cancion.colaboradores?.length > 0 && <p className="grx-pista__colaboradores">con {cancion.colaboradores.join(', ')}</p>}
        </div>
        <time className="grx-pista__duracion">{formatearDuracion(cancion.duracionSeg)}</time>
      </div>
    </li>
  )
}

function Album6({ album }) {
  const pistasBase = pistasDeAlbum(album.id)
  const numeroDisco = (pista) => {
    // Si el número de pista vuelve a 1 en un disco nuevo, indicar numeroDisco: 2 o 3.
    // Sin ese campo, se interpreta numeroPista como numeración global continua.
    const discoDeclarado = Number(pista.numeroDisco ?? pista.disco)
    if (Number.isInteger(discoDeclarado) && discoDeclarado >= 1 && discoDeclarado <= DISCOS_ALBUM.length) return discoDeclarado
    const numero = Number(pista.numeroPista) || 1
    if (numero <= DISCOS_ALBUM[0]) return 1
    if (numero <= DISCOS_ALBUM[0] + DISCOS_ALBUM[1]) return 2
    return 3
  }
  const pistas = [...pistasBase].sort((a, b) => numeroDisco(a) - numeroDisco(b) || (a.numeroPista ?? 999) - (b.numeroPista ?? 999))
  const discos = DISCOS_ALBUM.map((capacidad, indice) => {
    const numero = indice + 1
    const inicio = DISCOS_ALBUM.slice(0, indice).reduce((total, cantidad) => total + cantidad, 0)
    const canciones = pistas.filter((pista) => numeroDisco(pista) === numero)
    return { numero, capacidad, inicio, canciones }
  })
  const [discoSeleccionado, setDiscoSeleccionado] = useState(1)
  const discoActivo = discos.find((disco) => disco.numero === discoSeleccionado) ?? discos[0]
  const colaboraciones = agruparColaboraciones(discoActivo?.canciones ?? [])
  const artistas = [...new Set(pistas.flatMap((pista) => pista.colaboradores ?? []))]
  const { anterior, siguiente } = vecinosDeAlbum(album.id)
  const portada = usePortada(album)
  const disco = useDisco(album)
  const [abierto, setAbierto] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const tono = Number.isFinite(album.tono) ? album.tono : tonoDe(album.id)
  const enlaces = (album.enlaces ?? []).filter((enlace) => enlace && typeof enlace.texto === 'string' && esUrlSegura(enlace.url))
  const datos = [
    ['Año', album.anio],
    ['Canciones', TOTAL_PISTAS_PREVISTAS],
    ['Duración', pistas.length ? formatearDuracionTotal(duracionTotal(pistas)) : '—'],
    ['Invitados', artistas.length],
  ]

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [])

  async function copiarEnlace() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setMensaje('Enlace copiado.')
    } catch {
      setMensaje('No se ha podido copiar el enlace.')
    }
  }

  return (
    <main className="grx-page album6-page" style={{ '--grx-tono': tono }}>
      <div className="album6-video-fondo" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="auto">
          <source src="/fondo/fondo10.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="grx-fondo album6-fondo" aria-hidden="true"><span className="album6-fondo__luz" /><span className="grx-fondo__textura" /></div>
      <section className="grx-era-superior album6-era-superior">
        <div className="grx-contenido">
          <nav className="grx-migas" aria-label="Ruta de navegación">
            <Link to="/discografia">Discografía</Link><span>/</span><span aria-current="page">{album.titulo}</span>
          </nav>
          <header className="grx-hero album6-hero">
            <div className={`grx-cd album6-cd ${abierto ? 'grx-cd--abierto' : ''}`}>
              <div className="grx-cd__escenario">
                <span className="grx-cd__aro grx-cd__aro--uno" />
                <span className="grx-cd__aro grx-cd__aro--dos" />
                <div className="grx-cd__disco" aria-hidden="true">
                  <div className={`grx-cd__giro ${disco.cargada ? 'grx-cd__giro--imagen' : ''}`}>
                    {disco.src && <img src={disco.src} alt="" onLoad={disco.alCargar} onError={disco.alFallar} />}
                  </div><span className="grx-cd__centro" />
                </div>
                <button type="button" className="grx-cd__portada" aria-pressed={abierto}
                  aria-label={abierto ? 'Guardar el disco' : 'Sacar el disco'} onClick={() => setAbierto((actual) => !actual)}>
                  {portada.src ? <img src={portada.src} alt={`Portada de ${album.titulo}`} onError={portada.alFallar} /> : <span>{album.titulo}</span>}
                </button>
              </div>
            </div>
            <div className="grx-info album6-info">
  
              <h1>
                <img
                  className="album6-info__titulo-imagen"
                  src="/titulos/La%20Bruja,%20La%20Ni%C3%B1a%20y%20El%20Dragon-transparente.png"
                  alt={album.titulo}
                />
              </h1>
              <dl className="grx-datos">
                {datos.map(([etiqueta, valor]) => <div key={etiqueta}><dt>{etiqueta}</dt><dd>{valor}</dd></div>)}
              </dl>
              <div className="grx-acciones">
                <button type="button" onClick={copiarEnlace}>↗ COMPARTIR ÁLBUM</button>
                <Link to="/discografia">← VER DISCOGRAFÍA</Link>
                {enlaces.map((enlace) => <a key={enlace.url} href={enlace.url} target="_blank" rel="noopener noreferrer">{enlace.texto} ↗</a>)}
              </div>
              <p className="grx-mensaje" role="status">{mensaje}</p>
            </div>
          </header>
        </div>
      </section>

      <section className="grx-era-inferior album6-era-inferior">
        <div className="grx-contenido">
          <div className="grx-disco-layout">
            <nav className="album6-filtro-discos" aria-label="Elegir disco">
              {discos.map((disco) => (
                <button
                  key={disco.numero}
                  type="button"
                  className={disco.numero === discoSeleccionado ? 'is-active' : ''}
                  aria-pressed={disco.numero === discoSeleccionado}
                  onClick={() => setDiscoSeleccionado(disco.numero)}
                >
                  <span>DISCO {disco.numero}</span>
                  <small>{disco.canciones.length} / {disco.capacidad} canciones</small>
                </button>
              ))}
            </nav>
            <section className="grx-seccion grx-seccion--tracklist" aria-labelledby="album6-tracklist">
              <div className="grx-seccion__titulo"><div><h2 id="album6-tracklist">TRACKLIST · DISCO {discoActivo.numero}</h2></div><span>{String(discoActivo.canciones.length).padStart(2, '0')} / {discoActivo.capacidad} TEMAS</span></div>
              {discoActivo.canciones.length ? <ol key={`tracklist-${discoActivo.numero}`} className="grx-lista">
                {discoActivo.canciones.map((cancion, indice) => <PistaAlbum6 key={cancion.id} cancion={cancion}
                  numeroGlobal={discoActivo.inicio + indice + 1} indice={indice} />)}
              </ol> : <p className="album6-disco__vacio">Aún no hay canciones añadidas para este disco.</p>}
            </section>

            <section className="grx-seccion grx-seccion--colaboraciones" aria-labelledby="album6-colaboraciones">
              <div className="grx-seccion__titulo"><div><h2 id="album6-colaboraciones">COLABORACIONES · DISCO {discoActivo.numero}</h2></div></div>
              {colaboraciones.length ? <ul key={`colaboraciones-${discoActivo.numero}`} className="grx-invitados">
                {colaboraciones.map((colaboracion, indice) => <li key={colaboracion.artistas.join('|')} style={{ '--album6-indice': indice }}>
                  <div className={`grx-invitado__artistas ${colaboracion.artistas.length > 1 ? 'grx-invitado__artistas--varios' : ''}`}>
                    {colaboracion.artistas.map((artista) => <img key={artista} className="grx-invitado__foto" src={imagenArtista(artista)} alt={`Foto de ${artista}`} loading="lazy" onError={(evento) => { evento.currentTarget.hidden = true }} />)}
                  </div>
                  <h3>{colaboracion.artistas.join(' + ')}</h3>
                  <p>{colaboracion.canciones.length} {colaboracion.canciones.length === 1 ? 'canción' : 'canciones'}</p>
                  <small>{colaboracion.canciones.map((cancion) => cancion.titulo).join(' · ')}</small>
                </li>)}
              </ul> : <p className="grx-vacio">Este álbum no tiene colaboraciones.</p>}
            </section>
          </div>

          {(anterior || siguiente) && <nav className="grx-vecinos" aria-label="Otros álbumes">
            {anterior ? <Link to={`/discografia/${anterior.id}`}><span>← ÁLBUM ANTERIOR</span><strong>{TITULOS_VECINOS[anterior.id] ? <img src={TITULOS_VECINOS[anterior.id]} alt={anterior.titulo} /> : anterior.titulo}</strong><small>{anterior.anio}</small></Link> : <span />}
            {siguiente && <Link to={`/discografia/${siguiente.id}`} className="grx-vecino--siguiente"><span>SIGUIENTE ÁLBUM →</span><strong>{TITULOS_VECINOS[siguiente.id] ? <img src={TITULOS_VECINOS[siguiente.id]} alt={siguiente.titulo} /> : siguiente.titulo}</strong><small>{siguiente.anio}</small></Link>}
          </nav>}
        </div>
      </section>
    </main>
  )
}

export default Album6
