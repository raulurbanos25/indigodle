import { useState } from 'react'
import { Link } from 'react-router-dom'
import { numeroDeReto } from '../services/dailyChallenge.js'
import { useRanking } from '../hooks/useRanking.js'
import ResultPanel from '../components/game/ResultPanel.jsx'
import './JuegoRanking.css'

const formatoNumero = new Intl.NumberFormat('es-ES')

function crearFilas(cantidad) {
  if (cantidad === 10) {
    return [[0], [1, 2], [3, 4, 5], [6, 7, 8, 9]]
  }
  const filas = []
  let puesto = 0
  let ancho = 1
  while (puesto < cantidad) {
    const longitud = Math.min(ancho, cantidad - puesto)
    filas.push(Array.from({ length: longitud }, (_, i) => puesto + i))
    puesto += longitud
    ancho += 1
  }
  return filas
}

function JuegoOrdenStreams({ modo, cantidad, titulo }) {
  const { orden, pool, cartas, placed, locked, fallos, estado, maxFallos, colocar, quitar, comprobar, reiniciarDev } = useRanking({ modo, cantidad })
  const [seleccionada, setSeleccionada] = useState(null)
  const [aviso, setAviso] = useState('')
  const [devolviendo, setDevolviendo] = useState(false)
  const terminado = estado !== 'jugando'
  const gano = estado === 'ganada'
  const filas = crearFilas(cantidad)
  const usadas = new Set(Object.values(placed))

  if (orden.length < cantidad) {
    return <section className="page container ranking"><h1>{titulo}</h1><p>Faltan canciones con datos de reproducciones en <code>src/data/rankingMasEscuchadas.js</code>.</p><Link to="/jugar">Volver a los modos de juego</Link></section>
  }

  const asignar = (indice, songId) => {
    if (terminado || locked.includes(indice)) return
    colocar(indice, songId)
    setSeleccionada(null)
    setAviso('')
  }
  const tocarPuesto = (indice, cancion, correcta) => {
    if (seleccionada) asignar(indice, seleccionada)
    else if (cancion && !correcta) quitar(indice)
  }
  const verificar = () => {
    const resultado = comprobar()
    setAviso(resultado.incompleto ? 'Coloca una canción en cada puesto antes de comprobar.' : '')
    setSeleccionada(null)
  }
  const devolverCancion = (songId) => {
    const puestoActual = Object.entries(placed).find(([, id]) => id === songId)
    if (!puestoActual) return
    quitar(Number(puestoActual[0]))
    setSeleccionada(null)
    setAviso('Canción devuelta a disponibles.')
  }
  const soltarEnDisponibles = (evento) => {
    evento.preventDefault()
    const songId = evento.dataTransfer.getData('text/song-id')
    if (songId) devolverCancion(songId)
    setDevolviendo(false)
  }

  return (
    <section className={`page container ranking ranking--${modo}`}>
      <header className="ranking__cabecera">
        <p className="ranking__etiqueta">{titulo} · Reto nº {numeroDeReto()}</p>
        <h1>{modo === 'top10' ? '¿En qué orden van estas 10 canciones?' : 'Ordena las más escuchadas'}</h1>
      </header>

      <div className="ranking__estado" aria-live="polite">
        <span><strong>{locked.length}</strong> / {cantidad} puestos confirmados</span>
        <span className="ranking__fallos">Comprobaciones: <strong>{fallos}</strong> / {maxFallos}</span>
        <button type="button" className="btn btn--ghost btn--small" onClick={reiniciarDev}>Reiniciar</button>
      </div>

      <div className="ranking__escenario">
        <div className="ranking__piramide" role="list" aria-label={`Pirámide de ranking con ${cantidad} puestos`}>
          {filas.map((fila, filaIndice) => (
            <div className={`ranking__fila ranking__fila--${fila.length}`} role="group" key={`fila-${filaIndice}`} style={{ width: `${fila.length * 25}%` }}>
              {fila.map((indice) => {
                const correcta = locked.includes(indice)
                const revelar = terminado && !gano
                const cancionId = placed[indice] ?? (revelar ? orden[indice]?.id : null)
                const cancion = pool.find((item) => item.id === cancionId)
                const destino = seleccionada && !terminado && !correcta
                return (
                  <div key={indice} className={`ranking__puesto ${correcta ? 'ranking__puesto--acierto' : ''} ${destino ? 'ranking__puesto--destino' : ''}`}
                    role="listitem" tabIndex={!terminado && !correcta ? 0 : undefined} draggable={!terminado && Boolean(cancion) && !correcta} aria-label={`Puesto ${indice + 1}${cancion ? `: ${cancion.titulo}` : ', vacío'}`}
                    onDragOver={(e) => { if (!terminado && !correcta) e.preventDefault() }}
                    onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData('text/song-id'); if (id) asignar(indice, id) }}
                    onDragStart={(e) => { if (cancion && !correcta) { e.dataTransfer.setData('text/song-id', cancion.id); e.dataTransfer.effectAllowed = 'move' } }}
                    onClick={() => tocarPuesto(indice, cancion, correcta)}
                    onKeyDown={(e) => { if (seleccionada && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); asignar(indice, seleccionada) } }}>
                    <span className="ranking__numero">{modo === 'top10' ? `#${indice + 1}` : String(indice + 1).padStart(2, '0')}</span>
                    {cancion ? <span className="ranking__nombre"><strong>{cancion.titulo}</strong>{(correcta || revelar) && <small>{formatoNumero.format(orden[indice].streams)} streams</small>}</span> : modo !== 'top10' && <span className="ranking__hueco">Suelta aquí</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {!terminado && (
        <p className="ranking__instruccion">
          Toca una canción y luego su puesto en la pirámide. También puedes arrastrarla. Toca un puesto ocupado para quitarla.{' '}
          <Link to="/como-se-juega">Cómo se juega</Link>
        </p>
      )}

      {terminado ? (
        <ResultPanel estado={estado} tituloGanada="¡Ranking perfecto!" tituloPerdida="Fin de la partida"><p>{gano ? `Has colocado las ${cantidad} canciones en el orden correcto.` : `Has confirmado ${locked.length} puestos. Aquí tienes el orden real.`}</p></ResultPanel>
      ) : (
        <section className={`ranking__opciones ${devolviendo ? 'ranking__opciones--destino' : ''}`} aria-labelledby="ranking-opciones-titulo"
          onDragOver={(evento) => { evento.preventDefault(); setDevolviendo(true) }}
          onDragLeave={(evento) => { if (!evento.currentTarget.contains(evento.relatedTarget)) setDevolviendo(false) }}
          onDrop={soltarEnDisponibles}>
          <div className="ranking__pool-heading"><div><p className="ranking__pool-kicker">Tu selección</p><h2 id="ranking-opciones-titulo">Canciones disponibles</h2></div><span>{pool.length - usadas.size} restantes</span></div>
          <ul>{cartas.filter((cancion) => !usadas.has(cancion.id)).map((cancion, indice) => (
            <li key={cancion.id}><button type="button" draggable className={`ranking__opcion ${seleccionada === cancion.id ? 'ranking__opcion--seleccionada' : ''}`} aria-pressed={seleccionada === cancion.id}
              onClick={() => { setSeleccionada((actual) => actual === cancion.id ? null : cancion.id); setAviso('') }}
              onDragStart={(e) => { e.dataTransfer.setData('text/song-id', cancion.id); e.dataTransfer.effectAllowed = 'move' }}
              style={{ '--entrada': `${Math.min(indice, 12) * 35}ms` }}>
              <span className="ranking__opcion-vinilo" aria-hidden="true">♫</span><span>{cancion.titulo}</span><span className="ranking__arrastrar" aria-hidden="true">⠿</span>
            </button></li>
          ))}</ul>
          {devolviendo && <p className="ranking__devolver-aviso">Suelta aquí para devolver la canción a disponibles</p>}
          <p className="ranking__aviso-interaccion" role="status">{aviso || (seleccionada ? 'Ahora toca un puesto para colocar la canción.' : 'Arrastra una canción o selecciónala para usarla con un toque.')}</p>
          <button type="button" className="btn btn--primary ranking__comprobar" onClick={verificar} disabled={Object.keys(placed).length < cantidad}>Confirmar</button>
        </section>
      )}
    </section>
  )
}

export default JuegoOrdenStreams
