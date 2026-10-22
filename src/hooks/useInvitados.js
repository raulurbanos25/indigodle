import { useState } from 'react'
import { ALBUMS } from '../data/albums.js'
import { invitadosDeAlbum } from '../models/Album.js'
import { useRegistrarResultado } from './useRegistrarResultado.js'
import {
  elementoDelDia,
  barajarConSemilla,
  fechaDeHoy,
} from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from '../services/storage.js'

export const MAX_INTENTOS = 5
const MODO = 'invitados'

const claveGuardado = (fecha) => `indigodle:${MODO}:${fecha}`

// Solo álbumes que tengan al menos un invitado
const ALBUMES_JUGABLES = ALBUMS.filter((a) => invitadosDeAlbum(a.id).length > 0)

function cargarIntentos(fecha) {
  const guardado = leerJSON(claveGuardado(fecha), null)
  return Array.isArray(guardado?.intentosIds) ? guardado.intentosIds : []
}

export function useInvitados() {
  const [fecha] = useState(fechaDeHoy)
  const [ids, setIds] = useState(() => cargarIntentos(fecha))

  // Si no hay álbumes con invitados, "album" es null y la página lo avisa
  const album = elementoDelDia(ALBUMES_JUGABLES, MODO, fecha)

  // Orden de aparición de los invitados: barajado, pero igual para todos ese día
  const invitados = album
    ? barajarConSemilla(invitadosDeAlbum(album.id), `${MODO}:${album.id}:${fecha}`)
    : []

  // Convertimos ids en álbumes (y descartamos ids que ya no existan)
  const intentos = ids.map((id) => ALBUMS.find((a) => a.id === id)).filter(Boolean)
  const intentosIds = intentos.map((a) => a.id)

  let estado = 'jugando'
  if (album && intentosIds.includes(album.id)) estado = 'ganada'
  else if (intentosIds.length >= MAX_INTENTOS) estado = 'perdida'

  const terminado = estado !== 'jugando'

  // Un invitado al empezar y uno más por cada fallo. Al terminar se ven todos.
  const pistasVisibles = terminado
    ? invitados.length
    : Math.min(invitados.length, intentos.length + 1)

  const responder = (albumId) => {
    if (estado !== 'jugando') return
    if (intentosIds.includes(albumId)) return

    const nuevos = [...intentosIds, albumId]
    setIds(nuevos)
    guardarJSON(claveGuardado(fecha), { intentosIds: nuevos })
  }

  // Solo se usa en desarrollo, para poder repetir el reto del día
  const reiniciarDev = () => {
    borrar(claveGuardado(fecha))
    setIds([])
  }
useRegistrarResultado(MODO, estado, fecha)
  return {
    album,
    invitados,
    pistasVisibles,
    intentos,
    intentosIds,
    estado,
    maxIntentos: MAX_INTENTOS,
    responder,
    reiniciarDev,
  }
}