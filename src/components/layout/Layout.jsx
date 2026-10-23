import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Header />
      <main id="contenido" className="layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
