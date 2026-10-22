import { evaluarIntento } from '../../models/Palabra.js'
import './WordGrid.css'

const TEXTO_ESTADO = {
  correcta: 'letra correcta',
  presente: 'está en otro sitio',
  ausente: 'no está',
}

// Cuadrícula de intentos: filas ya jugadas, la fila que se está escribiendo y filas vacías.
function WordGrid({ intentos, actual, objetivo, maxIntentos, longitud }) {
  const filas = Array.from({ length: maxIntentos }, (_, i) => i)

  return (
    <ol className="wgrid" aria-label="Intentos">
      {filas.map((i) => {
        const intento = intentos[i]
        const esActual = i === intentos.length
        const letras = intento ?? (esActual ? actual : '')
        const evaluacion = intento ? evaluarIntento(intento, objetivo) : null

        return (
          <li key={i} className="wgrid__row">
            {Array.from({ length: longitud }, (_, j) => {
              const letra = letras[j] ?? ''
              const estado = evaluacion ? evaluacion[j] : letra ? 'escrita' : 'vacia'

              return (
                <span
                  key={j}
                  className={`tile tile--${estado}`}
                  style={evaluacion ? { animationDelay: `${j * 120}ms` } : undefined}
                >
                  {letra}
                  {evaluacion && (
                    <span className="visually-hidden">, {TEXTO_ESTADO[estado]}</span>
                  )}
                </span>
              )
            })}
          </li>
        )
      })}
    </ol>
  )
}

export default WordGrid