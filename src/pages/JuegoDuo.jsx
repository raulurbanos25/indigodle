import { Link } from 'react-router-dom'
import { todosLosInvitados } from '../models/Invitado.js'
import { useDuo } from '../hooks/useDuo.js'
import { numeroDeReto } from '../services/dailyChallenge.js'
import SongSearchInput from '../components/game/SongSearchInput.jsx'
import GuestClues from '../components/game/GuestClues.jsx'
import ResultPanel from '../components/game/ResultPanel.jsx'
import './JuegoDuo.css'

// La lista de artistas no cambia mientras la web está abierta
const INVITADOS = todosLosInvitados()

function JuegoDuo() {
  const {
    cancion,
    pistas,
    pistasVisibles,
    intentos,
    esAcierto,
    estado,
    maxIntentos,
    responder,
    reiniciarDev,
  } = useDuo()

  if (!cancion) {
    return (
      <section className="page container">
        <h1>Modo Dúo</h1>
        <p>
          Este modo necesita canciones con colaboradores. Revisa el campo{' '}
          <code>colaboradores</code> en <code>src/data/songs.js</code>.
        </p>
        <Link to="/jugar">Volver a los modos de juego</Link>
      </section>
    )
  }

  const terminado = estado !== 'jugando'
  const gano = estado === 'ganada'

  return (
    <section className="page container">
      <header className="duo__cabecera">
        <p className="duo__etiqueta">Modo Dúo · Reto nº {numeroDeReto()}</p>
        <h1 className="duo__titulo">¿Quién colabora?</h1>
        <p className="duo__intro">
          Adivina un artista invitado de esta canción.{' '}
          <Link to="/como-se-juega">Cómo se juega</Link>
        </p>
      </header>

      <div className="duo__cancion">
        <span className="duo__icono" aria-hidden="true">
          🎵
        </span>
        <div>
          <p className="duo__cancion-etiqueta">Canción de hoy</p>
          <h2 className="duo__cancion-titulo">{cancion.titulo}</h2>
        </div>
      </div>

      <div className="duo__estado">
        <span>
          Intentos: {intentos.length} / {maxIntentos}
        </span>
        <span>
          Pistas: {pistasVisibles} / {pistas.length}
        </span>
        {import.meta.env.DEV && (
          <button type="button" className="btn btn--ghost btn--small" onClick={reiniciarDev}>
            Reiniciar (solo desarrollo)
          </button>
        )}
      </div>

      <GuestClues invitados={pistas} visibles={pistasVisibles} etiqueta="Pistas de la canción" />

      {terminado ? (
        <ResultPanel
          estado={estado}
          tituloGanada="¡Lo has adivinado!"
          tituloPerdida="Se acabaron los intentos"
        >
          <p>
            {gano ? `Has acertado en ${intentos.length} de ${maxIntentos} intentos. ` : ''}
            <strong>{cancion.titulo}</strong> es una colaboración con{' '}
            <strong>{cancion.colaboradores.join(', ')}</strong>.
          </p>
        </ResultPanel>
      ) : (
        <SongSearchInput
          canciones={INVITADOS}
          excluidas={intentos}
          onElegir={responder}
          mostrarAlbum={false}
          etiqueta="Escribe el nombre de un artista"
          placeholder="Busca un artista..."
        />
      )}

      {intentos.length > 0 && (
        <>
          <h2 className="duo__subtitulo">Tus intentos</h2>
          <ul className="duo__intentos">
            {intentos.map((nombre) => {
              const acierto = esAcierto(nombre)
              return (
                <li
                  key={nombre}
                  className={`duo__intento ${
                    acierto ? 'duo__intento--acierto' : 'duo__intento--fallo'
                  }`}
                >
                  <span>{nombre}</span>
                  <span className="visually-hidden">{acierto ? 'Acierto' : 'Fallo'}</span>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}

export default JuegoDuo
