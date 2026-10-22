import { ALBUMS } from '../data/albums.js'
import { SONGS } from '../data/songs.js'

// Canciones de un álbum, por número de pista
export function pistasDeAlbum(albumId) {
  return SONGS.filter((c) => c.albumId === albumId).sort(
    (a, b) => (a.numeroPista ?? 999) - (b.numeroPista ?? 999),
  )
}

export function duracionTotal(pistas) {
  return pistas.reduce((suma, c) => suma + c.duracionSeg, 0)
}

// 1925 -> "32 min 5 s"   ·   3900 -> "1 h 5 min"
export function formatearDuracionTotal(segundos) {
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  const resto = segundos % 60
  return horas > 0 ? `${horas} h ${minutos} min` : `${minutos} min ${resto} s`
}

// Álbumes del más antiguo al más reciente
function albumesCronologicos() {
  return [...ALBUMS].sort((a, b) => a.anio - b.anio || a.titulo.localeCompare(b.titulo, 'es'))
}

// Álbum anterior y siguiente en orden cronológico (null si no hay)
export function vecinosDeAlbum(albumId) {
  const lista = albumesCronologicos()
  const i = lista.findIndex((a) => a.id === albumId)
  return {
    anterior: i > 0 ? lista[i - 1] : null,
    siguiente: i >= 0 && i < lista.length - 1 ? lista[i + 1] : null,
  }
}

// Artistas invitados de las canciones dadas, con las canciones en las que participan
export function invitadosConPistas(pistas) {
  const mapa = new Map()
  for (const cancion of pistas) {
    for (const nombre of cancion.colaboradores) {
      if (!mapa.has(nombre)) mapa.set(nombre, [])
      mapa.get(nombre).push(cancion)
    }
  }
  return [...mapa.entries()]
    .map(([nombre, canciones]) => ({ nombre, canciones }))
    .sort(
      (a, b) => b.canciones.length - a.canciones.length || a.nombre.localeCompare(b.nombre, 'es'),
    )
}