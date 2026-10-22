import { Link } from 'react-router-dom'
import { usePalabra } from '../hooks/usePalabra.js'
import { LONGITUD } from '../models/Palabra.js'
import { numeroDeReto } from '../services/dailyChallenge.js'
import WordGrid from '../components/game/WordGrid.jsx'
import LetterKeyboard from '../components/game/LetterKeyboard.jsx'
import ResultPanel from '../components/game/ResultPanel.jsx'
import './JuegoPalabra.css'

function JuegoPalabra() {
  const {
    palabra,
    objetivo,
    intentos,
    actual,
    mensaje,
    estado,
    estadoLetras,
    maxIntentos,
    escribir,
    borrar,
    enviar,
    reiniciarDev,
  } = usePalabra()

  if (!palabra) {
    return (
      <section className="page container">
        <h1>Modo Palabra</h1>
        <p>
          Este modo necesita palabras de {LONGITUD} letras. Revisa{' '}
          <code>src/data/words.js</code>.
        </p>
        <Link to="/jugar">Volver a los modos de juego</Link>
      </section>
    )
  }

  const terminado = estado !== 'jugando'
  const gano = estado === 'ganada'

  return (
    <section className="page container">
      <header className="palabra__cabecera">
        <p className="palabra__etiqueta">Modo Palabra · Reto nº {numeroDeReto()}</p>
        <h1 className="palabra__titulo">Adivina la palabra</h1>
        <p className="palabra__intro">
          Palabra de {LONGITUD} letras, {maxIntentos} intentos.{' '}
          <Link to="/como-se-juega">Cómo se juega</Link>
        </p>
      </header>

      <div className="palabra__estado">
        <span>
          Intentos: {intentos.length} / {maxIntentos}
        </span>
        {import.meta.env.DEV && (
          <button type="button" className="btn btn--ghost btn--small" onClick={reiniciarDev}>
            Reiniciar (solo desarrollo)
          </button>
        )}
      </div>

      <p className="palabra__mensaje" role="status">
        {mensaje}
      </p>

      <WordGrid
        intentos={intentos}
        actual={actual}
        objetivo={objetivo}
        maxIntentos={maxIntentos}
        longitud={LONGITUD}
      />

      {terminado ? (
        <ResultPanel
          estado={estado}
          tituloGanada="¡Lo has adivinado!"
          tituloPerdida="Se acabaron los intentos"
        >
          <p>
            {gano ? `Lo has conseguido en ${intentos.length} de ${maxIntentos} intentos. ` : ''}
            La palabra era <strong>{palabra.palabra}</strong>.
          </p>
          <p>Origen: {palabra.origen}</p>
        </ResultPanel>
      ) : (
        <LetterKeyboard
          estadoLetras={estadoLetras}
          onLetra={escribir}
          onBorrar={borrar}
          onEnviar={enviar}
          deshabilitado={terminado}
        />
      )}
    </section>
  )
}

export default JuegoPalabra
