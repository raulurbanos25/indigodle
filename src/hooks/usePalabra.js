import { useEffect, useState } from 'react'
import { WORDS } from '../data/words.js'
import { LONGITUD, normalizar, esLetra, mejorEstadoPorLetra } from '../models/Palabra.js'
import { elementoDelDia, fechaDeHoy } from '../services/dailyChallenge.js'
import { leerJSON, guardarJSON, borrar as borrarGuardado } from '../services/storage.js'
import { useRegistrarResultado } from './useRegistrarResultado.js'
export const MAX_INTENTOS = 6
const MODO = 'palabra'

const claveGuardado = (fecha) => `indigodle:${MODO}:${fecha}`

// Solo palabras con la longitud correcta
const PALABRAS_JUGABLES = WORDS.filter((w) => normalizar(w.palabra).length === LONGITUD)

function cargarIntentos(fecha) {
  const guardado = leerJSON(claveGuardado(fecha), null)
  return Array.isArray(guardado?.intentos)
    ? guardado.intentos.filter((t) => typeof t === 'string' && t.length === LONGITUD)
    : []
}

export function usePalabra() {
  const [fecha] = useState(fechaDeHoy)
  const [intentos, setIntentos] = useState(() => cargarIntentos(fecha))
  const [actual, setActual] = useState('') // lo que se está escribiendo (no se guarda)
  const [mensaje, setMensaje] = useState('')

  // Si no hay palabras válidas, "palabra" es null y la página lo avisa
  const palabra = elementoDelDia(PALABRAS_JUGABLES, MODO, fecha)
  const objetivo = palabra ? normalizar(palabra.palabra) : ''

  let estado = 'jugando'
  if (intentos.includes(objetivo)) estado = 'ganada'
  else if (intentos.length >= MAX_INTENTOS) estado = 'perdida'

  const estadoLetras = mejorEstadoPorLetra(intentos, objetivo)

  const escribir = (letra) => {
    if (estado !== 'jugando') return
    setMensaje('')
    setActual((a) => (a.length < LONGITUD ? a + letra : a))
  }

  const borrar = () => {
    if (estado !== 'jugando') return
    setMensaje('')
    setActual((a) => a.slice(0, -1))
  }

  const enviar = () => {
    if (estado !== 'jugando') return
    if (actual.length < LONGITUD) {
      setMensaje(`Escribe ${LONGITUD} letras`)
      return
    }
    const nuevos = [...intentos, actual]
    setIntentos(nuevos)
    setActual('')
    setMensaje('')
    guardarJSON(claveGuardado(fecha), { intentos: nuevos })
  }

  // Solo se usa en desarrollo, para poder repetir el reto del día
  const reiniciarDev = () => {
    borrarGuardado(claveGuardado(fecha))
    setIntentos([])
    setActual('')
    setMensaje('')
  }

  // Teclado físico
  useEffect(() => {
    const alPulsar = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const destino = e.target
      // No interferir si se está escribiendo en un campo de texto
      if (destino.closest?.('input, textarea, select')) return

      if (e.key === 'Enter') {
        // Si el foco está en un botón o enlace, Enter es para activarlo
        if (destino.closest?.('button, a')) return
        e.preventDefault()
        enviar()
      } else if (e.key === 'Backspace') {
        borrar()
      } else if (e.key.length === 1) {
        const letra = normalizar(e.key)
        if (esLetra(letra)) escribir(letra)
      }
    }

    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [escribir, borrar, enviar])
useRegistrarResultado(MODO, estado, fecha)
  return {
    palabra,
    objetivo,
    intentos,
    actual,
    mensaje,
    estado,
    estadoLetras,
    maxIntentos: MAX_INTENTOS,
    escribir,
    borrar,
    enviar,
    reiniciarDev,
  }
}