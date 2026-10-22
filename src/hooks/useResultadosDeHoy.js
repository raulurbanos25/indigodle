import { useEffect, useState } from 'react'
import { resultadosDeHoy } from '../services/partidas.js'

// Devuelve { modoId: 'ganada' | 'perdida' } con los modos ya terminados hoy.
// Se actualiza al volver a la pestaña, si cambia en otra pestaña y cada 30 segundos
// (así se desbloquean solos al pasar la medianoche).
export function useResultadosDeHoy() {
  const [resultados, setResultados] = useState(() => resultadosDeHoy())

  useEffect(() => {
    const actualizar = () => {
      const nuevos = resultadosDeHoy()
      setResultados((anteriores) =>
        JSON.stringify(anteriores) === JSON.stringify(nuevos) ? anteriores : nuevos,
      )
    }
    const alVolver = () => {
      if (document.visibilityState === 'visible') actualizar()
    }

    window.addEventListener('storage', actualizar)
    window.addEventListener('focus', actualizar)
    document.addEventListener('visibilitychange', alVolver)
    const id = setInterval(actualizar, 30000)

    return () => {
      window.removeEventListener('storage', actualizar)
      window.removeEventListener('focus', actualizar)
      document.removeEventListener('visibilitychange', alVolver)
      clearInterval(id)
    }
  }, [])

  return resultados
}