import { useState } from 'react'
import { SONGS } from '../data/songs.js'
import { barajarConSemilla, fechaDeHoy } from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar } from '../services/storage.js'
import { useRegistrarResultado } from './useRegistrarResultado.js'

export const MAX_FALLOS = 3
const MODO = 'cronologia'
const MAX_CANCIONES = 5

const claveGuardado = (fecha) => `indigodle:${MODO}:${fecha}`

// Una canción por año (así el orden correcto es único), hasta MAX_CANCIONES.
// Los años y las canciones salen de la fecha: todos ven lo mismo ese día.
function seleccionarCanciones(fecha) {
  const semilla = `${MODO}:${fecha}`
  const anios = [...new Set(SONGS.map((c) => c.anio))].sort((a, b) => a - b)
  const aniosElegidos = barajarConSemilla(anios, `${semilla}:anios`).slice(0, MAX_CANCIONES)

  return aniosElegidos.map(
    (anio) =>
      barajarConSemilla(
        SONGS.filter((c) => c.anio === anio),
        `${semilla}:${anio}`,
      )[0],
  )
}

function cargarElegidas(fecha) {
  const guardado = leerJSON(claveGuardado(fecha), null)
  return Array.isArray(guardado?.elegidas) ? guardado.elegidas : []
}

export function useCronologia() {
  const [fecha] = useState(fechaDeHoy)
  // Ids de las canciones tocadas, en orden (incluidos los errores)
  const [elegidas, setElegidas] = useState(() => cargarElegidas(fecha))
  const [seleccion] = useState(() => seleccionarCanciones(fecha))

  // Orden correcto: de más antigua a más reciente
  const orden = [...seleccion].sort((a, b) => a.anio - b.anio)
  // Orden en que se muestran las cartas: mezcladas, igual para todos ese día
  const cartas = barajarConSemilla(seleccion, `${MODO}:${fecha}:cartas`)

  // Todo el estado de la partida se deduce de la lista de toques
  const colocadasIds = []
  let fallos = 0
  let malasIds = [] // errores en el hueco actual (se vacía al acertar)

  for (const id of elegidas) {
    if (colocadasIds.length >= orden.length) break
    if (id === orden[colocadasIds.length].id) {
      colocadasIds.push(id)
      malasIds = []
    } else if (!malasIds.includes(id) && !colocadasIds.includes(id)) {
      fallos += 1
      malasIds.push(id)
    }
  }

  // Cuando solo queda una canción, se coloca sola
  if (
    orden.length > 1 &&
    fallos < MAX_FALLOS &&
    colocadasIds.length === orden.length - 1
  ) {
    colocadasIds.push(orden[orden.length - 1].id)
    malasIds = []
  }

  let estado = 'jugando'
  if (fallos >= MAX_FALLOS) estado = 'perdida'
  else if (orden.length > 0 && colocadasIds.length === orden.length) estado = 'ganada'

  const elegir = (id) => {
    if (estado !== 'jugando') return
    if (colocadasIds.includes(id) || malasIds.includes(id)) return

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
    orden,
    cartas,
    colocadasIds,
    malasIds,
    fallos,
    estado,
    maxFallos: MAX_FALLOS,
    elegir,
    reiniciarDev,
  }
}
