import { useCommunity } from '../../contexts/CommunityContext.jsx'
import './CommunityPanel.css'

const formato = new Intl.NumberFormat('es-ES')

function CommunityPanel() {
  const { visits, likes, liked, ready, error, liking, darMeGusta } = useCommunity()

  return (
    <section className="community container" aria-label="Comunidad Indigodle">
      <div className="community__panel">
        <div className="community__copy">
          <p className="community__kicker">La comunidad</p>
          <h2>Indigodle crece contigo</h2>
          <p>Vuelve para jugar y deja tu me gusta una vez por cada visita.</p>
        </div>
        <div className="community__stats" aria-live="polite">
          <div className="community__stat">
            <span className="community__icon community__icon--visits" aria-hidden="true" />
            <span><strong>{ready ? formato.format(visits) : '—'}</strong><small>visitas</small></span>
          </div>
          <div className="community__stat">
            <span className="community__icon community__icon--likes" aria-hidden="true">♥</span>
            <span><strong>{ready ? formato.format(likes) : '—'}</strong><small>me gusta</small></span>
          </div>
          <button type="button" className="community__like" onClick={darMeGusta} disabled={!ready || error || liked || liking} aria-pressed={liked}>
            <span aria-hidden="true">{liked ? '♥' : '♡'}</span>
            {liked ? 'Gracias por tu me gusta' : liking ? 'Guardando…' : 'Me gusta'}
          </button>
        </div>
        {error && <p className="community__error" role="status">El contador estará disponible cuando la web esté conectada a su servidor.</p>}
      </div>
    </section>
  )
}

export default CommunityPanel
