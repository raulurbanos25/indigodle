import { useReveal } from '../../hooks/useReveal.js'

// direccion: 'up' | 'left' | 'right' | 'zoom'. "delay" en milisegundos.
function Reveal({ as: Etiqueta = 'div', direccion = 'up', delay = 0, className = '', children, ...resto }) {
  const [ref, visible] = useReveal()

  return (
    <Etiqueta
      ref={ref}
      className={`reveal reveal--${direccion} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` }}
      {...resto}
    >
      {children}
    </Etiqueta>
  )
}

export default Reveal