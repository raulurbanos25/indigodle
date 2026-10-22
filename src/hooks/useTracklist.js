import { useState } from 'react'
import { ALBUMS } from '../data/albums.js'
import { SONGS } from '../data/songs.js'
import { elementoDelDia, fechaDeHoy } from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from '../services/storage.js'
import { useRegistrarResultado } from './useRegistrarResultado.js'
export const MAX_FALLOS = 5
const MODO = 'tracklist'

const claveGuardado = (fecha) => `indigodle:${MODO}:${fecha}`
const ESTADO_INICIAL = { aciertosIds: [], fallosIds: [], rendido: false }

// Solo se pueden elegir álbumes que tengan al menos una canción
const ALBUMES_JUGABLES = ALBUMS.filter((a) => SONGS.some((c) => c.albumId === a.id))

function cargarPartida(fecha) {
  const guardado = leerJSON(claveGuardado(fecha), null)
  if (!guardado) return ESTADO_INICIAL
  return {
    aciertosIds: Array.isArray(guardado.aciertosIds) ? guardado.aciertosIds : [],
    fallosIds: Array.isArray(guardado.fallosIds) ? guardado.fallosIds : [],
    rendido: guardado.rendido === true,
  }
}

export function useTracklist() {
  const [fecha] = useState(fechaDeHoy)
  const [datos, setDatos] = useState(() => cargarPartida(fecha))

  const album = elementoDelDia(ALBUMES_JUGABLES, MODO, fecha)
  const pistas = SONGS.filter((c) => c.albumId === album.id).sort(
    (a, b) => a.numeroPista - b.numeroPista,
  )

  const aciertosIds = datos.aciertosIds.filter((id) => pistas.some((p) => p.id === id))
  const fallos = datos.fallosIds
    .map((id) => SONGS.find((c) => c.id === id))
    .filter(Boolean)

  let estado = 'jugando'
  if (aciertosIds.length === pistas.length) estado = 'ganada'
  else if (datos.rendido || fallos.length >= MAX_FALLOS) estado = 'perdida'

  const guardar = (nuevos) => {
    setDatos(nuevos)
    guardarJSON(claveGuardado(fecha), nuevos)
  }

  const responder = (cancionId) => {
    if (estado !== 'jugando') return
    if (datos.aciertosIds.includes(cancionId) || datos.fallosIds.includes(cancionId)) return

    const esDelAlbum = pistas.some((p) => p.id === cancionId)
    guardar(
      esDelAlbum
        ? { ...datos, aciertosIds: [...datos.aciertosIds, cancionId] }
        : { ...datos, fallosIds: [...datos.fallosIds, cancionId] },
    )
  }

  const rendirse = () => {
    if (estado === 'jugando') guardar({ ...datos, rendido: true })
  }

  // Solo se usa en desarrollo, para poder repetir el reto del día
  const reiniciarDev = () => {
    borrar(claveGuardado(fecha))
    setDatos(ESTADO_INICIAL)
  }
useRegistrarResultado(MODO, estado, fecha)
  return {
    album,
    pistas,
    aciertosIds,
    fallos,
    excluidasIds: [...aciertosIds, ...fallos.map((c) => c.id)],
    estado,
    maxFallos: MAX_FALLOS,
    responder,
    rendirse,
    reiniciarDev,
  }
}