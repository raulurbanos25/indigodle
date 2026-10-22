import { ARCHIVOS_AUDIO } from '../data/audios.generated.js'
import { encontrarArchivoDeAudio, urlDeAudio } from '../models/Audio.js'

// Ruta del MP3 de una canción (de public/audios/), o null si no tiene.
// Si la canción define "audioUrl" en songs.js, se usa esa.
export function rutaDeAudio(cancion) {
  if (cancion.audioUrl) return cancion.audioUrl
  const archivo = encontrarArchivoDeAudio(cancion, ARCHIVOS_AUDIO)
  return archivo ? urlDeAudio(archivo) : null
}