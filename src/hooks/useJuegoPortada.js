import { useState } from 'react'
import { ALBUMS } from '../data/albums.js'
import { SONGS } from '../data/songs.js'
import { useRegistrarResultado } from './useRegistrarResultado.js'
import { rutasDePortada, rutasDeCancion } from '../models/Album.js'
import { useRutasDisponibles } from './usePortada.js'
import {
  elementoDelDia,
  barajarConSemilla,
  fechaDeHoy,
} from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from '../services/storage.js'

export const MAX_INTENTOS = 6
const MODO = 'portada'

const claveGuardado = (fecha) => `indigodle:${MODO}:${fecha}`

// Todo lo que se puede adivinar: álbumes (imagen en public/albumes/) y
// singles sueltos (imagen en public/portadas/). Cada elemento tiene un id propio
// con prefijo para que un álbum y una canción nunca se confundan.
export const ELEMENTOS_PORTADA = [
  ...ALBUMS.map((album) => ({
    id: `album:${album.id}`,
    titulo: album.titulo,
    anio: album.anio,
    tipo: 'album',
    carpeta: 'albumes',
    extension: 'jpg',
    rutas: rutasDePortada(album),
  })),
  ...SONGS.filter((cancion) => !cancion.albumId).map((cancion) => ({
    id: `single:${cancion.id}`,
    titulo: cancion.titulo,
    anio: cancion.anio,
    tipo: 'single',
    carpeta: 'portadas',
    extension: 'png',
    rutas: rutasDeCancion(cancion),
  })),
]

function cargarGuardado(fecha) {
  const guardado = leerJSON(claveGuardado(fecha), null)
  return {
    objetivoId: typeof guardado?.objetivoId === 'string' ? guardado.objetivoId : null,
    ids: Array.isArray(guardado?.intentosIds) ? guardado.intentosIds : [],
  }
}

export function useJuegoPortada() {
  const [fecha] = useState(fechaDeHoy)
  const [guardado, setGuardado] = useState(() => cargarGuardado(fecha))
  const { cargando, rutas } = useRutasDisponibles(ELEMENTOS_PORTADA)

  // Solo se sortean los elementos que tengan imagen. Si no hay ninguno, "objetivo" es null.
  const jugables = ELEMENTOS_PORTADA.filter((elemento) => rutas[elemento.id])
  const objetivo = elementoDelDia(jugables, MODO, fecha)

  // Si el elemento del día ha cambiado desde que se guardó la partida (por ejemplo,
  // porque se añadió una imagen), los intentos guardados ya no valen.
  const ids = objetivo && guardado.objetivoId === objetivo.id ? guardado.ids : []

  // Convertimos ids en elementos (y descartamos ids que ya no existan)
  const intentos = ids
    .map((id) => ELEMENTOS_PORTADA.find((elemento) => elemento.id === id))
    .filter(Boolean)
  const intentosIds = intentos.map((elemento) => elemento.id)

  let estado = 'jugando'
  if (objetivo && intentosIds.includes(objetivo.id)) estado = 'ganada'
  else if (intentosIds.length >= MAX_INTENTOS) estado = 'perdida'

  // Zona que se ve ampliada al principio: sale de la fecha, igual para todos
  const [x, y] = objetivo
    ? barajarConSemilla([25, 35, 45, 55, 65, 75], `${MODO}:${objetivo.id}:${fecha}:origen`)
    : [50, 50]

  const responder = (elementoId) => {
    if (!objetivo || estado !== 'jugando') return
    if (intentosIds.includes(elementoId)) return

    const nuevos = [...intentosIds, elementoId]
    setGuardado({ objetivoId: objetivo.id, ids: nuevos })
    guardarJSON(claveGuardado(fecha), { objetivoId: objetivo.id, intentosIds: nuevos })
  }

  // Solo se usa en desarrollo, para poder repetir el reto del día
  const reiniciarDev = () => {
    borrar(claveGuardado(fecha))
    setGuardado({ objetivoId: null, ids: [] })
  }
useRegistrarResultado(MODO, estado, fecha, intentos.length)
  return {
    cargando,
    objetivo,
    src: objetivo ? rutas[objetivo.id] : null,
    rutas, // ruta de la imagen de cada elemento que la tiene
    origen: { x, y },
    intentos,
    intentosIds,
    estado,
    nivel: intentos.length,
    maxIntentos: MAX_INTENTOS,
    responder,
    reiniciarDev,
  }
}
