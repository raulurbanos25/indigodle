import { useEffect } from 'react'

function reducirMovimiento() {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// Ejecuta "actualizar" como mucho una vez por fotograma mientras se hace scroll
function alHacerScroll(actualizar) {
  let fotograma = 0

  const pedir = () => {
    if (fotograma) return
    fotograma = requestAnimationFrame(() => {
      fotograma = 0
      actualizar()
    })
  }

  window.addEventListener('scroll', pedir, { passive: true })
  window.addEventListener('resize', pedir)
  actualizar()

  return () => {
    window.removeEventListener('scroll', pedir)
    window.removeEventListener('resize', pedir)
    cancelAnimationFrame(fotograma)
  }
}

// --progress (0 a 1): cuánto se ha recorrido de un elemento (para la línea de pasos)
export function useScrollProgress(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reducirMovimiento()) {
      el.style.setProperty('--progress', '1')
      return
    }

    return alHacerScroll(() => {
      const caja = el.getBoundingClientRect()
      const p = (window.innerHeight * 0.65 - caja.top) / caja.height
      el.style.setProperty('--progress', Math.min(1, Math.max(0, p)).toFixed(3))
    })
  }, [ref])
}

// --scroll-y (píxeles): para el efecto parallax del hero
export function useParallax(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || reducirMovimiento()) return

    return alHacerScroll(() => {
      el.style.setProperty('--scroll-y', String(Math.min(window.scrollY, 900)))
    })
  }, [ref])
}

// --page-progress (0 a 1): cuánto se ha recorrido de toda la página
export function usePageProgress(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    return alHacerScroll(() => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const p = total > 0 ? window.scrollY / total : 0
      el.style.setProperty('--page-progress', Math.min(1, Math.max(0, p)).toFixed(3))
    })
  }, [ref])
}