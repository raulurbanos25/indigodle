import { useEffect, useState } from 'react'

// Rutas que ya sabemos que existen o que no existen (se comparten entre usos)
const RUTAS_ROTAS = new Set()
const RUTAS_OK = new Set()

// Pregunta al servidor si el archivo existe, sin descargarlo. Si el servidor no lo
// encuentra, suele devolver la página de la web (text/html), que también se descarta.
async function existeAudio(ruta) {
  try {
    const respuesta = await fetch(ruta, { method: 'HEAD' })
    const tipo = respuesta.headers.get('content-type') ?? ''
    return respuesta.ok && !tipo.includes('text/html')
  } catch {
    return false
  }
}

async function primeraRutaExistente(rutas) {
  for (const ruta of rutas) {
    if (RUTAS_ROTAS.has(ruta)) continue
    if (RUTAS_OK.has(ruta)) return ruta
    if (await existeAudio(ruta)) {
      RUTAS_OK.add(ruta)
      return ruta
    }
    RUTAS_ROTAS.add(ruta)
  }
  return null
}

// Recibe una lista de { id, rutas } y devuelve { cargando, rutas }, donde "rutas" es
// un objeto { id: rutaDelAudio } solo con los que tienen MP3.
// "elementos" debe ser siempre la misma lista (una constante fuera del componente).
export function useAudiosDisponibles(elementos) {
  const [estado, setEstado] = useState({ cargando: true, rutas: {} })

  useEffect(() => {
    let cancelado = false

    Promise.all(
      elementos.map(async (elemento) => [elemento.id, await primeraRutaExistente(elemento.rutas)]),
    ).then((pares) => {
      if (cancelado) return
      setEstado({
        cargando: false,
        rutas: Object.fromEntries(pares.filter(([, ruta]) => ruta)),
      })
    })

    return () => {
      cancelado = true
    }
  }, [elementos])

  return estado
}