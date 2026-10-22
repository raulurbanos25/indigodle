import { useEffect, useRef, useState } from 'react'

// Devuelve [ref, visible]. "visible" pasa a true cuando el elemento entra en pantalla.
export function useReveal({ threshold = 0.15 } = {}) {
  const ref = useRef(null)
  // Si el navegador no soporta IntersectionObserver, mostramos todo desde el principio
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const elemento = ref.current
    if (!elemento || typeof IntersectionObserver === 'undefined') return

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          observador.disconnect() // basta con que aparezca una vez
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    observador.observe(elemento)
    return () => observador.disconnect()
  }, [threshold])

  return [ref, visible]
}