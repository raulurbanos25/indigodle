import Reveal from '../home/Reveal.jsx'
import CountUp from '../home/CountUp.jsx'

function ResumenGlobal({ resumen }) {
  const tarjetas = [
    {
      icono: 'M4 19V5m0 14h17M7 15l4-4 3 2 6-7',
      valor: <CountUp hasta={resumen.jugadas} />,
      etiqueta: 'partidas jugadas',
      detalle: `${resumen.ganadas} ganadas · ${resumen.perdidas} no acertadas`,
    },
    {
      icono: 'M12 20S4 15.5 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6-8 10.5-8 10.5Z',
      valor: (
        <>
          <CountUp hasta={resumen.porcentaje} />%
        </>
      ),
      etiqueta: 'de victorias',
      detalle: 'sobre todas tus partidas',
    },
    {
      icono: 'M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4',
      valor: <CountUp hasta={resumen.perfectas} />,
      etiqueta: 'victorias perfectas',
      detalle: 'a la primera o sin fallos',
    },
    {
      icono: 'M8 3v4m8-4v4M5 9h14M6 5h12a1 1 0 0 1 1 1v13H5V6a1 1 0 0 1 1-1Zm2 8h3m2 0h3m-8 4h3',
      valor: <CountUp hasta={resumen.racha.actual} />,
      etiqueta: 'días seguidos jugando',
      detalle: `Tu mejor racha: ${resumen.racha.mejor} ${resumen.racha.mejor === 1 ? 'día' : 'días'}`,
    },
    {
      icono: 'M12 21a8 8 0 1 0-8-8m0-5v5h5m3-9v5l3 2',
      valor: <CountUp hasta={resumen.racha.dias} />,
      etiqueta: 'días jugados',
      detalle: 'en total',
    },
  ]

  return (
    <div className="stats__tarjetas">
      {tarjetas.map((tarjeta, i) => (
        <Reveal key={tarjeta.etiqueta} direccion="zoom" delay={i * 70} className="tarjeta-stat">
          <span className="tarjeta-stat__icono" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d={tarjeta.icono} /></svg>
          </span>
          <span className="tarjeta-stat__valor">{tarjeta.valor}</span>
          <span className="tarjeta-stat__etiqueta">{tarjeta.etiqueta}</span>
          <span className="tarjeta-stat__detalle">{tarjeta.detalle}</span>
        </Reveal>
      ))}
    </div>
  )
}

export default ResumenGlobal
