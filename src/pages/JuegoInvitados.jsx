import { Link } from 'react-router-dom'
import { ALBUMS } from '../data/albums.js'
import { useInvitados } from '../hooks/useInvitados.js'
import { numeroDeReto } from '../services/dailyChallenge.js'
import SongSearchInput from '../components/game/SongSearchInput.jsx'
import GuestClues from '../components/game/GuestClues.jsx'
import ResultPanel from '../components/game/ResultPanel.jsx'
import AlbumCover from '../components/game/AlbumCover.jsx'
import './JuegoInvitados.css'

function JuegoInvitados() {
  const {
    album,
    invitados,
    pistasVisibles,
    intentos,
    intentosIds,
    estado,
    maxIntentos,
    responder,
    reiniciarDev,
  } = useInvitados()

  if (!album) {
    return (
      <section className="page container">
        <h1>Modo Invitados</h1>
        <p>
          Este modo necesita álbumes con canciones que tengan colaboradores. Revisa el
          campo <code>colaboradores</code> en <code>src/data/songs.js</code>.
        </p>
        <Link to="/jugar">Volver a los modos de juego</Link>
      </section>
    )
  }

  const terminado = estado !== 'jugando'
  const gano = estado === 'ganada'

  return (
    <section className="page container">
      <header className="invitados__cabecera">
        <p className="invitados__etiqueta">Modo Invitados · Reto nº {numeroDeReto()}</p>
        <h1 className="invitados__titulo">¿De qué álbum son?</h1>
        <p className="invitados__intro">
          Cada fallo desvela un invitado más. <Link to="/como-se-juega">Cómo se juega</Link>
        </p>
      </header>

      <div className="invitados__estado">
        <span>
          Intentos: {intentos.length} / {maxIntentos}
        </span>
        <span>
          Pistas: {pistasVisibles} / {invitados.length}
        </span>
        {import.meta.env.DEV && (
          <button type="button" className="btn btn--ghost btn--small" onClick={reiniciarDev}>
            Reiniciar (solo desarrollo)
          </button>
        )}
      </div>

      <GuestClues invitados={invitados} visibles={pistasVisibles} />

      {terminado ? (
        <ResultPanel
          estado={estado}
          tituloGanada="¡Lo has adivinado!"
          tituloPerdida="Se acabaron los intentos"
        >
          <div className="invitados__solucion">
            <AlbumCover album={album} />
            <p>
              {gano
                ? `Has acertado en ${intentos.length} de ${maxIntentos} intentos: `
                : 'El álbum era: '}
              <strong>{album.titulo}</strong> ({album.anio})
            </p>
          </div>
        </ResultPanel>
      ) : (
        <SongSearchInput
          canciones={ALBUMS}
          excluidas={intentosIds}
          onElegir={responder}
          mostrarAlbum={false}
          etiqueta="Escribe el nombre de un álbum"
          placeholder="Busca un álbum..."
        />
      )}

      {intentos.length > 0 && (
        <>
          <h2 className="invitados__subtitulo">Tus intentos</h2>
          <ul className="invitados__intentos">
            {intentos.map((intento) => {
              const acierto = intento.id === album.id
              return (
                <li
                  key={intento.id}
                  className={`invitados__intento ${
                    acierto ? 'invitados__intento--acierto' : 'invitados__intento--fallo'
                  }`}
                >
                  <AlbumCover album={intento} />
                  <span>{intento.titulo}</span>
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

export default JuegoInvitados
