import { useEffect, useState } from 'react'
import {
  rutasDePortada,
  rutasDeDisco,
  rutasDeCancion,
  slugificar,
} from '../models/Album.js'

// Rutas que ya sabemos que no existen o que ya cargaron bien.
// Se comparten entre todos los componentes para no repetir peticiones.
const RUTAS_ROTAS = new Set()
const RUTAS_CARGADAS = new Set()
// Álbumes de los que ya hemos avisado por consola (solo en desarrollo)
const AVISADOS = new Set()

function avisarSinDisco(album, rutas) {
  const quedanRutas = rutas.some((ruta) => !RUTAS_ROTAS.has(ruta))
  if (quedanRutas || AVISADOS.has(album.id)) return

  AVISADOS.add(album.id)
  console.warn(
    `[Discos] No encuentro el disco de "${album.titulo}". Pon una imagen en public/discos/ ` +
      `llamada "${album.titulo}.png" o "${slugificar(album.titulo)}.png" ` +
      `(o define discoUrl en src/data/albums.js).`,
  )
}

function rutasSegunTipo(elemento, tipo) {
  if (tipo === 'disco') return rutasDeDisco(elemento)
  if (tipo === 'cancion') return rutasDeCancion(elemento)
  return rutasDePortada(elemento)
}

// Devuelve:
//  - src: la primera ruta que no haya fallado
//  - cargada: true cuando esa imagen ya se cargó bien (sirve para ocultar el dibujo de relleno)
//  - alCargar / alFallar: los manejadores que hay que poner en el <img>
function useImagen(elemento, tipo) {
  const [, setVersion] = useState(0)

  if (!elemento) {
    return { src: null, cargada: false, alCargar: () => {}, alFallar: () => {} }
  }

  const rutas = rutasSegunTipo(elemento, tipo)
  const src = rutas.find((ruta) => !RUTAS_ROTAS.has(ruta)) ?? null

  const alFallar = () => {
    if (!src) return
    RUTAS_ROTAS.add(src)
    if (import.meta.env.DEV && tipo === 'disco') avisarSinDisco(elemento, rutas)
    setVersion((v) => v + 1) // fuerza un nuevo intento con la siguiente ruta
  }

  const alCargar = () => {
    if (!src || RUTAS_CARGADAS.has(src)) return
    RUTAS_CARGADAS.add(src)
    setVersion((v) => v + 1)
  }

  return { src, cargada: src !== null && RUTAS_CARGADAS.has(src), alCargar, alFallar }
}

// Caja del álbum (public/albumes/)
export function usePortada(album) {
  return useImagen(album, 'portada')
}

// Disco que sale de la caja (public/discos/)
export function useDisco(album) {
  return useImagen(album, 'disco')
}

// Disco de un single suelto (public/portadas/)
export function useImagenCancion(cancion) {
  return useImagen(cancion, 'cancion')
}

// ---------- Comprobar qué elementos tienen imagen (lo usa el modo Portada) ----------

function probarImagen(src) {
  return new Promise((resolve) => {
    const imagen = new Image()
    imagen.onload = () => resolve(true)
    imagen.onerror = () => resolve(false)
    imagen.src = src
  })
}

// Devuelve la primera ruta de la lista que exista de verdad, o null si no hay ninguna.
export async function buscarPrimeraRuta(rutas) {
  for (const ruta of rutas) {
    if (RUTAS_ROTAS.has(ruta)) continue
    if (RUTAS_CARGADAS.has(ruta)) return ruta
    if (await probarImagen(ruta)) {
      RUTAS_CARGADAS.add(ruta)
      return ruta
    }
    RUTAS_ROTAS.add(ruta)
  }
  return null
}

// Recibe una lista de elementos con { id, rutas } y devuelve { cargando, rutas },
// donde "rutas" es un objeto { id: rutaDeLaImagen } solo con los que tienen imagen.
// "elementos" debe ser siempre la misma lista (una constante fuera del componente).
export function useRutasDisponibles(elementos) {
  const [estado, setEstado] = useState({ cargando: true, rutas: {} })

  useEffect(() => {
    let cancelado = false

    Promise.all(
      elementos.map(async (elemento) => [elemento.id, await buscarPrimeraRuta(elemento.rutas)]),
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