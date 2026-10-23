import { SONGS } from '../data/songs.js'

// Artistas invitados de un álbum: los colaboradores de sus canciones, sin repetir.
export function invitadosDeAlbum(albumId) {
  const nombres = SONGS.filter((c) => c.albumId === albumId).flatMap(
    (c) => c.colaboradores,
  )
  return [...new Set(nombres)]
}

// "Álbum: Edición 2" -> "album-edicion-2" (minúsculas, sin tildes, con guiones)
export function slugificar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const EXTENSIONES_CAJA = ['webp', 'jpg', 'jpeg', 'png']
const EXTENSIONES_DISCO = ['webp', 'png', 'jpg', 'jpeg'] // WebP primero para cargar menos datos
const EXTENSIONES_SINGLE = ['webp', 'png', 'jpg']
const EXTENSIONES_AUDIO = ['mp3']

// Rutas posibles de un archivo dentro de public/<carpeta>/.
// Primero el título exacto y después la versión con guiones y sin tildes.
// Sirve para cualquier cosa que tenga "titulo" (álbumes y canciones).
function rutasEnCarpeta(carpeta, elemento, extensiones) {
  const nombres = [...new Set([encodeURIComponent(elemento.titulo), slugificar(elemento.titulo)])]
  return nombres.flatMap((nombre) =>
    extensiones.map((extension) => `/${carpeta}/${nombre}.${extension}`),
  )
}

// Caja del álbum, en public/albumes/. Si el álbum define "portadaUrl", se usa esa.
export function rutasDePortada(album) {
  if (album.portadaUrl) return [album.portadaUrl]
  return rutasEnCarpeta('albumes', album, EXTENSIONES_CAJA)
}

// Disco que sale de la caja, en public/discos/. Si el álbum define "discoUrl", se usa esa.
export function rutasDeDisco(album) {
  if (album.discoUrl) return [album.discoUrl]
  return rutasEnCarpeta('discos', album, EXTENSIONES_DISCO)
}

// Imagen del disco de un single suelto, en public/portadas/.
// Si la canción define "imagenUrl", se usa esa.
export function rutasDeCancion(cancion) {
  if (cancion.imagenUrl) return [cancion.imagenUrl]
  return rutasEnCarpeta('portadas', cancion, EXTENSIONES_SINGLE)
}

// Audio MP3 de una canción, en public/audios/. Si la canción define "audioUrl", se usa esa.
export function rutasDeAudio(cancion) {
  if (cancion.audioUrl) return [cancion.audioUrl]
  return rutasEnCarpeta('audios', cancion, EXTENSIONES_AUDIO)
}
