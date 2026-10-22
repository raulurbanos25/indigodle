import { useState } from 'react'
import { Link } from 'react-router-dom'
import NavMenu, { AjustesMenu } from './NavMenu.jsx'
import './Header.css'

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={cerrarMenu}>
          <span className="header__word">Indigodle</span>
        </Link>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="header__bar" />
          <span className="header__bar" />
          <span className="header__bar" />
        </button>

        <NavMenu id="menu-principal" abierto={menuAbierto} alNavegar={cerrarMenu} />
        <AjustesMenu />
      </div>
    </header>
  )
}

export default Header
