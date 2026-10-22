import { useRef, useState } from 'react'
import { fechaDeHoy } from '../../services/dailyChallenge.js'
import {
  borrarHistorial,
  fusionarHistorial,
  guardarHistorial,
  leerCopia,
  leerHistorial,
} from '../../services/partidas.js'

// Descargar, cargar y borrar las estadísticas de este navegador
function DatosLocales({ alCambiar }) {
  const entradaRef = useRef(null)
  const [mensaje, setMensaje] = useState('')

  const descargar = () => {
    const copia = {
      app: 'indigodle',
      version: 1,
      exportado: fechaDeHoy(),
      historial: leerHistorial(),
    }
    const blob = new Blob([JSON.stringify(copia, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = `indigodle-estadisticas-${fechaDeHoy()}.json`
    document.body.appendChild(enlace)
    enlace.click()
    enlace.remove()
    URL.revokeObjectURL(url)
    setMensaje('Copia descargada. Guárdala en un sitio seguro.')
  }

  const cargar = async (evento) => {
    const archivo = evento.target.files?.[0]
    evento.target.value = '' // permite elegir el mismo archivo otra vez
    if (!archivo) return

    if (archivo.size > 1000000) {
      setMensaje('El archivo es demasiado grande.')
      return
    }

    const resultado = leerCopia(await archivo.text())
    if (!resultado.ok) {
      setMensaje(resultado.error)
      return
    }

    const { historial, anadidas } = fusionarHistorial(leerHistorial(), resultado.historial)
    guardarHistorial(historial)
    alCambiar()
    setMensaje(
      anadidas > 0
        ? `Se han añadido ${anadidas} ${anadidas === 1 ? 'partida' : 'partidas'}.`
        : 'No había partidas nuevas que añadir: ya las tenías todas.',
    )
  }

  const borrarTodo = () => {
    const seguro = window.confirm(
      '¿Borrar todas tus estadísticas de este navegador? No se puede deshacer.',
    )
    if (!seguro) return

    borrarHistorial()
    alCambiar()
    setMensaje('Estadísticas borradas.')
  }

  return (
    <div className="datos-locales">
      <p className="stats__nota">
        Tus estadísticas solo existen en este navegador. Descarga una copia para guardarlas o
        para llevarlas a otro ordenador. Cargar una copia añade las partidas que no tengas, sin
        tocar las que ya hay. Borrar las estadísticas no desbloquea los modos que ya has jugado
        hoy.
      </p>

      <div className="datos-locales__botones">
        <button type="button" className="btn btn--ghost btn--small" onClick={descargar}>
          <svg className="datos-locales__icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 17v3h16v-3" /></svg>
          Descargar copia
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => entradaRef.current?.click()}
        >
          <svg className="datos-locales__icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5 5 5M4 17v3h16v-3" /></svg>
          Cargar copia
        </button>
        <button type="button" className="btn btn--ghost btn--small btn--peligro" onClick={borrarTodo}>
          <svg className="datos-locales__icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m3 3v7m6-7v7" /></svg>
          Borrar estadísticas
        </button>
        <input
          ref={entradaRef}
          type="file"
          accept=".json,application/json"
          className="visually-hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={cargar}
        />
      </div>

      <p className="datos-locales__mensaje" role="status">
        {mensaje}
      </p>
    </div>
  )
}

export default DatosLocales
