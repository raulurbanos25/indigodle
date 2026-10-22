import { useState } from 'react'
import { ALBUMS } from '../data/albums.js'
import { SONGS } from '../data/songs.js'
import { ARCHIVOS_AUDIO } from '../data/audios.generated.js'
import { encontrarArchivoDeAudio, urlDeAudio } from '../models/Audio.js'
import { esRespuestaCorrecta, normalizarRespuesta } from '../models/Respuesta.js'
import { useRegistrarResultado } from './useRegistrarResultado.js'
import { elementoDelDia, fechaDeHoy } from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from '../services/storage.js'

export const MAX_INTENTOS = 6
const MODO = 'escucha'

const claveGuardado = (fecha) => `indigodle:${MODO}:${fecha}`

const albumDe = (cancion) =>
  cancion.albumId ? (ALBUMS.find((a) => a.id === cancion.albumId) ?? null) : null

// Para cada canción de songs.js, el MP3 que le corresponde (si lo hay).
// Se calcula una sola vez, al cargar la web. "audioUrl" en una canción manda sobre todo lo demás.
const AUDIO_DE = Object.fromEntries(
  SONGS.map((cancion) => {
    const archivo = cancion.audioUrl ?? encontrarArchivoDeAudio(cancion, ARCHIVOS_AUDIO)
    const ruta = cancion.audioUrl ?? (archivo ? urlDeAudio(archivo) : null)
    return [cancion.id, { archivo, ruta }]
  }),
)

// Para el panel de diagnóstico
const DIAGNOSTICO = SONGS.map((cancion) => ({
  id: cancion.id,
  titulo: cancion.titulo,
  tipo: cancion.albumId ? 'Álbum' : 'Single',
  archivo: AUDIO_DE[cancion.id].archivo,
}))
const ARCHIVOS_USADOS = new Set(DIAGNOSTICO.map((d) => d.archivo).filter(Boolean))
const ARCHIVOS_SIN_CANCION = ARCHIVOS_AUDIO.filter((archivo) => !ARCHIVOS_USADOS.has(archivo))

function cargarGuardado(fecha) {
  const guardado = leerJSON(claveGuardado(fecha), null)
  const intentos = Array.isArray(guardado?.intentos)
    ? guardado.intentos.filter(
        (i) => i && (i.tipo === 'respuesta' || i.tipo === 'salto') && typeof i.texto === 'string',
      )
    : []
  return {
    objetivoId: typeof guardado?.objetivoId === 'string' ? guardado.objetivoId : null,
    intentos,
  }
}

export function useJuegoEscucha() {
  const [fecha] = useState(fechaDeHoy)
  const [guardado, setGuardado] = useState(() => cargarGuardado(fecha))

  // Solo se sortean canciones que tengan MP3, estén donde estén en la lista de canciones.
  // Si no hay ninguna, "cancion" es null.
  const jugables = SONGS.filter((c) => AUDIO_DE[c.id].ruta)
  const cancion = elementoDelDia(jugables, MODO, fecha)
  const album = cancion ? albumDe(cancion) : null

  // Si la canción del día ha cambiado desde que se guardó la partida
  // (por ejemplo, al añadir un MP3), los intentos guardados ya no valen.
  const intentos = cancion && guardado.objetivoId === cancion.id ? guardado.intentos : []

  const acertado =
    Boolean(cancion) &&
    intentos.some((i) => i.tipo === 'respuesta' && esRespuestaCorrecta(i.texto, cancion.titulo))

  let estado = 'jugando'
  if (acertado) estado = 'ganada'
  else if (intentos.length >= MAX_INTENTOS) estado = 'perdida'

  // Segundos del fragmento: 1 al empezar y 1 más con cada intento
  const segundos = Math.min(intentos.length + 1, MAX_INTENTOS)

  const guardar = (nuevos) => {
    setGuardado({ objetivoId: cancion.id, intentos: nuevos })
    guardarJSON(claveGuardado(fecha), { objetivoId: cancion.id, intentos: nuevos })
  }

  // Devuelve 'ok', 'vacio', 'repetida' o 'cerrado' para que la página muestre el aviso
  const responder = (texto) => {
    if (!cancion || estado !== 'jugando') return 'cerrado'

    const limpio = texto.trim().slice(0, 80)
    const clave = normalizarRespuesta(limpio)
    if (!clave) return 'vacio'

    const repetida = intentos.some(
      (i) => i.tipo === 'respuesta' && normalizarRespuesta(i.texto) === clave,
    )
    if (repetida) return 'repetida'

    guardar([...intentos, { tipo: 'respuesta', texto: limpio }])
    return 'ok'
  }

  // Gasta un intento sin responder, para oír un segundo más
  const saltar = () => {
    if (!cancion || estado !== 'jugando') return
    guardar([...intentos, { tipo: 'salto', texto: '' }])
  }

  // Solo se usa en desarrollo, para poder repetir el reto del día
  const reiniciarDev = () => {
    borrar(claveGuardado(fecha))
    setGuardado({ objetivoId: null, intentos: [] })
  }

  useRegistrarResultado(MODO, estado, fecha)

  return {
    cancion,
    album,
    src: cancion ? AUDIO_DE[cancion.id].ruta : null,
    diagnostico: DIAGNOSTICO,
    archivos: ARCHIVOS_AUDIO,
    archivosSinCancion: ARCHIVOS_SIN_CANCION,
    intentos,
    estado,
    segundos,
    maxIntentos: MAX_INTENTOS,
    responder,
    saltar,
    reiniciarDev,
  }
}