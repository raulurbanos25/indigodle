import { useEffect, useRef, useState } from 'react'

function prefiereMenosMovimiento() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// Controla una demostración por pasos (0, 1, 2... total-1).
// Avanza sola mientras está a la vista, vuelve a empezar al terminar y se puede pausar.
// Con "reducir movimiento" no avanza sola: empieza en el último paso y se navega a mano.
export function usePasosDemo({ total, intervalo = 1500, pausaFinal = 3200 }) {
  const ref = useRef(null)
  const [reducido] = useState(prefiereMenosMovimiento)
  // Si el navegador no soporta IntersectionObserver, se considera siempre visible
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')
  const [pausado, setPausado] = useState(false)
  const [paso, setPaso] = useState(() => (prefiereMenosMovimiento() ? total - 1 : 0))

  // Solo se anima mientras la demo está en pantalla
  useEffect(() => {
    const elemento = ref.current
    if (!elemento || typeof IntersectionObserver === 'undefined') return

    const observador = new IntersectionObserver(
      ([entrada]) => setVisible(entrada.isIntersecting),
      { threshold: 0.35 },
    )
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  // Pasa al siguiente paso tras una espera (más larga en el último, para poder leerlo)
  useEffect(() => {
    if (reducido || !visible || pausado) return

    const esUltimo = paso >= total - 1
    const id = setTimeout(
      () => setPaso(esUltimo ? 0 : paso + 1),
      esUltimo ? pausaFinal : intervalo,
    )
    return () => clearTimeout(id)
  }, [reducido, visible, pausado, paso, total, intervalo, pausaFinal])

  return {
    ref,
    paso,
    reducido,
    pausado,
    alternarPausa: () => setPausado((p) => !p),
    reiniciar: () => {
      setPaso(0)
      setPausado(false)
    },
    // Al saltar a un paso a mano, se pausa para que se pueda mirar con calma
    irAPaso: (i) => {
      setPaso(i)
      setPausado(true)
    },
  }
}