import { Link } from 'react-router-dom'
import { slugificar } from '../models/Album.js'
import { useJuegoPortada, ELEMENTOS_PORTADA } from '../hooks/useJuegoPortada.js'
import { numeroDeReto } from '../services/dailyChallenge.js'
import SongSearchInput from '../components/game/SongSearchInput.jsx'
import CoverReveal from '../components/game/CoverReveal.jsx'
import ResultPanel from '../components/game/ResultPanel.jsx'
import AlbumCover from '../components/game/AlbumCover.jsx'
import './JuegoPortada.css'

const NOMBRE_TIPO = { album: 'Álbum', single: 'Single' }

function JuegoPortada() {
  const {
    cargando,
    objetivo,
    src,
    rutas,
    origen,
    intentos,
    intentosIds,
    estado,
    nivel,
    maxIntentos,
    responder,
    reiniciarDev,
  } = useJuegoPortada()

  if (cargando) {
    return (
      <section className="page container">
        <h1>Modo Portada</h1>
        <p role="status">Buscando portadas...</p>
      </section>
    )
  }

  if (!objetivo) {
    return (
      <section className="page container">
        <h1>Modo Portada</h1>
        <p>
          Este modo necesita imágenes. Pon al menos una, con el nombre del álbum o del single,
          en la carpeta que corresponda:
        </p>
        <ul className="portada__nombres">
          {ELEMENTOS_PORTADA.map((elemento) => (
            <li key={elemento.id}>
              <strong>{NOMBRE_TIPO[elemento.tipo]}:</strong>{' '}
              <code>
                public/{elemento.carpeta}/{elemento.titulo}.{elemento.extension}
              </code>{' '}
              o{' '}
              <code>
                {slugificar(elemento.titulo)}.{elemento.extension}
              </code>
            </li>
          ))}
        </ul>
        <p>También valen .jpg, .jpeg, .png y .webp. Después recarga la página con Ctrl+F5.</p>
        <Link to="/jugar">Volver a los modos de juego</Link>
      </section>
    )
  }

  const terminado = estado !== 'jugando'
  const gano = estado === 'ganada'

  return (
    <section className="page container">
      <header className="portada__cabecera">
        <p className="portada__etiqueta">Modo Portada · Reto nº {numeroDeReto()}</p>
        <h1 className="portada__titulo">¿De qué álbum o single es?</h1>
        <p className="portada__intro">
          Cada fallo hace la portada más nítida. <Link to="/como-se-juega">Cómo se juega</Link>
        </p>
      </header>

      <div className="portada__estado">
        <span>
          Intentos: {intentos.length} / {maxIntentos}
        </span>
        {import.meta.env.DEV && (
          <button type="button" className="btn btn--ghost btn--small" onClick={reiniciarDev}>
            Reiniciar (solo desarrollo)
          </button>
        )}
      </div>

      <CoverReveal
        src={src}
        nivel={nivel}
        estado={estado}
        titulo={objetivo.titulo}
        origen={origen}
      />

      {terminado ? (
        <ResultPanel
          estado={estado}
          tituloGanada="¡Lo has adivinado!"
          tituloPerdida="Se acabaron los intentos"
        >
          <p>
            {gano
              ? `Has acertado en ${intentos.length} de ${maxIntentos} intentos: `
              : `Era ${objetivo.tipo === 'album' ? 'el álbum' : 'el single'}: `}
            <strong>{objetivo.titulo}</strong> ({objetivo.anio})
          </p>
        </ResultPanel>
      ) : (
        <SongSearchInput
          canciones={ELEMENTOS_PORTADA}
          excluidas={intentosIds}
          onElegir={responder}
          mostrarAlbum={false}
          etiqueta="Escribe el nombre de un álbum o single"
          placeholder="Busca un álbum o single..."
        />
      )}

      {intentos.length > 0 && (
        <>
          <h2 className="portada__subtitulo">Tus intentos</h2>
          <ul className="portada__intentos">
            {intentos.map((intento) => {
              const acierto = intento.id === objetivo.id
              return (
                <li
                  key={intento.id}
                  className={`portada__intento ${
                    acierto ? 'portada__intento--acierto' : 'portada__intento--fallo'
                  }`}
                >
                  <AlbumCover
                    album={null}
                    rutaFija={rutas[intento.id] ?? null}
                    icono={intento.tipo === 'album' ? '💿' : '🎵'}
                  />
                  <span>{intento.titulo}</span>
                  <span className="portada__tipo">{NOMBRE_TIPO[intento.tipo]}</span>
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

export default JuegoPortada
