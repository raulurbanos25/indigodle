// Deja un nombre listo para comparar: sin tildes, en minúsculas y con solo letras y
// números separados por un espacio. "¿Qué  PASA? (Remix)" -> "que pasa remix"
export function normalizarNombre(texto) {
  return texto
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const claveCompacta = (texto) => normalizarNombre(texto).replace(/\s+/g, '')

const quitarParentesis = (t) => t.replace(/\(.*?\)|\[.*?\]/g, ' ')
const quitarNumero = (t) => t.replace(/^\s*\d{1,3}(?:\s*[-._)]\s*|\s+)/, '')
const despuesDelGuion = (t) => t.split(/\s+[-–—]\s+/).pop()
const quitarFeat = (t) => t.replace(/\s*[([]?\s*\b(?:feat|ft|featuring)\b\.?.*$/i, '')

function nombreBase(archivo) {
  const nombre = archivo.split('/').pop()
  return nombre.replace(/\.mp3$/i, '')
}

// Algunos archivos usan un nombre alternativo para la misma canción.
// Las claves compactas ignoran espacios, guiones, tildes y mayúsculas.
const ALIAS_AUDIO = new Map([
  [claveCompacta('Autoestima (RMX)'), claveCompacta('Cupido (RMX)')],
  [claveCompacta('INTRO BRUJA - Live'), claveCompacta('INTRO LA BRUJA - Live')],
])

// Formas de escribir un título que valen como exactas
function clavesDeTitulo(titulo) {
  return [
    ...new Set([normalizarNombre(titulo), normalizarNombre(quitarParentesis(titulo))]),
  ].filter(Boolean)
}

// Formas exactas de un archivo
function clavesExactas(archivo) {
  const base = nombreBase(archivo)
  return [
    ...new Set([normalizarNombre(base), normalizarNombre(quitarParentesis(base))]),
  ].filter(Boolean)
}

// Formas más tolerantes: va quitando número de pista, "Artista - ", "feat. X" y paréntesis
function clavesFlexibles(archivo) {
  let texto = nombreBase(archivo)
  const claves = []
  for (const paso of [quitarNumero, despuesDelGuion, quitarFeat, quitarParentesis]) {
    texto = paso(texto)
    claves.push(normalizarNombre(texto))
  }
  return [...new Set(claves)].filter(Boolean)
}

// Busca, entre los archivos de public/audios/, el MP3 de una canción. Devuelve la ruta
// relativa del archivo (o null). Primero busca coincidencias exactas y, si no hay, tolerantes.
export function encontrarArchivoDeAudio(cancion, archivos) {
  const claveCompleta = claveCompacta(cancion.titulo)
  if (!claveCompleta) return null

  // Prioriza el título completo para no asignar, por ejemplo,
  // el remix de Ya No Quiero Ná al audio de la versión original.
  const coincidenciaCompleta = archivos.find(
    (archivo) => claveCompacta(nombreBase(archivo)) === claveCompleta,
  )
  if (coincidenciaCompleta) return coincidenciaCompleta

  const claveAlias = ALIAS_AUDIO.get(claveCompleta)
  if (claveAlias) {
    const coincidenciaAlias = archivos.find(
      (archivo) => claveCompacta(nombreBase(archivo)) === claveAlias,
    )
    if (coincidenciaAlias) return coincidenciaAlias
  }

  const claveSinParentesis = claveCompacta(quitarParentesis(cancion.titulo))
  if (!claveSinParentesis) return null

  // Resuelve títulos que omiten un subtítulo entre paréntesis, como KILLA (ring ring).
  const coincidenciaSinParentesis = archivos.find(
    (archivo) => claveCompacta(quitarParentesis(nombreBase(archivo))) === claveSinParentesis,
  )
  if (coincidenciaSinParentesis) return coincidenciaSinParentesis

  const claves = [...new Set([claveCompleta, claveSinParentesis])]
  const exacto = archivos.find((archivo) =>
    clavesExactas(archivo).some((clave) => claves.includes(claveCompacta(clave))),
  )
  if (exacto) return exacto

  return archivos.find((archivo) =>
    clavesFlexibles(archivo).some((clave) => claves.includes(claveCompacta(clave))),
  ) ?? null
}

// "Carpeta/Mi canción.mp3" -> "/audios/Carpeta/Mi%20canci%C3%B3n.mp3"
export function urlDeAudio(archivo) {
  return `/audios/${archivo.split('/').map(encodeURIComponent).join('/')}`
}
