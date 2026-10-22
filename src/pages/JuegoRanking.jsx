import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SONGS } from '../data/songs.js'
import { RANKING_MAS_ESCUCHADAS } from '../data/rankingMasEscuchadas.js'
import { barajarConSemilla, fechaDeHoy, numeroDeReto } from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from '../services/storage.js'
import { useRegistrarResultado } from '../hooks/useRegistrarResultado.js'
import ResultPanel from '../components/game/ResultPanel.jsx'
import './JuegoRanking.css'

const MODO = 'ranking'
const RONDAS = 5
const claveDuelos = (fecha) => `indigodle:${MODO}:criterios-mixtos:v1:${fecha}`

function criterioDistinto(a, b, tipo) {
  return tipo === 'salida' ? a.anio !== b.anio : a.duracionSeg !== b.duracionSeg
}

function idGanador(a, b, tipo) {
  if (tipo === 'salida') return a.anio < b.anio ? a.id : b.id
  return a.duracionSeg > b.duracionSeg ? a.id : b.id
}

function construirDuelos(fecha) {
  const canciones = RANKING_MAS_ESCUCHADAS
    .map((dato) => ({ ...SONGS.find((cancion) => cancion.id === dato.songId), ...dato }))
    .filter((cancion) => cancion.id && Number.isFinite(cancion.anio) && Number.isFinite(cancion.duracionSeg))
  const mezcladas = barajarConSemilla(canciones, `${MODO}:${fecha}:duelos`)
  const criterios = barajarConSemilla(['salida', 'duracion'], `${MODO}:${fecha}:criterios`)
  const disponibles = [...mezcladas]
  const duelos = []
  for (let i = 0; i < RONDAS && disponibles.length >= 2; i += 1) {
    const tipo = criterios[i % criterios.length]
    const a = disponibles.shift()
    let indiceB = disponibles.findIndex((cancion) => criterioDistinto(a, cancion, tipo))
    if (indiceB < 0) indiceB = 0
    const [b] = disponibles.splice(indiceB, 1)
    duelos.push({ a, b, tipo, ganadorId: idGanador(a, b, tipo) })
  }
  return duelos
}

function JuegoRanking() {
  const [fecha] = useState(fechaDeHoy)
  const [respuestas, setRespuestas] = useState(() => {
    const guardado = leerJSON(claveDuelos(fecha), null)
    return Array.isArray(guardado?.respuestas) ? guardado.respuestas : []
  })
  const [seleccion, setSeleccion] = useState(null)
  const duelos = construirDuelos(fecha)
  const indice = respuestas.length
  const duelo = duelos[indice]
  const aciertos = respuestas.filter((respuesta) => respuesta.seleccion === respuesta.ganadorId).length
  const estado = indice >= duelos.length ? (aciertos >= Math.ceil(duelos.length / 2) ? 'ganada' : 'perdida') : 'jugando'
  const fallos = respuestas.length - aciertos
  useRegistrarResultado(MODO, estado, fecha, fallos)

  const elegir = (id) => {
    if (!duelo || seleccion) return
    setSeleccion(id)
  }

  const avanzar = () => {
    if (!duelo || !seleccion) return
    const nuevas = [...respuestas, { seleccion, ganadorId: duelo.ganadorId }]
    setRespuestas(nuevas)
    guardarJSON(claveDuelos(fecha), { respuestas: nuevas })
    setSeleccion(null)
  }

  const reiniciarDev = () => {
    borrar(claveDuelos(fecha))
    setRespuestas([])
    setSeleccion(null)
  }

  return (
    <section className="page container daily-duel">
      <header className="daily-duel__header">
        <p className="daily-duel__tag">Duelo musical · Reto nº {numeroDeReto(fecha)}</p>
        <h1>{estado !== 'jugando' ? 'Duelo terminado' : duelo?.tipo === 'salida' ? '¿Cuál salió antes?' : '¿Cuál dura más?'}</h1>
        <p>El criterio cambia en cada ronda: año de lanzamiento o duración. Tienes cinco duelos.</p>
        <Link to="/como-se-juega">Cómo se juega</Link>
      </header>

      <div className="daily-duel__score" aria-live="polite">
        <span>Duelo <strong>{Math.min(indice + 1, duelos.length)}</strong> / {duelos.length}</span>
        <span>Aciertos <strong>{aciertos}</strong></span>
        {import.meta.env.DEV && <button type="button" className="btn btn--ghost btn--small" onClick={reiniciarDev}>Reiniciar</button>}
      </div>

      {estado !== 'jugando' ? (
        <ResultPanel estado={estado} tituloGanada="¡Buen oído musical!" tituloPerdida="Duelo terminado">
          <p>Has acertado {aciertos} de {duelos.length}. Mañana tendrás nuevas parejas de canciones.</p>
        </ResultPanel>
      ) : duelo ? (
        <section className="daily-duel__arena" aria-label={`Duelo ${indice + 1}`}>
          <div className="daily-duel__cards">
            {[duelo.a, duelo.b].map((cancion, lado) => {
              const respondida = Boolean(seleccion)
              const correcta = cancion.id === duelo.ganadorId
              const clase = respondida ? (correcta ? 'daily-duel__card--correcta' : cancion.id === seleccion ? 'daily-duel__card--fallida' : '') : ''
              return (
                <button key={cancion.id} type="button" className={`daily-duel__card ${clase}`} onClick={() => elegir(cancion.id)} disabled={respondida}>
                  <span className="daily-duel__side">{lado === 0 ? 'A' : 'B'}</span>
                  <span className="daily-duel__disc" aria-hidden="true"><span>♫</span></span>
                  <strong>{cancion.titulo}</strong>
                  <small>{cancion.albumId ? 'Álbum' : 'Single'}</small>
                  {respondida ? (
                    <span className="daily-duel__streams">
                      {duelo.tipo === 'salida' ? cancion.anio : `${Math.floor(cancion.duracionSeg / 60)}:${String(cancion.duracionSeg % 60).padStart(2, '0')}`}
                      <small>{duelo.tipo === 'salida' ? 'año de lanzamiento' : 'duración'}</small>
                    </span>
                  ) : <span className="daily-duel__prompt">{duelo.tipo === 'salida' ? '¿Salió antes?' : '¿Dura más?'}</span>}
                </button>
              )
            })}
          </div>
          {seleccion && <p className="daily-duel__feedback" role="status">{seleccion === duelo.ganadorId ? '¡Correcto! Buen ojo con la comparación.' : 'Esta vez no. Mira las respuestas y sigue con el siguiente duelo.'}</p>}
          <button type="button" className="btn btn--primary daily-duel__next" disabled={!seleccion} onClick={avanzar}>
            {indice + 1 === duelos.length ? 'Ver resultado' : 'Siguiente duelo'} <span aria-hidden="true">→</span>
          </button>
        </section>
      ) : <p role="status">No hay suficientes canciones con año y duración registrados para iniciar el duelo.</p>}
    </section>
  )
}

export default JuegoRanking
