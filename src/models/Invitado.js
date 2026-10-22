import { SONGS } from '../data/songs.js'

// Lista de todos los artistas invitados (sin repetir), para el buscador.
// Usamos { id, titulo } porque es lo que espera el componente de búsqueda.
export function todosLosInvitados() {
  const nombres = [...new Set(SONGS.flatMap((c) => c.colaboradores))]
  return nombres.sort((a, b) => a.localeCompare(b, 'es')).map((n) => ({ id: n, titulo: n }))
}