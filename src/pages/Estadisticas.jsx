import { Link } from 'react-router-dom'
import { fechaDeHoy } from '../services/dailyChallenge.js'
import { useEstadisticas } from '../hooks/useEstadisticas.js'
import {
  actividad,
  aplanar,
  evolucion,
  ranking,
  resumenGlobal,
} from '../services/estadisticas.js'
import Reveal from '../components/home/Reveal.jsx'
import ResumenGlobal from '../components/stats/ResumenGlobal.jsx'
import RankingModos from '../components/stats/RankingModos.jsx'
import DetalleModo from '../components/stats/DetalleModo.jsx'
import GraficoEvolucion from '../components/stats/GraficoEvolucion.jsx'
import MapaActividad from '../components/stats/MapaActividad.jsx'
import HistorialReciente from '../components/stats/HistorialReciente.jsx'
import DatosLocales from '../components/stats/DatosLocales.jsx'
import './Estadisticas.css'

function Estadisticas() {
  const { historial, recargar } = useEstadisticas()
  const hoy = fechaDeHoy()
  const partidas = aplanar(historial)

  return (
    <section className="page container estadisticas">
      <header className="stats__cabecera">
        <p className="stats__kicker">Tu progreso</p>
        <h1>Estadísticas</h1>
        <p className="stats__intro">
          Se guardan en este navegador, sin registrarte ni iniciar sesión. Cada partida que
          terminas se suma sola.
        </p>
      </header>

      {partidas.length === 0 ? (
        <div className="stats__vacio">
          <p className="stats__vacio-icono" aria-hidden="true">
            <svg viewBox="0 0 64 64"><path d="M9 53V11M9 53h47M18 44l11-12 9 6 14-19"/><circle cx="18" cy="44" r="2"/><circle cx="29" cy="32" r="2"/><circle cx="38" cy="38" r="2"/><circle cx="52" cy="19" r="2"/></svg>
          </p>
          <h2>Todavía no hay estadísticas</h2>
          <p>Termina tu primera partida y aquí verás cómo vas.</p>
          <Link to="/jugar" className="btn btn--primary">
            Ir a jugar
          </Link>
        </div>
      ) : (
        <>
          <Reveal as="section" className="stats__seccion" aria-labelledby="st-resumen">
            <h2 id="st-resumen">Resumen</h2>
            <ResumenGlobal resumen={resumenGlobal(partidas, hoy)} />
          </Reveal>

          <Reveal as="section" className="stats__seccion" aria-labelledby="st-ranking">
            <h2 id="st-ranking">Tu ranking de modos</h2>
            <p className="stats__nota">
              Ordenados por porcentaje de victorias. Con pocas partidas, el orden puede cambiar
              mucho.
            </p>
            <RankingModos ranking={ranking(partidas, hoy)} />
          </Reveal>

          <Reveal as="section" className="stats__seccion" aria-labelledby="st-detalle">
            <h2 id="st-detalle">Detalle por modo</h2>
            <DetalleModo partidas={partidas} hoy={hoy} />
          </Reveal>

          <div className="stats__dos">
            <Reveal as="section" className="stats__panel" aria-labelledby="st-evolucion">
              <h2 id="st-evolucion">Cómo evolucionas</h2>
              <p className="stats__nota">Tu porcentaje de victorias acumulado, día a día.</p>
              <GraficoEvolucion puntos={evolucion(partidas)} />
            </Reveal>

            <Reveal
              as="section"
              direccion="right"
              className="stats__panel"
              aria-labelledby="st-actividad"
            >
              <h2 id="st-actividad">Tu actividad</h2>
              <p className="stats__nota">Las últimas 12 semanas. Pasa el ratón sobre un día.</p>
              <MapaActividad celdas={actividad(partidas, hoy)} />
            </Reveal>
          </div>

          <Reveal as="section" className="stats__seccion" aria-labelledby="st-historial">
            <h2 id="st-historial">Últimas partidas</h2>
            <HistorialReciente partidas={partidas} />
          </Reveal>
        </>
      )}

      <Reveal as="section" className="stats__seccion" aria-labelledby="st-datos">
        <h2 id="st-datos">Tus datos</h2>
        <DatosLocales alCambiar={recargar} />
      </Reveal>
    </section>
  )
}

export default Estadisticas
