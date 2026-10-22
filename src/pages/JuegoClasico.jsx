import { Link } from 'react-router-dom'
import { SONGS } from '../data/songs.js'
import { useGame } from '../hooks/useGame.js'
import { numeroDeReto } from '../services/dailyChallenge.js'
import { tituloAlbum, formatearDuracion } from '../models/Cancion.js'
import SongSearchInput from '../components/game/SongSearchInput.jsx'
import AttemptsTable from '../components/game/AttemptsTable.jsx'
import ResultPanel from '../components/game/ResultPanel.jsx'
import './JuegoClasico.css'

function JuegoClasico() {
  const { objetivo, intentos, intentosIds, estado, maxIntentos, responder, reiniciarDev } =
    useGame()

  const terminado = estado !== 'jugando'
  const gano = estado === 'ganada'

  return (
    <section className="page container">
      <header className="clasico__cabecera">
        <p className="clasico__etiqueta">Modo Clásico · Reto nº {numeroDeReto()}</p>
        <h1 className="clasico__titulo">¿Qué canción es?</h1>
        <p className="clasico__intro">
          Cada intento se compara con la canción secreta.{' '}
          <Link to="/como-se-juega">Cómo se juega</Link>
        </p>
      </header>

      <div className="clasico__estado">
        <span>
          Intentos: {intentos.length} / {maxIntentos}
        </span>
        {import.meta.env.DEV && (
          <button type="button" className="btn btn--ghost btn--small" onClick={reiniciarDev}>
            Reiniciar (solo desarrollo)
          </button>
        )}
      </div>

      {terminado ? (
        <ResultPanel estado={estado}>
          <p>
            {gano
              ? `Lo has conseguido en ${intentos.length} de ${maxIntentos} intentos.`
              : 'La canción secreta era:'}
          </p>
          <p>
            <strong>{objetivo.titulo}</strong> · {tituloAlbum(objetivo.albumId)} ·{' '}
            {objetivo.anio} · {formatearDuracion(objetivo.duracionSeg)}
          </p>
        </ResultPanel>
      ) : (
        <SongSearchInput
          canciones={SONGS}
          excluidas={intentosIds}
          onElegir={responder}
          placeholder="Busca una canción..."
        />
      )}

      <AttemptsTable intentos={intentos} objetivo={objetivo} />

      <p className="clasico__leyenda">
        ✔ coincide · ✖ no coincide · ↑ el valor buscado es mayor · ↓ el valor buscado es menor
      </p>
    </section>
  )
}

export default JuegoClasico
