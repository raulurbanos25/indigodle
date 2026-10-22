import { useEffect, useState } from 'react'

const CLAVE_TRANSICION_ERA = 'indigodle-transicion-era'

export function guardarTransicionEra(color) {
  try {
    window.sessionStorage.setItem(CLAVE_TRANSICION_ERA, color)
  } catch {
    // La transición sigue funcionando aunque el navegador bloquee sessionStorage.
  }
}

export function useTransicionEraEntrada() {
  const [color, setColor] = useState(() => {
    try {
      return window.sessionStorage.getItem(CLAVE_TRANSICION_ERA)
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!color) return undefined

    try {
      window.sessionStorage.removeItem(CLAVE_TRANSICION_ERA)
    } catch {
      // No hace falta persistir el estado una vez iniciada la entrada.
    }

    const temporizador = window.setTimeout(() => setColor(null), 1600)
    return () => window.clearTimeout(temporizador)
  }, [color])

  return color
}
