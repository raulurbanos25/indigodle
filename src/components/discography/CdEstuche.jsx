import { useImagenCancion } from '../../hooks/usePortada.js'
import './CdEstuche.css'

// Un CD dentro de un estuche transparente. El CD muestra la imagen del single
// (public/portadas/) y, si no hay, un disco plateado dibujado con CSS.
// Es decorativo: la información de la canción va en el texto de al lado.
function CdEstuche({ cancion }) {
  const { src, cargada, alCargar, alFallar } = useImagenCancion(cancion)

  return (
    <div className="estuche" aria-hidden="true">
      <span className="estuche__sombra" />
      <span className="estuche__bandeja" />

      <span className="estuche__lomo">
        <span className="estuche__anio">{cancion.anio}</span>
      </span>

      <span className="estuche__cd">
        {/* Esta capa es la que gira */}
        <span className={`cd__giro ${cargada ? 'cd__giro--img' : ''}`}>
          {src && (
            <img
              className="cd__img"
              src={src}
              alt=""
              loading="eager"
              decoding="async"
              onLoad={alCargar}
              onError={alFallar}
            />
          )}
        </span>
        {/* Esta no gira: agujero, aro de plástico y destello */}
        <span className="cd__brillo" />
      </span>

      {/* Tapa transparente: se abre al pasar el ratón */}
      <span className="estuche__tapa" />
    </div>
  )
}

export default CdEstuche
