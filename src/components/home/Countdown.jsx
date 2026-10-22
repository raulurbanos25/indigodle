import { useEffect, useState } from 'react'
import { fechaDeHoy } from '../../services/dailyChallenge.js'
import './Countdown.css'

function segundosHastaMedianoche() {
  const ahora = new Date()
  const manana = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1)
  return Math.max(0, Math.floor((manana - ahora) / 1000))
}

const dosCifras = (n) => String(n).padStart(2, '0')

function formatear(total) {
  const horas = Math.floor(total / 3600)
  const minutos = Math.floor((total % 3600) / 60)
  const segundos = total % 60
  return `${dosCifras(horas)}:${dosCifras(minutos)}:${dosCifras(segundos)}`
}

function Countdown({ etiqueta = 'Próximo reto en' }) {
  const [restante, setRestante] = useState(segundosHastaMedianoche)
  const [diaInicial] = useState(fechaDeHoy)
  const [hayNuevo, setHayNuevo] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setRestante(segundosHastaMedianoche())
      setHayNuevo(fechaDeHoy() !== diaInicial)
    }, 1000)
    return () => clearInterval(id)
  }, [diaInicial])

  // Si la página se quedó abierta pasada la medianoche, los retos que ve siguen siendo los de ayer
  if (hayNuevo) {
    return <span className="countdown">¡Ya hay un reto nuevo! Recarga la página.</span>
  }

  return (
    <span className="countdown">
      <span>{etiqueta}</span>
      <span className="countdown__tiempo" role="timer">
        {formatear(restante)}
      </span>
    </span>
  )
}

export default Countdown