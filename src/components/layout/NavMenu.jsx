import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useCommunity } from '../../contexts/CommunityContext.jsx'

const CLAVE_AJUSTES = 'indigodle-ajustes'

export function AjustesMenu() {
  const [abierto, setAbierto] = useState(false)
  const [zoom, setZoom] = useState(() => localStorage.getItem(CLAVE_AJUSTES + '-zoom') || '100')
  const [letra, setLetra] = useState(() => localStorage.getItem(CLAVE_AJUSTES + '-letra') || '100')
  const [reducirMovimiento, setReducirMovimiento] = useState(() => localStorage.getItem(CLAVE_AJUSTES + '-movimiento') === 'true')
  const [altoContraste, setAltoContraste] = useState(() => localStorage.getItem(CLAVE_AJUSTES + '-contraste') === 'true')
  const [espaciado, setEspaciado] = useState(() => localStorage.getItem(CLAVE_AJUSTES + '-espaciado') || 'normal')
  const contenedorRef = useRef(null)

  useEffect(() => {
    const factorZoom = Number(zoom) / 100
    const anchoFondo = Math.max(1, 1 / factorZoom) * 100
    document.documentElement.style.zoom = `${zoom}%`
    document.documentElement.style.setProperty('--settings-bg-width', `${anchoFondo}vw`)
    localStorage.setItem(CLAVE_AJUSTES + '-zoom', zoom)
  }, [zoom])

  useEffect(() => {
    document.documentElement.style.fontSize = `${letra}%`
    localStorage.setItem(CLAVE_AJUSTES + '-letra', letra)
  }, [letra])

  useEffect(() => {
    document.documentElement.classList.toggle('ajuste-reducir-movimiento', reducirMovimiento)
    localStorage.setItem(CLAVE_AJUSTES + '-movimiento', String(reducirMovimiento))
  }, [reducirMovimiento])

  useEffect(() => {
    document.documentElement.classList.toggle('ajuste-alto-contraste', altoContraste)
    localStorage.setItem(CLAVE_AJUSTES + '-contraste', String(altoContraste))
  }, [altoContraste])

  useEffect(() => {
    document.documentElement.classList.toggle('ajuste-texto-amplio', espaciado === 'amplio')
    localStorage.setItem(CLAVE_AJUSTES + '-espaciado', espaciado)
  }, [espaciado])

  useEffect(() => {
    document.documentElement.style.removeProperty('--color-primary')
    document.documentElement.style.removeProperty('--color-accent')
    document.documentElement.style.removeProperty('--ui-shell-color')
    document.documentElement.style.removeProperty('--ui-accent-glow')
    ;['principal', 'secundario', 'fondo', 'brillo'].forEach((clave) => {
      localStorage.removeItem(`${CLAVE_AJUSTES}-${clave}`)
    })
  }, [])

  useEffect(() => {
    if (!abierto) return undefined

    const cerrarFuera = (evento) => {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target)) setAbierto(false)
    }
    const cerrarEscape = (evento) => {
      if (evento.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('pointerdown', cerrarFuera)
    document.addEventListener('keydown', cerrarEscape)
    return () => {
      document.removeEventListener('pointerdown', cerrarFuera)
      document.removeEventListener('keydown', cerrarEscape)
    }
  }, [abierto])

  return (
    <div className="nav-ajustes" ref={contenedorRef}>
      <button type="button" className="nav-ajustes__boton" aria-label={abierto ? 'Cerrar ajustes' : 'Abrir ajustes'} aria-expanded={abierto}
        aria-controls="panel-ajustes" onClick={() => setAbierto((valor) => !valor)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.4 13a7.7 7.7 0 0 0 0-2l2-1.5-2-3.4-2.4 1a7.4 7.4 0 0 0-1.7-1L15 3.5H9l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7.7 7.7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.4 7.4 0 0 0 1.7 1L9 21.5h6l.4-2.6a7.4 7.4 0 0 0 1.7-1l2.4 1 2-3.4-2.1-1.5Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      {abierto && (
        <section className="nav-ajustes__panel" id="panel-ajustes" role="dialog" aria-labelledby="panel-ajustes-titulo">
          <header className="nav-ajustes__cabecera">
            <div>
              <p>Personaliza tu experiencia</p>
              <h2 id="panel-ajustes-titulo">Ajustes</h2>
            </div>
            <button type="button" className="nav-ajustes__cerrar" aria-label="Cerrar ajustes" onClick={() => setAbierto(false)}>×</button>
          </header>
          <label htmlFor="ajuste-zoom">Zoom de pantalla</label>
          <select id="ajuste-zoom" value={zoom} onChange={(evento) => setZoom(evento.target.value)}>
            {[75, 90, 100, 110].map((valor) => <option key={valor} value={valor}>{valor}%</option>)}
          </select>
          <label htmlFor="ajuste-letra">Tamaño de letra</label>
          <select id="ajuste-letra" value={letra} onChange={(evento) => setLetra(evento.target.value)}>
            {[90, 100, 110, 120].map((valor) => <option key={valor} value={valor}>{valor}%</option>)}
          </select>
          <label htmlFor="ajuste-espaciado">Espaciado de texto</label>
          <select id="ajuste-espaciado" value={espaciado} onChange={(evento) => setEspaciado(evento.target.value)}>
            <option value="normal">Normal</option>
            <option value="amplio">Amplio</option>
          </select>
          <div className="nav-ajustes__opcion">
            <label htmlFor="ajuste-contraste">Alto contraste</label>
            <input id="ajuste-contraste" type="checkbox" checked={altoContraste} onChange={(evento) => setAltoContraste(evento.target.checked)} />
          </div>
          <div className="nav-ajustes__opcion">
            <label htmlFor="ajuste-movimiento">Reducir animaciones</label>
            <input id="ajuste-movimiento" type="checkbox" checked={reducirMovimiento} onChange={(evento) => setReducirMovimiento(evento.target.checked)} />
          </div>
          <button type="button" className="nav-ajustes__restablecer" onClick={() => {
            setZoom('100')
            setLetra('100')
            setEspaciado('normal')
            setAltoContraste(false)
            setReducirMovimiento(false)
          }}>
            Restablecer
          </button>
        </section>
      )}
    </div>
  )
}

const ENLACES = [
  { to: '/', texto: 'Inicio', end: true },
  { to: '/jugar', texto: 'Jugar' },
  { to: '/discografia', texto: 'Discografía' },
  { to: '/estadisticas', texto: 'Estadísticas' },
  { to: '/como-se-juega', texto: 'Cómo se juega' },
]

const formato = new Intl.NumberFormat('es-ES')

function ComunidadNav() {
  const { visits, likes, liked, ready, error, liking, darMeGusta } = useCommunity()

  return (
    <li className="nav-comunidad" aria-label="Contador de la comunidad">
      <span className="nav-comunidad__visitas" title="Visitas">
        <span className="nav-comunidad__eye" aria-hidden="true" />
        <span className="nav-comunidad__sr">Visitas</span>
        {ready ? formato.format(visits) : '—'}
      </span>
      <button
        type="button"
        className="nav-comunidad__like"
        onClick={darMeGusta}
        disabled={!ready || error || liked || liking}
        aria-pressed={liked}
        aria-label={liked ? `Ya diste me gusta. ${ready ? formato.format(likes) : ''} me gusta` : `Dar me gusta. ${ready ? formato.format(likes) : ''} me gusta`}
        title={liked ? 'Gracias por tu me gusta' : 'Me gusta'}
      >
        <span aria-hidden="true">{liked ? '♥' : '♡'}</span>
        <span>{ready ? formato.format(likes) : '—'}</span>
      </button>
    </li>
  )
}

function NavMenu({ id, abierto, alNavegar }) {
  return (
    <nav
      id={id}
      className={`nav ${abierto ? 'nav--abierto' : ''}`}
      aria-label="Principal"
    >
      <ul className="nav__lista">
        {ENLACES.map((enlace) => (
          <li key={enlace.to}>
            <NavLink
              to={enlace.to}
              end={enlace.end}
              onClick={alNavegar}
              className={({ isActive }) =>
                isActive ? 'nav__link nav__link--activo' : 'nav__link'
              }
            >
              {enlace.texto}
            </NavLink>
          </li>
        ))}
        <ComunidadNav />
      </ul>
    </nav>
  )
}

export default NavMenu
