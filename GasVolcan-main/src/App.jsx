import { Route, Routes } from 'react-router'
import StoreProvider from './context/StoreProvider.jsx'
import Layout from './components/Layout.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import Home from './pages/Home.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Contacto from './pages/Contacto.jsx'
import Login from './pages/Login.jsx'
import MisPedidos from './pages/MisPedidos.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

// Tabla de rutas. Layout envuelve todas las páginas (navbar + footer).
export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="login" element={<Login />} />
          <Route path="mis-pedidos" element={<RutaProtegida><MisPedidos /></RutaProtegida>} />
          <Route path="admin" element={<RutaProtegida soloAdmin><Admin /></RutaProtegida>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </StoreProvider>
  )
}
