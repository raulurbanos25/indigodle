import { useCallback, useEffect, useRef, useState } from 'react'

// Reproduce los primeros "segundos" de un audio y se detiene solo.
// "segundosTotales" es lo que representa la barra completa (el máximo de segundos).
// Devuelve "barraRef": hay que ponerlo en la barra, que recibe la variable CSS --pos (0 a 1).
export function useClipAudio(src, segundosTotales) {
  const audioRef = useRef(null)
  const barraRef = useRef(null)
  const fotogramaRef = useRef(0)
  const temporizadorRef = useRef(0)
  const alIniciarRef = useRef(null)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [error, setError] = useState(false)

  const detener = useCallback(() => {
    cancelAnimationFrame(fotogramaRef.current)
    clearTimeout(temporizadorRef.current)

    const audio = audioRef.current
    if (audio) {
      if (alIniciarRef.current) audio.removeEventListener('playing', alIniciarRef.current)
      audio.pause()
      audio.currentTime = 0
    }
    barraRef.current?.style.setProperty('--pos', '0')
    setReproduciendo(false)
  }, [])

  // Prepara el audio de la canción
  useEffect(() => {
    if (!src) return

    const audio = new Audio(src)
    audio.preload = 'auto'
    audio.addEventListener('error', () => setError(true))
    audioRef.current = audio

    return () => {
      cancelAnimationFrame(fotogramaRef.current)
      clearTimeout(temporizadorRef.current)
      audio.pause()
      audioRef.current = null
    }
  }, [src])

  const reproducir = useCallback(
    (segundos) => {
      const audio = audioRef.current
      if (!audio) return

      cancelAnimationFrame(fotogramaRef.current)
      clearTimeout(temporizadorRef.current)
      if (alIniciarRef.current) audio.removeEventListener('playing', alIniciarRef.current)

      audio.pause()
      audio.currentTime = 0
      setReproduciendo(true)

      // Red de seguridad: si la pestaña pasa a segundo plano, el navegador pausa el bucle
      // de fotogramas. Este temporizador (que empieza cuando el sonido arranca de verdad)
      // corta el fragmento igualmente, para que nunca suene la canción entera.
      const alIniciar = () => {
        clearTimeout(temporizadorRef.current)
        temporizadorRef.current = setTimeout(detener, segundos * 1000 + 300)
      }
      alIniciarRef.current = alIniciar
      audio.addEventListener('playing', alIniciar, { once: true })

      // Bucle que mueve la barra y corta el audio en el segundo exacto
      const vigilar = () => {
        const actual = audioRef.current
        if (!actual) return

        barraRef.current?.style.setProperty(
          '--pos',
          String(Math.min(1, actual.currentTime / segundosTotales)),
        )
        if (actual.currentTime >= segundos || actual.ended) {
          detener()
          return
        }
        fotogramaRef.current = requestAnimationFrame(vigilar)
      }
      fotogramaRef.current = requestAnimationFrame(vigilar)

      audio.play().catch(() => {
        detener()
        setError(true)
      })
    },
    [detener, segundosTotales],
  )

  return { barraRef, reproduciendo, error, reproducir, detener }
}