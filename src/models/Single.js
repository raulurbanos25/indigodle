// ¿Es un remix? Se detecta si el título incluye "remix" o "rmx",
// o si la canción tiene el campo "esRemix: true" en songs.js.
export function esRemix(cancion) {
  return cancion.esRemix === true || /\b(?:remix|rmx)\b/i.test(cancion.titulo)
}

const porTitulo = (a, b) => a.titulo.localeCompare(b.titulo, 'es')

// Formas de ordenar. "agrupaPorAnio": se muestran separados por año.
export const ORDENES = [
  {
    id: 'reciente',
    texto: 'Más recientes',
    agrupaPorAnio: true,
    comparar: (a, b) => b.anio - a.anio || porTitulo(a, b),
  },
  {
    id: 'antiguo',
    texto: 'Más antiguos',
    agrupaPorAnio: true,
    comparar: (a, b) => a.anio - b.anio || porTitulo(a, b),
  },
  {
    id: 'duracion',
    texto: 'Más duración',
    comparar: (a, b) => b.duracionSeg - a.duracionSeg || porTitulo(a, b),
  },
  {
    id: 'corta',
    texto: 'Más cortas',
    comparar: (a, b) => a.duracionSeg - b.duracionSeg || porTitulo(a, b),
  },
  {
    id: 'colabs',
    texto: 'Más colaboraciones',
    comparar: (a, b) =>
      b.colaboradores.length - a.colaboradores.length || b.anio - a.anio || porTitulo(a, b),
  },
  { id: 'az', texto: 'Alfabético (A-Z)', comparar: porTitulo },
]

// Qué singles se muestran
export const FILTROS_TIPO = [
  { id: 'todos', texto: 'Todos los singles', coincide: () => true },
  { id: 'colab', texto: 'Con colaboración', coincide: (c) => c.colaboradores.length > 0 },
  { id: 'remix', texto: 'Solo remixes', coincide: esRemix },
  { id: 'sueltas', texto: 'Solo canciones sueltas', coincide: (c) => !esRemix(c) },
]