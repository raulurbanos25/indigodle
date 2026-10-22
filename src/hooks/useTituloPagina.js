import { useEffect } from 'react'

// Pone un título a la pestaña del navegador y lo restaura al salir de la página
export function useTituloPagina(titulo) {
  useEffect(() => {
    const anterior = document.title
    document.title = `${titulo} · Indigodle`
    return () => {
      document.title = anterior
    }
  }, [titulo])
}