import { useCallback, useEffect, useRef, useState } from 'react'

// Duración del fragmento que suena al pulsar ▶ (en segundos)
export const SEGUNDOS_VISTA_PREVIA = 30

// Reproduce un fragmento de una canción cada vez (al empezar otra, se corta la anterior).
// "alternar(id, src, barra)": empieza o para la canción "id". "barra" es el elemento que
// recibe la variable CSS --pos (0 a 1) con el progreso, sin volver a pintar la página.
export function useVistaPrevia() {
  const audioRef = useRef(null)
  const barraRef = useRef(null)
  const idRef = useRef(null)
  const [sonando, setSonando] = useState(null)
  const [conError, setConError] = useState(null)

  const parar = useCallback(() => {
    audioRef.current?.pause()
    audioRef.current = null
    idRef.current = null
    barraRef.current?.style.setProperty('--pos', '0')
    barraRef.current = null
    setSonando(null)
  }, [])

  const alternar = useCallback(
    (id, src, barra) => {
      if (idRef.current === id) {
        parar()
        return
      }
      parar()

      const audio = new Audio(src)
      audioRef.current = audio
      idRef.current = id
      barraRef.current = barra
      setConError(null)
      setSonando(id)

      // Los avisos de un audio anterior ya no cuentan
      const esVigente = () => audioRef.current === audio

      audio.addEventListener('timeupdate', () => {
        if (!esVigente()) return
        barra?.style.setProperty(
          '--pos',
          String(Math.min(1, audio.currentTime / SEGUNDOS_VISTA_PREVIA)),
        )
        if (audio.currentTime >= SEGUNDOS_VISTA_PREVIA) parar()
      })
      audio.addEventListener('ended', () => {
        if (esVigente()) parar()
      })
      audio.addEventListener('error', () => {
        if (!esVigente()) return
        setConError(id)
        parar()
      })
      audio.play().catch(() => {
        if (!esVigente()) return
        setConError(id)
        parar()
      })
    },
    [parar],
  )

  // Al salir de la página, se corta lo que esté sonando
  useEffect(
    () => () => {
      audioRef.current?.pause()
      audioRef.current = null
    },
    [],
  )

  return { sonando, conError, alternar }
}