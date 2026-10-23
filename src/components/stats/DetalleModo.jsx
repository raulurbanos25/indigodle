import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GAMES } from '../../data/games.js'
import { configDe, resumenModo } from '../../services/estadisticas.js'
import GameIcon from '../game/GameIcon.jsx'

const formatoNumero = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 })

function etiquetaBarra(tipo, valor) {
  if (tipo === 'intentos') return `A la ${valor}ª`
  if (valor === 0) return 'Sin fallos'
  return `${valor} ${valor === 1 ? 'fallo' : 'fallos'}`
}

function DetalleModo({ partidas, hoy }) {
  const modos = GAMES.filter((juego) => juego.listo)
  const [elegido, setElegido] = useState(() => {
    const ultimaPartida = [...partidas].reverse().find((partida) =>
      modos.some((juego) => juego.id === partida.modo)
    )
    return ultimaPartida?.modo ?? modos[0]?.id
  })

  const modo = modos.find((juego) => juego.id === elegido) ?? modos[0]
  if (!modo) return null

  const { tipo } = configDe(modo.id)
  const resumen = resumenModo(
    partidas.filter((p) => p.modo === modo.id),
    modo.id,
    hoy,
  )

  const datos = [
    ['Partidas', resumen.jugadas],
    ['Victorias', `${resumen.ganadas} (${resumen.porcentaje}%)`],
    [tipo === 'intentos' ? 'A la primera' : 'Sin fallos', resumen.perfectas],
    [
      tipo === 'intentos' ? 'Media de intentos' : 'Media de fallos',
      resumen.media === null ? '—' : formatoNumero.format(resumen.media),
    ],
    ['Racha actual', `${resumen.racha.actual} ${resumen.racha.actual === 1 ? 'día' : 'días'}`],
    ['Mejor racha', `${resumen.racha.mejor} ${resumen.racha.mejor === 1 ? 'día' : 'días'}`],
  ]

  const maximo = Math.max(1, resumen.perdidas, ...resumen.distribucion.map((d) => d.cantidad))

  return (
    <div>
      <div className="stats__selector" role="group" aria-label="Elegir modo">
        {modos.map((juego) => (
          <button
            key={juego.id}
            type="button"
            className={`stats-chip ${juego.id === modo.id ? 'stats-chip--activo' : ''}`}
            aria-pressed={juego.id === modo.id}
            onClick={() => setElegido(juego.id)}
          >
            <GameIcon
              animado={
                juego.id === 'tracklist'
                  ? 'album-rotatorio'
                  : juego.iconoAnimado ?? juego.id
              }
            />{' '}
            {juego.titulo}
          </button>
        ))}
      </div>

      {resumen.jugadas === 0 ? (
        <p className="stats__vacio-modo">
          Todavía no has terminado ninguna partida de {modo.titulo}.{' '}
          <Link to={modo.ruta}>¡Juega ahora!</Link>
        </p>
      ) : (
        <>
          <dl className="detalle__datos">
            {datos.map(([etiqueta, valor]) => (
              <div key={etiqueta} className="dato">
                <dt>{etiqueta}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>

          {/* "key" para que las barras vuelvan a animarse al cambiar de modo */}
          <div key={modo.id}>
            <h3 className="stats__subtitulo">
              {tipo === 'intentos' ? '¿En qué intento aciertas?' : '¿Con cuántos fallos ganas?'}
            </h3>
            <ul className="histo">
              {resumen.distribucion.map((fila) => (
                <li key={fila.valor} className="histo__fila">
                  <span className="histo__etiqueta">{etiquetaBarra(tipo, fila.valor)}</span>
                  <span className="histo__barra" aria-hidden="true">
                    <span
                      className="histo__relleno"
                      style={{ '--w': `${(fila.cantidad / maximo) * 100}%` }}
                    />
                  </span>
                  <span className="histo__num">{fila.cantidad}</span>
                </li>
              ))}
              <li className="histo__fila histo__fila--perdida">
                <span className="histo__etiqueta">
                  {tipo === 'intentos' ? 'No acertadas' : 'Perdidas'}
                </span>
                <span className="histo__barra" aria-hidden="true">
                  <span
                    className="histo__relleno"
                    style={{ '--w': `${(resumen.perdidas / maximo) * 100}%` }}
                  />
                </span>
                <span className="histo__num">{resumen.perdidas}</span>
              </li>
            </ul>
            {resumen.sinDetalle > 0 && (
              <p className="stats__nota">
                {resumen.sinDetalle}{' '}
                {resumen.sinDetalle === 1 ? 'victoria anterior no tiene' : 'victorias anteriores no tienen'}{' '}
                el detalle de intentos, así que no salen en las barras.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DetalleModo
