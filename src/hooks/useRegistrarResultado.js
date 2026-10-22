import { useEffect } from 'react'
import { registrarResultado } from '../services/partidas.js'

// Lo usa cada modo de juego para anotar en el registro común si ya ha terminado
// y cuántos intentos (o fallos) le llevó. "estado" a null = todavía no se sabe.
export function useRegistrarResultado(modo, estado, fecha, intentos = null) {
  useEffect(() => {
    if (!estado) return
    registrarResultado(modo, estado, fecha, intentos)
  }, [modo, estado, fecha, intentos])
}