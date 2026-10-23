import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Jugar from './pages/Jugar.jsx'
import JuegoClasico from './pages/JuegoClasico.jsx'
import JuegoTracklist from './pages/JuegoTracklist.jsx'
import JuegoIntruso from './pages/JuegoIntruso.jsx'
import JuegoInvitados from './pages/JuegoInvitados.jsx'
import JuegoDuo from './pages/JuegoDuo.jsx'
import JuegoCronologia from './pages/JuegoCronologia.jsx'
import JuegoRanking from './pages/JuegoRanking.jsx'
import JuegoTop10 from './pages/JuegoTop10.jsx'
import JuegoPalabra from './pages/JuegoPalabra.jsx'
import JuegoPortada from './pages/JuegoPortada.jsx'
import JuegoEscucha from './pages/JuegoEscucha.jsx'
import JuegoEnConstruccion from './pages/JuegoEnConstruccion.jsx'
import Estadisticas from './pages/Estadisticas.jsx'
import ComoSeJuega from './pages/ComoSeJuega.jsx'
import Discografia from './pages/Discografia.jsx'
import AlbumDetalle from './pages/AlbumDetalle.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jugar" element={<Jugar />} />
          <Route path="/jugar/clasico" element={<JuegoClasico />} />
          <Route path="/jugar/tracklist" element={<JuegoTracklist />} />
          <Route path="/jugar/intruso" element={<JuegoIntruso />} />
          <Route path="/jugar/invitados" element={<JuegoInvitados />} />
          <Route path="/jugar/duo" element={<JuegoDuo />} />
          <Route path="/jugar/cronologia" element={<JuegoCronologia />} />
          <Route path="/jugar/ranking" element={<JuegoRanking />} />
          <Route path="/jugar/top10" element={<JuegoTop10 />} />
          <Route path="/jugar/palabra" element={<JuegoPalabra />} />
          <Route path="/jugar/portada" element={<JuegoPortada />} />
          <Route path="/jugar/escucha" element={<JuegoEscucha />} />
          <Route path="/jugar/:modoId" element={<JuegoEnConstruccion />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/como-se-juega" element={<ComoSeJuega />} />
          <Route path="/discografia" element={<Discografia />} />
          <Route path="/discografia/:albumId" element={<AlbumDetalle />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Analytics />
    </>
  )
}

export default App
