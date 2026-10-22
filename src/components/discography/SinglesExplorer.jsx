import { useId, useState } from 'react'
import { formatearDuracion } from '../../models/Cancion.js'
import { ORDENES, FILTROS_TIPO, esRemix } from '../../models/Single.js'
import { normalizarTexto } from '../../services/texto.js'
import CdEstuche from './CdEstuche.jsx'
import LineaAnios from './LineaAnios.jsx'
import './SinglesExplorer.css'

function ArtistaInvitado({ nombre, onBuscar }) {
  const nombreSinTildes = nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const fotos = [...new Set([
    `/colaboraciones/${encodeURIComponent(nombreSinTildes)}.png`,
    `/colaboraciones/${encodeURIComponent(nombre)}.png`,
  ])]
  const [indiceFoto, setIndiceFoto] = useState(0)
  const [sinFoto, setSinFoto] = useState(false)
  const iniciales = nombre.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase()

  return (
    <button type="button" className="single__artista" title={`Buscar singles con ${nombre}`} onClick={onBuscar}>
      <span className="single__avatar" aria-hidden="true">
        {!sinFoto && <img src={fotos[indiceFoto]} alt="" loading="lazy" onError={() => {
          if (indiceFoto < fotos.length - 1) setIndiceFoto(indiceFoto + 1)
          else setSinFoto(true)
        }} />}
        {sinFoto && <span>{iniciales}</span>}
      </span>
      <span className="single__artista-nombre">{nombre}</span>
    </button>
  )
}

function SinglesExplorer({ singles }) {
  const idBase = useId()
  const [rango, setRango] = useState(null) // null = todos los años, o { desde, hasta }
  const [busqueda, setBusqueda] = useState('')
  const [ordenId, setOrdenId] = useState('reciente')
  const [tipoId, setTipoId] = useState('todos')

  if (singles.length === 0) return null

  const orden = ORDENES.find((o) => o.id === ordenId) ?? ORDENES[0]
  const tipo = FILTROS_TIPO.find((t) => t.id === tipoId) ?? FILTROS_TIPO[0]
  const buscado = normalizarTexto(busqueda)

  // Años con singles, de menor a mayor, con cuántos hay en cada uno
  const anios = [...new Set(singles.map((s) => s.anio))]
    .sort((a, b) => a - b)
    .map((anio) => ({ anio, cantidad: singles.filter((s) => s.anio === anio).length }))

  const filtrados = singles.filter((s) => {
    const enRango = !rango || (s.anio >= rango.desde && s.anio <= rango.hasta)
    const coincideTexto =
      !buscado ||
      normalizarTexto(s.titulo).includes(buscado) ||
      s.colaboradores.some((c) => normalizarTexto(c).includes(buscado))
    return enRango && tipo.coincide(s) && coincideTexto
  })

  const ordenados = [...filtrados].sort(orden.comparar)

  // Con "más recientes" o "más antiguos" se agrupa por año; con el resto, una sola lista.
  // "inicio" sirve para que la animación escalonada continúe entre grupos.
  const grupos = []
  if (ordenados.length > 0) {
    if (orden.agrupaPorAnio) {
      let inicio = 0
      for (const anio of [...new Set(ordenados.map((s) => s.anio))]) {
        const canciones = ordenados.filter((s) => s.anio === anio)
        grupos.push({ anio, canciones, inicio })
        inicio += canciones.length
      }
    } else {
      grupos.push({ anio: null, canciones: ordenados, inicio: 0 })
    }
  }

  const hayFiltros = rango !== null || buscado !== '' || tipoId !== 'todos'
  const limpiar = () => {
    setRango(null)
    setBusqueda('')
    setTipoId('todos')
  }

  // Un año: lo elige. Un segundo año: forma el rango entre los dos.
  // Un tercero: empieza de nuevo. Pulsar otra vez el único año elegido: quita el filtro.
  const elegirAnio = (anio) => {
    setRango((actual) => {
      if (!actual || actual.desde !== actual.hasta) return { desde: anio, hasta: anio }
      if (anio === actual.desde) return null
      return { desde: Math.min(anio, actual.desde), hasta: Math.max(anio, actual.desde) }
    })
  }

  const claveLista = `${rango ? `${rango.desde}-${rango.hasta}` : 'todos'}|${buscado}|${ordenId}|${tipoId}`

  return (
    <section className="singles" aria-labelledby={`${idBase}-titulo`}>
      <header className="singles__cabecera">
        <p className="singles__kicker">Fuera de los álbumes</p>
        <h2 id={`${idBase}-titulo`}>SINGLES SUELTOS</h2>
        <p className="singles__intro">
          Cada single, en su estuche. Pasa el ratón para abrirlo y ver girar el CD. Filtra por
          año, tipo o artista invitado.
        </p>
      </header>

      <div className="singles__controles">
        <div className="singles__filtros-cabecera">
          <span aria-hidden="true" className="singles__filtro-icono">⌕</span>
          <div><strong>ENCUENTRA UN SINGLE</strong><small>Busca por título, artista, año o tipo</small></div>
        </div>
        <div className="singles__fila">
          <div className="campo campo--buscar">
            <label htmlFor={`${idBase}-buscar`} className="campo__label">
              Buscar
            </label>
            <input
              id={`${idBase}-buscar`}
              type="search"
              placeholder="Título o artista..."
              autoComplete="off"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor={`${idBase}-orden`} className="campo__label">
              Ordenar por
            </label>
            <select id={`${idBase}-orden`} value={ordenId} onChange={(e) => setOrdenId(e.target.value)}>
              {ORDENES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.texto}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="singles__tipo-filtros" role="group" aria-label="Filtrar por tipo de single">
          {FILTROS_TIPO.map((t) => (
            <button key={t.id} type="button" className={tipoId === t.id ? 'is-active' : ''}
              aria-pressed={tipoId === t.id} onClick={() => setTipoId(t.id)}>{t.texto}</button>
          ))}
        </div>

        <LineaAnios
          anios={anios}
          rango={rango}
          onElegir={elegirAnio}
          onLimpiar={() => setRango(null)}
        />
      </div>

      <div className="singles__estado">
        <p role="status">
          Mostrando {filtrados.length} de {singles.length}{' '}
          {singles.length === 1 ? 'single' : 'singles'}
        </p>
        {hayFiltros && (
          <button type="button" className="enlace" onClick={limpiar}>
            Quitar filtros
          </button>
        )}
      </div>

      {/* La "key" reinicia las animaciones de entrada cada vez que cambian los filtros */}
      <div key={claveLista} className="singles__lista">
        {grupos.length === 0 ? (
          <div className="singles__vacio">
            <p>No hay singles que coincidan con tu búsqueda.</p>
            <button type="button" className="btn btn--ghost btn--small" onClick={limpiar}>
              Quitar filtros
            </button>
          </div>
        ) : (
          grupos.map((grupo) => {
            const conAnio = grupo.anio !== null

            return (
              <section
                key={grupo.anio ?? 'todos'}
                className={`grupo ${conAnio ? '' : 'grupo--plano'}`}
                aria-labelledby={conAnio ? `${idBase}-anio-${grupo.anio}` : undefined}
                aria-label={conAnio ? undefined : 'Singles'}
              >
                {conAnio && (
                  <h3 id={`${idBase}-anio-${grupo.anio}`} className="grupo__anio">
                    {grupo.anio}
                    <span className="grupo__n">
                      {grupo.canciones.length}{' '}
                      {grupo.canciones.length === 1 ? 'single' : 'singles'}
                    </span>
                  </h3>
                )}

                <ul className="grupo__lista">
                  {grupo.canciones.map((cancion, i) => (
                    <li key={cancion.id} className="single" style={{ '--i': grupo.inicio + i }}>
                      <CdEstuche cancion={cancion} />

                      <div className="single__texto">
                        <p className="single__titulo">
                          {cancion.titulo}
                          {esRemix(cancion) && <span className="single__remix">Remix</span>}
                        </p>

                        <p className="single__meta">
                          <span><small>AÑO</small>{cancion.anio}</span>
                          <span><small>DURACIÓN</small>{formatearDuracion(cancion.duracionSeg)}</span>
                        </p>

                        {cancion.colaboradores.length > 0 && (
                          <div className="single__colabs">
                            <ul className="single__invitados" aria-label="Artistas invitados">
                              {cancion.colaboradores.map((nombre) => (
                                <li key={nombre}>
                                  <ArtistaInvitado nombre={nombre} onBuscar={() => setBusqueda(nombre)} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })
        )}
      </div>
    </section>
  )
}

export default SinglesExplorer
