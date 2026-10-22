import { GAMES } from '../data/games.js'
import { fechaDeHoy } from './dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from './storage.js'

// Dos registros:
//  1. "jugados:<fecha>": qué modos están terminados hoy. Lo usan las tarjetas para bloquearse.
//  2. "historial": todas las partidas de todos los días, con sus intentos. Lo usan las estadísticas.
const CLAVE_HISTORIAL = 'indigodle:historial'
const claveDia = (fecha) => `indigodle:jugados:${fecha}`

const MODOS_VALIDOS = new Set(GAMES.map((juego) => juego.id))
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/

const esFinal = (estado) => estado === 'ganada' || estado === 'perdida'
const esObjeto = (x) => typeof x === 'object' && x !== null && !Array.isArray(x)

// Forma del historial: { '2026-10-18': { clasico: { estado: 'ganada', intentos: 3 } } }
// Deja solo lo que tiene esa forma (por si el archivo está corrupto o viene de fuera).
export function normalizarHistorial(bruto) {
  const limpio = {}
  if (!esObjeto(bruto)) return limpio

  for (const [fecha, modos] of Object.entries(bruto)) {
    if (!FORMATO_FECHA.test(fecha) || !esObjeto(modos)) continue

    for (const [modo, resultado] of Object.entries(modos)) {
      if (!MODOS_VALIDOS.has(modo) || !esObjeto(resultado) || !esFinal(resultado.estado)) continue

      const intentos =
        Number.isInteger(resultado.intentos) && resultado.intentos >= 0 && resultado.intentos <= 99
          ? resultado.intentos
          : null
      if (!limpio[fecha]) limpio[fecha] = {}
      limpio[fecha][modo] = { estado: resultado.estado, intentos }
    }
  }
  return limpio
}

// Primera vez: recoge los resultados antiguos de "jugados:<fecha>", que no tenían intentos
function migrarRegistrosAntiguos() {
  const historial = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i)
      const coincide = clave ? /^indigodle:jugados:(\d{4}-\d{2}-\d{2})$/.exec(clave) : null
      if (!coincide) continue

      const modos = leerJSON(clave, {})
      if (!esObjeto(modos)) continue
      for (const [modo, estado] of Object.entries(modos)) {
        if (!historial[coincide[1]]) historial[coincide[1]] = {}
        historial[coincide[1]][modo] = { estado, intentos: null }
      }
    }
  } catch {
    // Sin almacenamiento disponible: no hay nada que migrar
  }
  return normalizarHistorial(historial)
}

export function leerHistorial() {
  const guardado = leerJSON(CLAVE_HISTORIAL, null)
  if (esObjeto(guardado)) return normalizarHistorial(guardado)

  const migrado = migrarRegistrosAntiguos()
  guardarJSON(CLAVE_HISTORIAL, migrado)
  return migrado
}

export function guardarHistorial(historial) {
  guardarJSON(CLAVE_HISTORIAL, normalizarHistorial(historial))
}

// Se guarda un objeto vacío (no se borra la clave) para que no vuelva a migrarse lo antiguo
export function borrarHistorial() {
  guardarJSON(CLAVE_HISTORIAL, {})
}

// Guarda (o quita) el resultado de un modo. Solo "ganada" y "perdida" cuentan como terminado;
// cualquier otro estado (por ejemplo, tras reiniciar en desarrollo) lo quita de los dos registros.
// "intentos" es el número de intentos usados (modos de adivinar) o de fallos (Tracklist,
// Intruso y Cronología).
export function registrarResultado(modo, estado, fecha = fechaDeHoy(), intentos = null) {
  const n = Number.isInteger(intentos) && intentos >= 0 ? intentos : null

  // 1) Registro del día: es lo que bloquea el modo en "Jugar"
  const brutoDia = leerJSON(claveDia(fecha), {})
  const anteriorDia = esObjeto(brutoDia) ? brutoDia : {}
  const dia = { ...anteriorDia }
  if (esFinal(estado)) dia[modo] = estado
  else delete dia[modo]

  if (JSON.stringify(dia) !== JSON.stringify(anteriorDia)) {
    if (Object.keys(dia).length === 0) borrar(claveDia(fecha))
    else guardarJSON(claveDia(fecha), dia)
  }

  // 2) Historial permanente, para las estadísticas
  const historial = leerHistorial()
  const delDia = { ...(historial[fecha] ?? {}) }
  if (esFinal(estado)) delDia[modo] = { estado, intentos: n }
  else delete delDia[modo]

  const nuevo = { ...historial }
  if (Object.keys(delDia).length === 0) delete nuevo[fecha]
  else nuevo[fecha] = delDia

  if (JSON.stringify(nuevo) !== JSON.stringify(historial)) {
    guardarJSON(CLAVE_HISTORIAL, nuevo)
  }
}

export function resultadosDeHoy(fecha = fechaDeHoy()) {
  const resultados = leerJSON(claveDia(fecha), {})
  return esObjeto(resultados) ? resultados : {}
}

// ---------- Copia de seguridad ----------

// Lee el texto de un archivo de copia. Devuelve { ok, historial } o { ok: false, error }.
export function leerCopia(texto) {
  let datos
  try {
    datos = JSON.parse(texto)
  } catch {
    return { ok: false, error: 'El archivo no es un JSON válido.' }
  }

  const bruto = esObjeto(datos) && esObjeto(datos.historial) ? datos.historial : datos
  const historial = normalizarHistorial(bruto)
  const total = Object.values(historial).reduce((suma, modos) => suma + Object.keys(modos).length, 0)

  if (total === 0) return { ok: false, error: 'No he encontrado partidas en ese archivo.' }
  return { ok: true, historial }
}

// Añade al historial actual las partidas de la copia que todavía no tengas
export function fusionarHistorial(actual, importado) {
  const resultado = {}
  for (const [fecha, modos] of Object.entries(actual)) resultado[fecha] = { ...modos }

  let anadidas = 0
  for (const [fecha, modos] of Object.entries(importado)) {
    for (const [modo, partida] of Object.entries(modos)) {
      if (resultado[fecha]?.[modo]) continue
      if (!resultado[fecha]) resultado[fecha] = {}
      resultado[fecha][modo] = partida
      anadidas += 1
    }
  }
  return { historial: resultado, anadidas }
}