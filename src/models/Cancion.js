import { ALBUMS } from '../data/albums.js'

// Definición única de las categorías. La cabecera de la tabla y las filas
// usan esta misma lista, así que no pueden desordenarse entre sí.
export const COLUMNAS_CLASICO = [
  { clave: 'album', etiqueta: 'Álbum' },
  { clave: 'anio', etiqueta: 'Año' },
  { clave: 'duracion', etiqueta: 'Duración' },
  { clave: 'pista', etiqueta: 'Pista' },
  { clave: 'colab', etiqueta: 'Colab.' },
  { clave: 'single', etiqueta: 'Single' },
]

export function formatearDuracion(segundos) {
  const minutos = Math.floor(segundos / 60)
  const resto = String(segundos % 60).padStart(2, '0')
  return `${minutos}:${resto}`
}

export function buscarAlbum(albumId) {
  if (!albumId) return null
  return ALBUMS.find((a) => a.id === albumId) ?? null
}

export function tituloAlbum(albumId) {
  if (!albumId) return 'Single suelto'
  return buscarAlbum(albumId)?.titulo ?? 'Desconocido'
}

export function inicialesTitulo(titulo) {
  return String(titulo ?? '')
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((palabra) => Array.from(palabra.replace(/^[^\p{L}\p{N}]+/u, ''))[0])
    .filter(Boolean)
    .map((letra) => letra.toLocaleUpperCase('es-ES'))
    .join(' ')
}

// Compara números. "direccion" indica hacia dónde está el valor buscado:
// 'subir' = el objetivo es mayor que tu intento, 'bajar' = es menor.
function compararNumero(intento, objetivo) {
  if (intento === objetivo) return { acierto: true, direccion: null }
  if (intento == null || objetivo == null) return { acierto: false, direccion: null }
  return { acierto: false, direccion: objetivo > intento ? 'subir' : 'bajar' }
}

function compararIgual(a, b) {
  return { acierto: a === b, direccion: null }
}

// Devuelve una entrada por categoría, en el mismo orden que COLUMNAS_CLASICO.
export function compararCanciones(intento, objetivo) {
  const tieneColab = (cancion) => cancion.colaboradores.length > 0

  return [
    {
      clave: 'album',
      texto: tituloAlbum(intento.albumId),
      albumId: intento.albumId,
      ...compararIgual(intento.albumId, objetivo.albumId),
    },
    {
      clave: 'anio',
      texto: String(intento.anio),
      ...compararNumero(intento.anio, objetivo.anio),
    },
    {
      clave: 'duracion',
      texto: formatearDuracion(intento.duracionSeg),
      ...compararNumero(intento.duracionSeg, objetivo.duracionSeg),
    },
    {
      clave: 'pista',
      texto: String(intento.numeroPista ?? '—'),
      ...compararNumero(intento.numeroPista, objetivo.numeroPista),
    },
    {
      clave: 'colab',
      texto: tieneColab(intento) ? 'Sí' : 'No',
      ...compararIgual(tieneColab(intento), tieneColab(objetivo)),
    },
    {
      clave: 'single',
      texto: intento.esSingle ? 'Sí' : 'No',
      ...compararIgual(intento.esSingle, objetivo.esSingle),
    },
  ]
}
