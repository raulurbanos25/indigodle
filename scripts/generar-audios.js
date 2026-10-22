// Lee los MP3 de public/audios/ y escribe la lista en src/data/audios.generated.js.
// Se ejecuta solo antes de "npm run dev" y "npm run build" (también con "npm run audios").
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const carpeta = join(raiz, 'public', 'audios')
const salida = join(raiz, 'src', 'data', 'audios.generated.js')

// Recorre la carpeta (y las subcarpetas, por si algún archivo se ha colado en una)
function listarMp3(directorio, prefijo = '') {
  const archivos = []
  for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
    const ruta = prefijo ? `${prefijo}/${entrada.name}` : entrada.name
    if (entrada.isDirectory()) {
      archivos.push(...listarMp3(join(directorio, entrada.name), ruta))
    } else if (entrada.isFile() && /\.mp3$/i.test(entrada.name)) {
      archivos.push(ruta)
    }
  }
  return archivos
}

const archivos = existsSync(carpeta)
  ? listarMp3(carpeta).sort((a, b) => a.localeCompare(b, 'es'))
  : []

const contenido =
  '// ARCHIVO GENERADO por scripts/generar-audios.js. No lo edites a mano:\n' +
  '// se vuelve a escribir cada vez que haces "npm run dev" o "npm run audios".\n' +
  `export const ARCHIVOS_AUDIO = ${JSON.stringify(archivos, null, 2)}\n`

// Solo se escribe si ha cambiado, para no recargar la web sin necesidad
const anterior = existsSync(salida) ? readFileSync(salida, 'utf8') : null
if (anterior !== contenido) {
  mkdirSync(dirname(salida), { recursive: true })
  writeFileSync(salida, contenido)
}

console.log(`[audios] ${archivos.length} MP3 encontrados en public/audios/`)
if (archivos.length === 0) {
  console.log('[audios] Aviso: no hay MP3. Copia los audios a public/audios/ y vuelve a ejecutar.')
}