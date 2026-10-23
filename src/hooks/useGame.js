import { useState } from 'react'
import { SONGS } from '../data/songs.js'
import { cancionDelDia, fechaDeHoy } from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from '../services/storage.js'
import { useRegistrarResultado } from './useRegistrarResultado.js'

export const MAX_INTENTOS = 6
const MODO = 'clasico'

const claveGuardado = (fecha) => `indigodle:${MODO}:${fecha}`

function cargarIntentosGuardados(fecha) {
  const guardado = leerJSON(claveGuardado(fecha), null)
  return Array.isArray(guardado?.intentosIds) ? guardado.intentosIds : []
}

export function useGame() {
  const [fecha] = useState(fechaDeHoy)
  const [ids, setIds] = useState(() => cargarIntentosGuardados(fecha))

  const objetivo = cancionDelDia(MODO, fecha)

  // Convertimos ids en canciones (y descartamos ids que ya no existan)
  const intentos = ids.map((id) => SONGS.find((c) => c.id === id)).filter(Boolean)
  const intentosIds = intentos.map((c) => c.id)

  let estado = 'jugando'
  if (intentosIds.includes(objetivo.id)) estado = 'ganada'
  else if (intentosIds.length >= MAX_INTENTOS) estado = 'perdida'

  const responder = (cancionId) => {
    if (estado !== 'jugando') return
    if (intentosIds.includes(cancionId)) return

    const nuevos = [...intentosIds, cancionId]
    setIds(nuevos)
    guardarJSON(claveGuardado(fecha), { intentosIds: nuevos })
  }

  // Solo se usa en desarrollo, para poder repetir el reto del día
  const reiniciarDev = () => {
    borrar(claveGuardado(fecha))
    setIds([])
  }
useRegistrarResultado(MODO, estado, fecha, intentosIds.length)
  return {
    objetivo,
    intentos,
    intentosIds,
    estado,
    maxIntentos: MAX_INTENTOS,
    responder,
    reiniciarDev,
  }
}
