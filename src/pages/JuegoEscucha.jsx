import { useState } from 'react'
import { Link } from 'react-router-dom'
import { esRespuestaCorrecta } from '../models/Respuesta.js'
import { useJuegoEscucha } from '../hooks/useJuegoEscucha.js'
import { numeroDeReto } from '../services/dailyChallenge.js'
import AudioClip from '../components/game/AudioClip.jsx'
import CaratulaCancion from '../components/game/CaratulaCancion.jsx'
import ResultPanel from '../components/game/ResultPanel.jsx'
import './JuegoEscucha.css'

const AVISOS = {
  vacio: 'Escribe el nombre de una canción.',
  repetida: 'Ya has probado esa respuesta.',
}

function JuegoEscucha() {
  const {
    cancion,
    album,
    src,
    diagnostico,
    archivos,
    archivosSinCancion,
    intentos,
    estado,
    segundos,
    maxIntentos,
    responder,
    saltar,
    reiniciarDev,
  } = useJuegoEscucha()
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState('')

  if (!cancion) {
    return (
      <section className="page container">
        <h1>Modo Escucha</h1>

        {archivos.length === 0 ? (
          <>
            <p>
              No hay ningún MP3 en <code>public/audios/</code>. Copia ahí los audios (todos
              juntos, sin carpetas) y ejecuta <code>npm run audios</code>, o para el servidor
              y vuelve a lanzar <code>npm run dev</code>.
            </p>
          </>
        ) : (
          <>
            <p>
              Hay {archivos.length} MP3 en <code>public/audios/</code>, pero ninguno coincide con
              el título de las {diagnostico.length} canciones de <code>src/data/songs.js</code>.
            </p>
            <p>Algunos archivos:</p>
            <ul className="escucha__nombres">
              {archivos.slice(0, 6).map((archivo) => (
                <li key={archivo}>
                  <code>{archivo}</code>
                </li>
              ))}
            </ul>
            <p>Algunos títulos de canciones:</p>
            <ul className="escucha__nombres">
              {diagnostico.slice(0, 6).map((d) => (
                <li key={d.id}>
                  <code>{d.titulo}</code>
                </li>
              ))}
            </ul>
            <p>
              El nombre del archivo tiene que parecerse al título (da igual mayúsculas, tildes,
              número de pista o &quot;feat.&quot;). Y la canción tiene que estar escrita en{' '}
              <code>songs.js</code>.
            </p>
          </>
        )}

        <Link to="/jugar">Volver a los modos de juego</Link>
      </section>
    )
  }

  const terminado = estado !== 'jugando'
  const gano = estado === 'ganada'
  const encontradas = diagnostico.filter((d) => d.archivo).length

  const enviar = (evento) => {
    evento.preventDefault()
    const resultado = responder(texto)
    setAviso(AVISOS[resultado] ?? '')
    if (resultado === 'ok') setTexto('')
  }

  const alSaltar = () => {
    setAviso('')
    saltar()
  }

  return (
    <section className="page container">
      <header className="escucha__cabecera">
        <p className="escucha__etiqueta">Modo Escucha · Reto nº {numeroDeReto()}</p>
        <h1 className="escucha__titulo">¿Qué canción suena?</h1>
        <p className="escucha__intro">
          Con cada intento oyes un segundo más. <Link to="/como-se-juega">Cómo se juega</Link>
        </p>
      </header>

      <div className="escucha__estado">
        <span>
          Intentos: {intentos.length} / {maxIntentos}
        </span>
        {import.meta.env.DEV && (
          <button type="button" className="btn btn--ghost btn--small" onClick={reiniciarDev}>
            Reiniciar (solo desarrollo)
          </button>
        )}
      </div>

      <AudioClip src={src} segundos={segundos} maxSegundos={maxIntentos} terminado={terminado} />

      {terminado ? (
        <ResultPanel
          estado={estado}
          tituloGanada="¡Lo has adivinado!"
          tituloPerdida="Se acabaron los intentos"
        >
          <div className="escucha__solucion">
            <CaratulaCancion cancion={cancion} album={album} />
            <div>
              <p className="escucha__solucion-texto">
                {gano
                  ? `Lo has conseguido en ${intentos.length} de ${maxIntentos} intentos.`
                  : 'La canción era:'}
              </p>
              <p className="escucha__solucion-titulo">{cancion.titulo}</p>
              <p className="escucha__solucion-datos">
                {album ? `Del álbum ${album.titulo}` : 'Single suelto'} · {cancion.anio}
                {cancion.colaboradores.length > 0 && ` · con ${cancion.colaboradores.join(', ')}`}
              </p>
            </div>
          </div>
        </ResultPanel>
      ) : (
        <form className="escucha__form" onSubmit={enviar}>
          <label htmlFor="respuesta-escucha" className="escucha__label">
            Escribe el nombre de la canción
          </label>
          <div className="escucha__campo">
            <input
              id="respuesta-escucha"
              className="escucha__input"
              type="text"
              value={texto}
              maxLength={80}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Título de la canción..."
              onChange={(e) => {
                setTexto(e.target.value)
                setAviso('')
              }}
            />
            <button type="submit" className="btn btn--primary">
              Probar
            </button>
            <button type="button" className="btn btn--ghost" onClick={alSaltar}>
              Saltar (+1 s)
            </button>
          </div>
          <p className="escucha__aviso" role="status">
            {aviso}
          </p>
        </form>
      )}

      <ol className="escucha__intentos" aria-label="Tus intentos">
        {Array.from({ length: maxIntentos }, (_, i) => {
          const intento = intentos[i]
          let clase = 'escucha__intento--vacio'
          let contenido = ''
          let lector = 'Intento sin usar'

          if (intento) {
            if (intento.tipo === 'salto') {
              clase = 'escucha__intento--salto'
              contenido = '⏭ Saltado'
              lector = 'Saltado'
            } else if (esRespuestaCorrecta(intento.texto, cancion.titulo)) {
              clase = 'escucha__intento--ok'
              contenido = intento.texto
              lector = 'Acierto'
            } else {
              clase = 'escucha__intento--ko'
              contenido = intento.texto
              lector = 'Fallo'
            }
          }

          return (
            <li key={i} className={`escucha__intento ${clase}`}>
              <span className="escucha__seg">{i + 1} s</span>
              <span className="escucha__respuesta">{contenido}</span>
              <span className="visually-hidden">{lector}</span>
            </li>
          )
        })}
      </ol>

      {/* Solo en desarrollo: qué MP3 se ha encontrado para cada canción */}
      {import.meta.env.DEV && (
        <details className="escucha__diag">
          <summary>
            Diagnóstico de audios: {encontradas} de {diagnostico.length} canciones tienen MP3
          </summary>

          <ul>
            {diagnostico.map((d) => (
              <li key={d.id} className={d.archivo ? 'escucha__diag-ok' : 'escucha__diag-ko'}>
                {d.archivo ? '✔' : '✖'} {d.titulo} ({d.tipo}) ·{' '}
                <code>{d.archivo ?? 'sin MP3'}</code>
              </li>
            ))}
          </ul>

          {archivosSinCancion.length > 0 && (
            <>
              <p className="escucha__diag-titulo">
                MP3 que no corresponden a ninguna canción de songs.js ({archivosSinCancion.length}):
              </p>
              <ul>
                {archivosSinCancion.map((archivo) => (
                  <li key={archivo}>
                    <code>{archivo}</code>
                  </li>
                ))}
              </ul>
            </>
          )}
        </details>
      )}
    </section>
  )
}

export default JuegoEscucha
