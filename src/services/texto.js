// Quita tildes y mayúsculas para comparar textos ("Canción" y "cancion" son iguales)
export function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}