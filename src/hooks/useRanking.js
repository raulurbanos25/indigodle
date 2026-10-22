import { useState } from 'react'
import { SONGS } from '../data/songs.js'
import { RANKING_MAS_ESCUCHADAS } from '../data/rankingMasEscuchadas.js'
import { barajarConSemilla, fechaDeHoy } from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from '../services/storage.js'
import { useRegistrarResultado } from './useRegistrarResultado.js'

export const MAX_FALLOS_RANKING = 3
const catalogo = new Map(SONGS.map((cancion) => [cancion.id, cancion]))
const CANCIONES_RANKEADAS = RANKING_MAS_ESCUCHADAS
  .map((dato) => ({ ...catalogo.get(dato.songId), ...dato }))
  .filter((cancion) => cancion.id)

const claveGuardado = (modo, fecha) => `indigodle:${modo}:${fecha}`

function partidaGuardada(modo, fecha) {
  const guardado = leerJSON(claveGuardado(modo, fecha), null)
  return guardado?.version === 2 && typeof guardado === 'object' && !Array.isArray(guardado.placed)
    ? { placed: guardado.placed || {}, locked: guardado.locked || [], fallos: guardado.fallos || 0 }
    : { placed: {}, locked: [], fallos: 0 }
}

function elegirPool(modo, fecha, cantidad) {
  // Cada reto diario selecciona un grupo distinto y luego lo ordena por streams.
  return barajarConSemilla(CANCIONES_RANKEADAS, `${modo}:${fecha}:seleccion`).slice(0, cantidad)
}

export function useRanking({ modo = 'ranking', cantidad = 5 } = {}) {
  const [fecha] = useState(fechaDeHoy)
  const [pool] = useState(() => elegirPool(modo, fecha, cantidad))
  const [partida, setPartida] = useState(() => partidaGuardada(modo, fecha))
  const orden = [...pool].sort((a, b) => b.streams - a.streams).slice(0, cantidad)
  const cartas = barajarConSemilla(pool, `${modo}:${fecha}:cartas`)
  const locked = partida.locked.filter((indice) => Number.isInteger(indice) && indice >= 0 && indice < orden.length)

  let estado = 'jugando'
  if (partida.fallos >= MAX_FALLOS_RANKING) estado = 'perdida'
  else if (locked.length === orden.length) estado = 'ganada'

  const guardar = (nuevaPartida) => {
    setPartida(nuevaPartida)
    guardarJSON(claveGuardado(modo, fecha), { ...nuevaPartida, version: 2 })
  }

  const colocar = (indice, songId) => {
    if (estado !== 'jugando' || locked.includes(indice)) return
    if (!pool.some((cancion) => cancion.id === songId)) return
    const placed = { ...partida.placed }
    Object.keys(placed).forEach((key) => {
      if (placed[key] === songId || Number(key) === indice) delete placed[key]
    })
    placed[indice] = songId
    guardar({ ...partida, placed })
  }

  const quitar = (indice) => {
    if (estado !== 'jugando' || locked.includes(indice)) return
    const placed = { ...partida.placed }
    delete placed[indice]
    guardar({ ...partida, placed })
  }

  const comprobar = () => {
    if (estado !== 'jugando') return { incompleto: false }
    if (orden.some((_, indice) => !partida.placed[indice])) return { incompleto: true }
    const correctos = orden.reduce((indices, cancion, indice) => (
      partida.placed[indice] === cancion.id ? [...indices, indice] : indices
    ), [])
    const fallidos = partida.fallos + 1
    const placed = Object.fromEntries(correctos.map((indice) => [indice, partida.placed[indice]]))
    guardar({ placed, locked: [...new Set([...locked, ...correctos])], fallos: fallidos })
    return { incompleto: false }
  }

  const reiniciarDev = () => {
    borrar(claveGuardado(modo, fecha))
    setPartida({ placed: {}, locked: [], fallos: 0 })
  }

  useRegistrarResultado(modo, estado, fecha, partida.fallos)
  return {
    orden,
    pool,
    cartas,
    placed: partida.placed,
    locked,
    fallos: partida.fallos,
    estado,
    maxFallos: MAX_FALLOS_RANKING,
    colocar,
    quitar,
    comprobar,
    reiniciarDev,
  }
}
