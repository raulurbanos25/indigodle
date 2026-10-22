import { useId, useState } from 'react'
import { tituloAlbum } from '../../models/Cancion.js'
import './SongSearchInput.css'

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// Buscador con autocompletado. Sirve para cualquier lista de objetos con "id" y "titulo"
// (canciones o álbumes).
function SongSearchInput({
  canciones,
  excluidas,
  onElegir,
  deshabilitado,
  mostrarAlbum = true,
  etiqueta = 'Escribe el nombre de una canción',
  placeholder = 'Busca una canción...',
}) {
  const idBase = useId()
  const [texto, setTexto] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [indiceActivo, setIndiceActivo] = useState(0)

  const buscado = normalizar(texto)
  const sugerencias = buscado
    ? canciones
        .filter(
          (c) => !excluidas.includes(c.id) && normalizar(c.titulo).includes(buscado),
        )
        .slice(0, 6)
    : []

  const mostrarLista = abierto && sugerencias.length > 0
  const sinResultados = abierto && buscado !== '' && sugerencias.length === 0

  const elegir = (cancion) => {
    onElegir(cancion.id)
    setTexto('')
    setAbierto(false)
    setIndiceActivo(0)
  }

  const manejarTeclas = (e) => {
    if (e.key === 'Escape') {
      setAbierto(false)
      return
    }
    if (!mostrarLista) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndiceActivo((i) => (i + 1) % sugerencias.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndiceActivo((i) => (i - 1 + sugerencias.length) % sugerencias.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      elegir(sugerencias[indiceActivo])
    }
  }

  return (
    <div className="song-search">
      <label htmlFor={`${idBase}-input`} className="song-search__label">
        {etiqueta}
      </label>
      <input
        id={`${idBase}-input`}
        className="song-search__input"
        type="text"
        role="combobox"
        aria-expanded={mostrarLista}
        aria-controls={`${idBase}-lista`}
        aria-autocomplete="list"
        aria-activedescendant={mostrarLista ? `${idBase}-op-${indiceActivo}` : undefined}
        autoComplete="off"
        placeholder={placeholder}
        value={texto}
        disabled={deshabilitado}
        onChange={(e) => {
          setTexto(e.target.value)
          setAbierto(true)
          setIndiceActivo(0)
        }}
        onKeyDown={manejarTeclas}
        onFocus={() => setAbierto(true)}
        onBlur={() => setAbierto(false)}
      />

      {mostrarLista && (
        <ul id={`${idBase}-lista`} role="listbox" className="song-search__list">
          {sugerencias.map((cancion, i) => (
            <li
              key={cancion.id}
              id={`${idBase}-op-${i}`}
              role="option"
              aria-selected={i === indiceActivo}
              className={`song-search__option ${
                i === indiceActivo ? 'song-search__option--activa' : ''
              }`}
              onMouseDown={(e) => {
                e.preventDefault()
                elegir(cancion)
              }}
            >
              <span>{cancion.titulo}</span>
              {mostrarAlbum && (
                <span className="song-search__album">{tituloAlbum(cancion.albumId)}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {sinResultados && <p className="song-search__empty">No hay resultados con ese nombre.</p>}
    </div>
  )
}

export default SongSearchInput