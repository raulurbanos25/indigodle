import { useState } from 'react'
import { ALBUMS } from '../data/albums.js'
import { SONGS } from '../data/songs.js'
import { useRegistrarResultado } from './useRegistrarResultado.js'
import {
  elementoDelDia,
  barajarConSemilla,
  fechaDeHoy,
} from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from '../services/storage.js'

export const MAX_FALLOS = 3
const MODO = 'intruso'
const CANCIONES_DEL_ALBUM = 10 // máximo de canciones del álbum que se muestran
const INTRUSOS = 5 // intrusos que se mezclan

const claveGuardado = (fecha) => `indigodle:${MODO}:${fecha}`

// Solo álbumes que tengan canciones propias y canciones de fuera (los intrusos)
const ALBUMES_JUGABLES = ALBUMS.filter(
  (a) => SONGS.some((c) => c.albumId === a.id) && SONGS.some((c) => c.albumId !== a.id),
)

function cargarElegidas(fecha) {
  const guardado = leerJSON(claveGuardado(fecha), null)
  return Array.isArray(guardado?.elegidas) ? guardado.elegidas : []
}

export function useIntruso() {
  const [fecha] = useState(fechaDeHoy)
  // Ids de las canciones que el jugador ha tocado, en orden
  const [elegidas, setElegidas] = useState(() => cargarElegidas(fecha))

  const album = elementoDelDia(ALBUMES_JUGABLES, MODO, fecha)

  // Las canciones de cada día salen de la fecha, así que son iguales para todos
  const delAlbum = SONGS.filter((c) => c.albumId === album.id)
  const otras = SONGS.filter((c) => c.albumId !== album.id)
  const numIntrusos = Math.min(INTRUSOS, otras.length)
  const semilla = `${MODO}:${album.id}:${fecha}`

  const legitimas = barajarConSemilla(delAlbum, `${semilla}:a`).slice(0, CANCIONES_DEL_ALBUM)
  const intrusos = barajarConSemilla(otras, `${semilla}:i`).slice(0, numIntrusos)
  const cartas = barajarConSemilla([...legitimas, ...intrusos], `${semilla}:c`)
  const intrusosIds = intrusos.map((c) => c.id)

  // Todo el estado de la partida se deduce de lo que se ha tocado
  const encontradosIds = elegidas.filter((id) => intrusosIds.includes(id))
  const descartadasIds = elegidas.filter((id) => !intrusosIds.includes(id))
  const fallos = descartadasIds.length

  let estado = 'jugando'
  if (encontradosIds.length === numIntrusos) estado = 'ganada'
  else if (fallos >= MAX_FALLOS) estado = 'perdida'

  const elegir = (id) => {
    if (estado !== 'jugando') return
    if (elegidas.includes(id)) return

    const nuevas = [...elegidas, id]
    setElegidas(nuevas)
    guardarJSON(claveGuardado(fecha), { elegidas: nuevas })
  }

  // Solo se usa en desarrollo, para poder repetir el reto del día
  const reiniciarDev = () => {
    borrar(claveGuardado(fecha))
    setElegidas([])
  }
useRegistrarResultado(MODO, estado, fecha, fallos)
  return {
    album,
    cartas,
    intrusosIds,
    encontradosIds,
    descartadasIds,
    numIntrusos,
    fallos,
    estado,
    maxFallos: MAX_FALLOS,
    elegir,
    reiniciarDev,
  }
}
