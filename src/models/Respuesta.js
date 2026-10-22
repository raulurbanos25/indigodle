// Deja un texto "limpio" para compararlo: sin tildes, sin mayúsculas, sin signos
// y con un solo espacio entre palabras. "¿Qué  PASA?" -> "que pasa"
export function normalizarRespuesta(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ¿La respuesta coincide con el título? También vale el título sin lo que va
// entre paréntesis o corchetes, por ejemplo "Mala (con X)" se acepta como "Mala".
export function esRespuestaCorrecta(respuesta, titulo) {
  const buscada = normalizarRespuesta(respuesta)
  if (!buscada) return false

  const validas = [
    normalizarRespuesta(titulo),
    normalizarRespuesta(titulo.replace(/\(.*?\)|\[.*?\]/g, '')),
  ]
  return validas.includes(buscada)
}