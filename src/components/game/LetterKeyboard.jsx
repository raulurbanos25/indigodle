import './LetterKeyboard.css'

const FILAS = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM']

// Teclado en pantalla. Las teclas no reciben el foco: con el teclado físico
// se escribe directamente, y así Enter no se activa dos veces.
function LetterKeyboard({ estadoLetras, onLetra, onBorrar, onEnviar, deshabilitado }) {
  const tecla = (contenido, alPulsar, clase, etiqueta) => (
    <button
      key={etiqueta ?? contenido}
      type="button"
      className={clase}
      tabIndex={-1}
      aria-label={etiqueta}
      disabled={deshabilitado}
      onMouseDown={(e) => e.preventDefault()}
      onClick={alPulsar}
    >
      {contenido}
    </button>
  )

  return (
    <div className="kb" aria-label="Teclado en pantalla">
      {FILAS.map((fila, indice) => (
        <div key={fila} className="kb__row">
          {indice === 2 && tecla('Enviar', onEnviar, 'kb__key kb__key--wide', 'Enviar intento')}
          {fila.split('').map((letra) =>
            tecla(
              letra,
              () => onLetra(letra),
              `kb__key ${estadoLetras[letra] ? `kb__key--${estadoLetras[letra]}` : ''}`,
              letra,
            ),
          )}
          {indice === 2 && tecla('⌫', onBorrar, 'kb__key kb__key--wide', 'Borrar')}
        </div>
      ))}
    </div>
  )
}

export default LetterKeyboard