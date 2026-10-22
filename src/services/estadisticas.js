// Cómo se mide cada modo:
//  - 'intentos': en qué intento aciertas (1 = a la primera). Máximo = intentos que hay.
//  - 'fallos': cuántos fallos cometes (0 = perfecto). Máximo = fallos con los que pierdes.
// Debe coincidir con MAX_INTENTOS / MAX_FALLOS de cada hook de juego.
export const CONFIG_MODOS = {
  clasico: { tipo: 'intentos', max: 6 },
  tracklist: { tipo: 'fallos', max: 5 },
  intruso: { tipo: 'fallos', max: 3 },
  invitados: { tipo: 'intentos', max: 5 },
  duo: { tipo: 'intentos', max: 5 },
  cronologia: { tipo: 'fallos', max: 3 },
  ranking: { tipo: 'fallos', max: 3 },
  palabra: { tipo: 'intentos', max: 6 },
  portada: { tipo: 'intentos', max: 6 },
  escucha: { tipo: 'intentos', max: 6 },
}

export const configDe = (modo) => CONFIG_MODOS[modo] ?? { tipo: 'intentos', max: 6 }

// ---------- Fechas (formato AAAA-MM-DD, calculadas en UTC para evitar líos de horario) ----------
const MS_DIA = 24 * 60 * 60 * 1000
const aMs = (fecha) => Date.parse(`${fecha}T00:00:00Z`)

export const diasEntre = (a, b) => Math.round((aMs(b) - aMs(a)) / MS_DIA)
const sumarDias = (fecha, n) => new Date(aMs(fecha) + n * MS_DIA).toISOString().slice(0, 10)
const diaSemana = (fecha) => (new Date(aMs(fecha)).getUTCDay() + 6) % 7 // 0 = lunes

export function formatearFecha(fecha, opciones = { day: 'numeric', month: 'short' }) {
  return new Date(aMs(fecha)).toLocaleDateString('es-ES', { ...opciones, timeZone: 'UTC' })
}

// ---------- Cálculos ----------
const porcentaje = (parte, total) => (total === 0 ? 0 : Math.round((parte / total) * 100))
const esGanada = (partida) => partida.estado === 'ganada'
const esPerfecta = (partida) =>
  esGanada(partida) && partida.intentos === (configDe(partida.modo).tipo === 'intentos' ? 1 : 0)

// Pasa el historial a una lista [{ fecha, modo, estado, intentos }], de la más antigua a la más reciente
export function aplanar(historial) {
  const lista = []
  for (const [fecha, modos] of Object.entries(historial)) {
    for (const [modo, resultado] of Object.entries(modos)) {
      lista.push({ fecha, modo, estado: resultado.estado, intentos: resultado.intentos })
    }
  }
  return lista.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.modo.localeCompare(b.modo))
}

// Victorias seguidas, día a día (si te saltas un día, la racha se rompe)
function rachaDeVictorias(partidas, hoy) {
  let racha = 0
  let mejor = 0
  let ultima = null

  for (const partida of partidas) {
    if (esGanada(partida)) {
      racha = ultima && diasEntre(ultima, partida.fecha) === 1 ? racha + 1 : 1
      ultima = partida.fecha
      mejor = Math.max(mejor, racha)
    } else {
      racha = 0
      ultima = null
    }
  }

  const vigente = ultima !== null && diasEntre(ultima, hoy) <= 1
  return { actual: vigente ? racha : 0, mejor }
}

// Días seguidos con al menos una partida terminada
function rachaDeDias(fechas, hoy) {
  let racha = 0
  let mejor = 0
  let anterior = null

  for (const fecha of fechas) {
    racha = anterior && diasEntre(anterior, fecha) === 1 ? racha + 1 : 1
    anterior = fecha
    mejor = Math.max(mejor, racha)
  }

  const vigente = anterior !== null && diasEntre(anterior, hoy) <= 1
  return { actual: vigente ? racha : 0, mejor, dias: fechas.length }
}

// Estadísticas de un modo. "partidas" son solo las de ese modo, ordenadas por fecha.
export function resumenModo(partidas, modo, hoy) {
  const { tipo, max } = configDe(modo)
  const ganadas = partidas.filter(esGanada)
  const conDato = ganadas.filter((partida) => partida.intentos !== null)

  // Barras de "en qué intento aciertas" (o "con cuántos fallos")
  const primero = tipo === 'intentos' ? 1 : 0
  const ultimo = Math.max(tipo === 'intentos' ? max : max - 1, ...conDato.map((p) => p.intentos))
  const distribucion = []
  for (let valor = primero; valor <= ultimo; valor++) {
    distribucion.push({
      valor,
      cantidad: conDato.filter((partida) => partida.intentos === valor).length,
    })
  }

  return {
    jugadas: partidas.length,
    ganadas: ganadas.length,
    perdidas: partidas.length - ganadas.length,
    porcentaje: porcentaje(ganadas.length, partidas.length),
    perfectas: partidas.filter(esPerfecta).length,
    media:
      conDato.length > 0
        ? conDato.reduce((suma, partida) => suma + partida.intentos, 0) / conDato.length
        : null,
    distribucion,
    sinDetalle: ganadas.length - conDato.length,
    racha: rachaDeVictorias(partidas, hoy),
  }
}

export function resumenGlobal(partidas, hoy) {
  const ganadas = partidas.filter(esGanada).length
  const fechas = [...new Set(partidas.map((partida) => partida.fecha))].sort()

  return {
    jugadas: partidas.length,
    ganadas,
    perdidas: partidas.length - ganadas,
    porcentaje: porcentaje(ganadas, partidas.length),
    perfectas: partidas.filter(esPerfecta).length,
    racha: rachaDeDias(fechas, hoy),
  }
}

// Modos ordenados de mejor a peor por % de victorias
export function ranking(partidas, hoy) {
  const porModo = new Map()
  for (const partida of partidas) {
    if (!porModo.has(partida.modo)) porModo.set(partida.modo, [])
    porModo.get(partida.modo).push(partida)
  }

  return [...porModo.entries()]
    .map(([modo, lista]) => ({ modo, ...resumenModo(lista, modo, hoy) }))
    .sort((a, b) => b.porcentaje - a.porcentaje || b.ganadas - a.ganadas || b.jugadas - a.jugadas)
}

// % de victorias acumulado al final de cada día con partidas (los últimos "maxPuntos" días)
export function evolucion(partidas, maxPuntos = 60) {
  const porDia = new Map()
  for (const partida of partidas) {
    const dia = porDia.get(partida.fecha) ?? { jugadas: 0, ganadas: 0 }
    dia.jugadas += 1
    if (esGanada(partida)) dia.ganadas += 1
    porDia.set(partida.fecha, dia)
  }

  let jugadas = 0
  let ganadas = 0
  const puntos = [...porDia.keys()].sort().map((fecha) => {
    const dia = porDia.get(fecha)
    jugadas += dia.jugadas
    ganadas += dia.ganadas
    return { fecha, jugadas, ganadas, porcentaje: porcentaje(ganadas, jugadas) }
  })
  return puntos.slice(-maxPuntos)
}

function nivelDe(dia) {
  if (dia.jugadas === 0) return 'vacio'
  if (dia.ganadas === 0) return 'perdido'
  if (dia.ganadas <= 2) return 'n1'
  if (dia.ganadas <= 5) return 'n2'
  return 'n3'
}

// Una celda por día, en columnas de lunes a domingo, hasta el final de la semana actual
export function actividad(partidas, hoy, semanas = 12) {
  const lunesActual = sumarDias(hoy, -diaSemana(hoy))
  const inicio = sumarDias(lunesActual, -7 * (semanas - 1))

  const porDia = new Map()
  for (const partida of partidas) {
    const dia = porDia.get(partida.fecha) ?? { jugadas: 0, ganadas: 0 }
    dia.jugadas += 1
    if (esGanada(partida)) dia.ganadas += 1
    porDia.set(partida.fecha, dia)
  }

  const celdas = []
  for (let i = 0; i < semanas * 7; i++) {
    const fecha = sumarDias(inicio, i)
    const dia = porDia.get(fecha) ?? { jugadas: 0, ganadas: 0 }
    celdas.push({ fecha, ...dia, futuro: fecha > hoy, nivel: nivelDe(dia) })
  }
  return celdas
}

// Texto del resultado de una partida: "Acertada a la 3ª", "Sin fallos", "No acertada"...
export function describirResultado(partida) {
  const { tipo } = configDe(partida.modo)
  if (partida.estado === 'perdida') return 'No acertada'
  if (partida.intentos === null) return 'Acertada'
  if (tipo === 'intentos') {
    return partida.intentos === 1 ? 'Acertada a la primera' : `Acertada a la ${partida.intentos}ª`
  }
  if (partida.intentos === 0) return 'Sin fallos'
  return `${partida.intentos} ${partida.intentos === 1 ? 'fallo' : 'fallos'}`
}
