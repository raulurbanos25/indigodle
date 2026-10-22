import { useEffect } from 'react'
import { useClipAudio } from '../../hooks/useClipAudio.js'
import './AudioClip.css'

// Reproductor del fragmento: botón, barra de 6 segmentos y texto.
// Los segmentos "encendidos" son los segundos que ya has desbloqueado.
// Al terminar la partida se cambia por un reproductor normal con la canción completa.
function AudioClip({ src, segundos, maxSegundos, terminado }) {
  const { barraRef, reproduciendo, error, reproducir, detener } = useClipAudio(src, maxSegundos)

  // Si la partida termina mientras suena un fragmento, se corta
  useEffect(() => {
    if (terminado) detener()
  }, [terminado, detener])

  if (terminado) {
    return (
      <div className="clip clip--final">
        <p className="clip__texto">Escucha la canción completa:</p>
        <audio className="clip__nativo" controls preload="none" src={src} />
      </div>
    )
  }

  const unidad = segundos === 1 ? 'segundo' : 'segundos'

  return (
    <div className="clip">
      <button
        type="button"
        className="clip__play"
        disabled={error}
        aria-label={reproduciendo ? 'Parar' : `Reproducir ${segundos} ${unidad}`}
        onClick={reproduciendo ? detener : () => reproducir(segundos)}
      >
        <span aria-hidden="true">{reproduciendo ? '■' : '▶'}</span>
      </button>

      <div className="clip__centro">
        <div className="clip__barra" ref={barraRef} aria-hidden="true">
          {Array.from({ length: maxSegundos }, (_, i) => (
            <span key={i} className={`clip__seg ${i < segundos ? 'clip__seg--on' : ''}`} />
          ))}
          <span className="clip__cabezal" />
        </div>
        <p className="clip__texto" role="status">
          Fragmento de {segundos} {unidad}
          {segundos < maxSegundos && ' · con cada intento, 1 segundo más'}
        </p>
      </div>

      {error && (
        <p className="clip__error" role="alert">
          No se ha podido cargar el audio.
        </p>
      )}
    </div>
  )
}

export default AudioClip