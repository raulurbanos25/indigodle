import { Link } from 'react-router-dom'
import { SONGS } from '../data/songs.js'
import { useTracklist } from '../hooks/useTracklist.js'
import { numeroDeReto } from '../services/dailyChallenge.js'
import SongSearchInput from '../components/game/SongSearchInput.jsx'
import TracklistBoard from '../components/game/TracklistBoard.jsx'
import ResultPanel from '../components/game/ResultPanel.jsx'
import AlbumCover from '../components/game/AlbumCover.jsx'
import './JuegoTracklist.css'

function JuegoTracklist() {
  const {
    album,
    pistas,
    aciertosIds,
    fallos,
    excluidasIds,
    estado,
    maxFallos,
    responder,
    rendirse,
    reiniciarDev,
  } = useTracklist()

  const terminado = estado !== 'jugando'

  return (
    <section className="page container">
      <header className="tracklist__cabecera">
        <p className="tracklist__etiqueta">Modo Tracklist · Reto nº {numeroDeReto()}</p>
        <h1 className="tracklist__titulo">Completa el álbum</h1>
        <p className="tracklist__intro">
          Escribe las canciones que crees que pertenecen a este álbum.{' '}
          <Link to="/como-se-juega">Cómo se juega</Link>
        </p>
      </header>

      <div className="tracklist__album">
        <div className="tracklist__portada">
          <AlbumCover album={album} />
        </div>
        <div>
          <h2 className="tracklist__album-titulo">{album.titulo}</h2>
          <p className="tracklist__album-datos">
            {album.anio} · {pistas.length} canciones
          </p>
        </div>
      </div>

      <div className="tracklist__estado">
        <span>
          Encontradas: {aciertosIds.length} / {pistas.length}
        </span>
        <span>
          Fallos: {fallos.length} / {maxFallos}
        </span>
        {!terminado && (
          <button type="button" className="btn btn--ghost btn--small" onClick={rendirse}>
            Rendirse
          </button>
        )}
        {import.meta.env.DEV && (
          <button type="button" className="btn btn--ghost btn--small" onClick={reiniciarDev}>
            Reiniciar (solo desarrollo)
          </button>
        )}
      </div>

      {terminado ? (
        <ResultPanel
          estado={estado}
          tituloGanada="¡Álbum completado!"
          tituloPerdida="Fin de la partida"
        >
          <p>
            Has encontrado {aciertosIds.length} de {pistas.length} canciones de{' '}
            <strong>{album.titulo}</strong>.
          </p>
        </ResultPanel>
      ) : (
        <SongSearchInput
          canciones={SONGS}
          excluidas={excluidasIds}
          onElegir={responder}
          mostrarAlbum={false}
        />
      )}

      <TracklistBoard pistas={pistas} aciertosIds={aciertosIds} revelar={terminado} />

      {fallos.length > 0 && (
        <>
          <h2 className="tracklist__subtitulo">Canciones que no son de este álbum</h2>
          <ul className="tracklist__fallos">
            {fallos.map((cancion) => (
              <li key={cancion.id} className="tracklist__fallo">
                <span aria-hidden="true">✖</span> {cancion.titulo}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default JuegoTracklist
