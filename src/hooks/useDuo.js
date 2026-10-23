import { useState } from 'react'
import { SONGS } from '../data/songs.js'
import { tituloAlbum, formatearDuracion } from '../models/Cancion.js'
import { elementoDelDia, fechaDeHoy } from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from '../services/storage.js'
import { useRegistrarResultado } from './useRegistrarResultado.js'

export const MAX_INTENTOS = 5
const MODO = 'duo'

const claveGuardado = (fecha) => `indigodle:${MODO}:${fecha}`

// Solo canciones que tengan al menos un colaborador
const CANCIONES_JUGABLES = SONGS.filter((c) => c.colaboradores.length > 0)

function cargarIntentos(fecha) {
  const guardado = leerJSON(claveGuardado(fecha), null)
  return Array.isArray(guardado?.intentos) ? guardado.intentos : []
}

export function useDuo() {
  const [fecha] = useState(fechaDeHoy)
  // Nombres de los artistas que el jugador ha probado, en orden
  const [intentos, setIntentos] = useState(() => cargarIntentos(fecha))

  // Si no hay canciones con colaboradores, "cancion" es null y la página lo avisa
  const cancion = elementoDelDia(CANCIONES_JUGABLES, MODO, fecha)

  // Las pistas se desbloquean de una en una, con cada fallo
  const pistas = cancion
    ? [
        `Año: ${cancion.anio}`,
        `Álbum: ${tituloAlbum(cancion.albumId)}`,
        `Duración: ${formatearDuracion(cancion.duracionSeg)}`,
        `${cancion.colaboradores.length > 1 ? 'Iniciales' : 'Inicial'}: ${cancion.colaboradores
          .map((nombre) => nombre.charAt(0).toUpperCase())
          .join(', ')}`,
      ]
    : []

  const esAcierto = (nombre) => Boolean(cancion?.colaboradores.includes(nombre))

  let estado = 'jugando'
  if (intentos.some(esAcierto)) estado = 'ganada'
  else if (intentos.length >= MAX_INTENTOS) estado = 'perdida'

  const terminado = estado !== 'jugando'
  const pistasVisibles = terminado ? pistas.length : Math.min(pistas.length, intentos.length)

  const responder = (nombre) => {
    if (estado !== 'jugando') return
    if (intentos.includes(nombre)) return

    const nuevos = [...intentos, nombre]
    setIntentos(nuevos)
    guardarJSON(claveGuardado(fecha), { intentos: nuevos })
  }

  // Solo se usa en desarrollo, para poder repetir el reto del día
  const reiniciarDev = () => {
    borrar(claveGuardado(fecha))
    setIntentos([])
  }
useRegistrarResultado(MODO, estado, fecha, intentos.length)
  return {
    cancion,
    pistas,
    pistasVisibles,
    intentos,
    esAcierto,
    estado,
    maxIntentos: MAX_INTENTOS,
    responder,
    reiniciarDev,
  }
}
