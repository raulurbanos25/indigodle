import './GuestClues.css'

// Lista de invitados: los desbloqueados se leen, el resto aparecen como huecos.
function GuestClues({ invitados, visibles, etiqueta = 'Artistas invitados del álbum' }) {
  return (
    <ol className="clues" aria-label={etiqueta}>
      {invitados.map((nombre, i) => {
        const visible = i < visibles

        return (
          <li key={nombre} className={`clue ${visible ? 'clue--visible' : ''}`}>
            <span className="clue__num">{i + 1}</span>
            {visible ? (
              <span className="clue__name">{nombre}</span>
            ) : (
              <>
                <span aria-hidden="true">? ? ? ? ?</span>
                <span className="visually-hidden">Pista bloqueada</span>
              </>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default GuestClues