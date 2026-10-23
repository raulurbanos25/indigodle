import { useEffect, useState } from 'react'
import './GameIcon.css'

const PORTADAS_ALBUMES = [
  { nombre: 'Akelarre', ruta: '/covers/Akelarre.webp' },
  { nombre: 'La Niña', ruta: '/covers/La%20Ni%C3%B1a.webp' },
  { nombre: 'El Dragón', ruta: '/covers/El%20Dragon.webp' },
  { nombre: 'Nave Dragón', ruta: '/covers/Nave%20Dragon.webp' },
  { nombre: 'GRX', ruta: '/covers/grx.webp' },
]

function IconoAlbumes() {
  return (
    <span className="icono-albumes" aria-hidden="true">
      {PORTADAS_ALBUMES.map((album, i) => (
        <span key={album.nombre} className="icono-albumes__item" style={{ '--i': i }}>
          <img src={album.ruta} alt="" />
        </span>
      ))}
    </span>
  )
}

const PORTADAS_ROTATORIAS = [
  { nombre: 'Aquelarre', ruta: '/covers/Akelarre.webp' },
  { nombre: 'La Niña', ruta: '/covers/La%20Ni%C3%B1a.webp' },
  { nombre: 'El Dragón', ruta: '/covers/El%20Dragon.webp' },
  { nombre: 'Nave Dragón', ruta: '/covers/Nave%20Dragon.webp' },
  { nombre: 'GRX', ruta: '/covers/grx.webp' },
  { nombre: 'La Bruja, la Niña y el Dragón', ruta: '/covers/La%20Bruja%2C%20La%20Ni%C3%B1a%20y%20El%20Dragon.webp' },
]

function IconoAlbumRotatorio() {
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const temporizador = window.setInterval(() => {
      setIndice((actual) => (actual + 1) % PORTADAS_ROTATORIAS.length)
    }, 2600)
    return () => window.clearInterval(temporizador)
  }, [])

  const portada = PORTADAS_ROTATORIAS[indice]

  return (
    <span className="icono-album-rotatorio" aria-hidden="true">
      <img key={portada.ruta} src={portada.ruta} alt="" />
    </span>
  )
}

const DIBUJOS = {
  clasico: <><circle className="game-icon__ring" cx="32" cy="32" r="21"/><circle className="game-icon__ring game-icon__ring--inner" cx="32" cy="32" r="13"/><circle className="game-icon__dot" cx="32" cy="32" r="5"/><path className="game-icon__spark" d="M48 11v10m-5-5h10M12 44v8m-4-4h8"/></>,
  intruso: <><circle className="game-icon__ring" cx="28" cy="27" r="16"/><path className="game-icon__line" d="m40 39 13 13"/><path className="game-icon__spark" d="M23 25h10m-10 6h7"/></>,
  invitados: <><path className="game-icon__line" d="M11 20h42v29H11zM18 20v-5h28v5"/><path className="game-icon__face" d="M20 31c3-3 7-3 10 0l-2 10h-6zm16 0c3-3 7-3 10 0l-2 10h-6z"/><path className="game-icon__spark" d="M27 37h2m14 0h2"/></>,
  duo: <><path className="game-icon__line" d="M12 38 25 25l8 7 8-8 12 12-14 14-9-8-6 6z"/><path className="game-icon__spark" d="m25 25 5-5 8 7m-18 5 7 7m8-7 7 7"/></>,
  cronologia: <><circle className="game-icon__ring" cx="32" cy="32" r="21"/><path className="game-icon__line" d="M32 18v15l11 7"/><path className="game-icon__spark" d="M9 15h9m-9 0 4-4m-4 4 4 4"/></>,
  top10: <><path className="game-icon__line" d="M12 50h40"/><rect className="game-icon__bar game-icon__bar--a" x="17" y="35" width="8" height="15" rx="2"/><rect className="game-icon__bar game-icon__bar--b" x="28" y="26" width="8" height="24" rx="2"/><rect className="game-icon__bar game-icon__bar--c" x="39" y="15" width="8" height="35" rx="2"/><path className="game-icon__spark" d="m15 27 9-8 8 4 14-12"/></>,
  ranking: <><path className="game-icon__line" d="M12 51h40"/><rect className="game-icon__bar game-icon__bar--a" x="17" y="36" width="8" height="15" rx="2"/><rect className="game-icon__bar game-icon__bar--b" x="28" y="26" width="8" height="25" rx="2"/><rect className="game-icon__bar game-icon__bar--c" x="39" y="15" width="8" height="36" rx="2"/></>,
  palabra: <><rect className="game-icon__tile" x="12" y="13" width="17" height="17" rx="4"/><rect className="game-icon__tile" x="35" y="13" width="17" height="17" rx="4"/><rect className="game-icon__tile" x="12" y="36" width="17" height="17" rx="4"/><rect className="game-icon__tile game-icon__tile--accent" x="35" y="36" width="17" height="17" rx="4"/><path className="game-icon__line" d="M18 21h5m18 0h5m-28 23h5m18 0h5"/></>,
  portada: <><rect className="game-icon__tile" x="12" y="14" width="40" height="36" rx="5"/><circle className="game-icon__dot" cx="24" cy="25" r="4"/><path className="game-icon__line" d="m16 45 12-12 8 8 6-6 6 10"/></>,
  escucha: <><path className="game-icon__ring" d="M13 34v-4a19 19 0 0 1 38 0v4"/><rect className="game-icon__tile" x="11" y="32" width="10" height="18" rx="5"/><rect className="game-icon__tile" x="43" y="32" width="10" height="18" rx="5"/><path className="game-icon__spark" d="M31 21v5l4 3"/></>,
}

function GameIcon({ animado }) {
  if (animado === 'albumes') return <IconoAlbumes />
  if (animado === 'album-rotatorio') return <IconoAlbumRotatorio />
  const nombre = DIBUJOS[animado] ? animado : 'clasico'
  return (
    <svg className={`game-icon-svg game-icon-svg--${nombre}`} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {DIBUJOS[nombre]}
    </svg>
  )
}

export default GameIcon
