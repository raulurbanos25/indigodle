import { useCallback, useEffect, useState } from 'react'
import { EVENTO_HISTORIAL_ACTUALIZADO, leerHistorial } from '../services/partidas.js'

// Lee el historial y lo mantiene al día (al volver a la pestaña o si cambia en otra pestaña)
export function useEstadisticas() {
  const [historial, setHistorial] = useState(() => leerHistorial())

  const recargar = useCallback(() => {
    const nuevo = leerHistorial()
    setHistorial((anterior) =>
      JSON.stringify(anterior) === JSON.stringify(nuevo) ? anterior : nuevo,
    )
  }, [])

  useEffect(() => {
    const alVolver = () => {
      if (document.visibilityState === 'visible') recargar()
    }

    window.addEventListener('storage', recargar)
    window.addEventListener(EVENTO_HISTORIAL_ACTUALIZADO, recargar)
    window.addEventListener('focus', recargar)
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      window.removeEventListener('storage', recargar)
      window.removeEventListener(EVENTO_HISTORIAL_ACTUALIZADO, recargar)
      window.removeEventListener('focus', recargar)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [recargar])

  return { historial, recargar }
}
