import { useEffect, useState } from 'react'
import { useReveal } from '../../hooks/useReveal.js'

function CountUp({ hasta, duracion = 1200 }) {
  const [ref, visible] = useReveal({ threshold: 0.5 })
  const [valor, setValor] = useState(0)

  useEffect(() => {
    if (!visible) return

    const reducir =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const total = reducir ? 0 : duracion
    const inicio = performance.now()
    let fotograma = 0

    const paso = (ahora) => {
      const t = total === 0 ? 1 : Math.min(1, Math.max(0, (ahora - inicio) / total))
      const suavizado = 1 - Math.pow(1 - t, 3) // empieza rápido y frena al final
      setValor(Math.round(hasta * suavizado))
      if (t < 1) fotograma = requestAnimationFrame(paso)
    }

    fotograma = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(fotograma)
  }, [visible, hasta, duracion])

  return <span ref={ref}>{valor}</span>
}

export default CountUp