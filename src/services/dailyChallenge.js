import { SONGS } from '../data/songs.js'

// Día del reto nº 1 (decisión propia del proyecto; se puede cambiar)
const FECHA_INICIO = '2026-10-15'

// Fecha local en formato AAAA-MM-DD
export function fechaDeHoy() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

// Número de reto: 1 el día de inicio, 2 al día siguiente, etc.
export function numeroDeReto(fecha = fechaDeHoy()) {
  const msPorDia = 24 * 60 * 60 * 1000
  const dias = Math.round(
    (Date.parse(`${fecha}T00:00:00Z`) - Date.parse(`${FECHA_INICIO}T00:00:00Z`)) / msPorDia,
  )
  return Math.max(1, dias + 1)
}

// Convierte un texto en un número siempre igual para el mismo texto
function hash(texto) {
  let h = 0
  for (let i = 0; i < texto.length; i++) {
    h = (h * 31 + texto.charCodeAt(i)) >>> 0
  }
  return h
}

// Generador de números "aleatorios" repetibles a partir de una semilla
function crearAleatorio(semilla) {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function mezclarConSemilla(lista, semilla) {
  const copia = [...lista]
  const azar = crearAleatorio(semilla)
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

// Elige un elemento de la lista para el día indicado.
// Recorre la lista entera (en orden barajado) antes de repetir ninguno.
export function elementoDelDia(lista, modo, fecha = fechaDeHoy()) {
  if (lista.length === 0) return null
  const dia = numeroDeReto(fecha) - 1
  const ciclo = Math.floor(dia / lista.length)
  const posicion = dia % lista.length
  const orden = mezclarConSemilla(lista, hash(`${modo}:${ciclo}`))
  return orden[posicion]
}

export function cancionDelDia(modo, fecha = fechaDeHoy()) {
  return elementoDelDia(SONGS, modo, fecha)
}
// Baraja una lista de forma repetible: el mismo texto da siempre el mismo orden
export function barajarConSemilla(lista, texto) {
  return mezclarConSemilla(lista, hash(texto))
}