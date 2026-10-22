import { useEffect, useRef, useState } from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

const EMAIL_CONTACTO = import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'raul.urbanos.esteban@gmail.com'

function Footer() {
  const [contactoAbierto, setContactoAbierto] = useState(false)
  const [borradorAbierto, setBorradorAbierto] = useState(false)
  const [enlaceGmail, setEnlaceGmail] = useState('')
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialogo = dialogRef.current
    if (!dialogo) return
    if (contactoAbierto && !dialogo.open) dialogo.showModal()
    if (!contactoAbierto && dialogo.open) dialogo.close()
  }, [contactoAbierto])

  const prepararCorreo = (evento) => {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    const concepto = String(datos.get('concepto') || '').trim()
    const mensaje = String(datos.get('mensaje') || '').trim()
    const asunto = encodeURIComponent(`Idea para mejorar Indigodle: ${concepto}`)
    const cuerpo = encodeURIComponent(`Concepto: ${concepto}\n\nMensaje:\n${mensaje}`)
    const urlGmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_CONTACTO)}&su=${asunto}&body=${cuerpo}`
    setEnlaceGmail(urlGmail)
    window.open(urlGmail, '_blank', 'noopener,noreferrer')
    setBorradorAbierto(true)
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__main">
          <div className="footer__marca">
            <Link to="/" className="footer__brand" aria-label="Indigodle, inicio">
              <span className="footer__mark" aria-hidden="true">
                <span className="footer__mark-i">I</span>
                <span className="footer__mark-d">D</span>
              </span>
              <span className="footer__brand-copy">
                <strong>Indigodle</strong>
                <small>Juega con la música</small>
              </span>
            </Link>
            <p>Escucha, recuerda y descubre el universo musical de Lola Índigo a través de juegos y retos.</p>
          </div>

          <nav className="footer__nav" aria-label="Enlaces del pie de página">
            <h2>Explora</h2>
            <Link to="/jugar">Juegos</Link>
            <Link to="/discografia">Discografía</Link>
            <Link to="/como-se-juega">Cómo se juega</Link>
          </nav>

          <div className="footer__contacto">
            <span className="footer__contacto-icon" aria-hidden="true">✉</span>
            <div>
              <h2>¿Una idea para mejorar?</h2>
              <p>Cuéntanos qué te gustaría ver en Indigodle.</p>
              <button type="button" className="footer__contacto-boton" onClick={() => {
                setBorradorAbierto(false)
                setContactoAbierto(true)
              }}>
                Enviar mensaje <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          <div className="footer__proyecto">
            <span className="footer__proyecto-icon" aria-hidden="true">✦</span>
            <div>
              <h2>Proyecto de aprendizaje social</h2>
              <p>Creado por fans para aprender y compartir.</p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© {new Date().getFullYear()} Indigodle</p>
          <p className="footer__disclaimer">Proyecto independiente y no oficial. No está afiliado a Lola Índigo, su equipo ni su discográfica.</p>
          <Link to="/" className="footer__top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            VOLVER AL INICIO <span aria-hidden="true">↑</span>
          </Link>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="footer-contacto-dialog"
        aria-labelledby="footer-contacto-titulo"
        onClose={() => setContactoAbierto(false)}
        onClick={(evento) => {
          if (evento.target === dialogRef.current) setContactoAbierto(false)
        }}
      >
        <div className="footer-contacto-dialog__inner">
          <button type="button" className="footer-contacto-dialog__cerrar" aria-label="Cerrar" onClick={() => setContactoAbierto(false)}>×</button>
          {borradorAbierto ? (
            <div className="footer-contacto-dialog__confirmacion" role="status">
              <span className="footer-contacto-dialog__marca" aria-hidden="true">✓</span>
              <h2 id="footer-contacto-titulo">Correo preparado</h2>
              <p>El borrador está dirigido a <strong>{EMAIL_CONTACTO}</strong>. Si no se abrió una pestaña de Gmail, usa el botón de abajo. Pulsa “Enviar” en Gmail para mandarlo.</p>
              <a className="footer-contacto-dialog__enviar" href={enlaceGmail} target="_blank" rel="noreferrer">Abrir borrador en Gmail <span aria-hidden="true">↗</span></a>
            </div>
          ) : (
            <>
              <p className="footer-contacto-dialog__kicker">Tu idea cuenta</p>
              <h2 id="footer-contacto-titulo">Envíanos un mensaje</h2>
              <p className="footer-contacto-dialog__intro">Cuéntanos qué mejorarías o qué te gustaría encontrar en Indigodle.</p>
              <form className="footer-contacto-dialog__form" onSubmit={prepararCorreo}>
                <label htmlFor="contacto-concepto">Concepto</label>
                <input id="contacto-concepto" name="concepto" type="text" maxLength="100" placeholder="Por ejemplo: nuevo modo de juego" required />
                <label htmlFor="contacto-mensaje">Mensaje</label>
                <textarea id="contacto-mensaje" name="mensaje" rows="5" maxLength="3000" placeholder="Escribe aquí tu idea…" required />
                <p className="footer-contacto-dialog__destino">Se enviará a {EMAIL_CONTACTO}</p>
                <p className="footer-contacto-dialog__nota">Abriremos Gmail con el mensaje preparado para que solo tengas que pulsar “Enviar”.</p>
                <button type="submit" className="footer-contacto-dialog__enviar">Abrir Gmail <span aria-hidden="true">↗</span></button>
              </form>
            </>
          )}
        </div>
      </dialog>
    </footer>
  )
}

export default Footer
