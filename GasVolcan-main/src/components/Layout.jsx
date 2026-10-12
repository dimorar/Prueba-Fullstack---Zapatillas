import { Outlet } from 'react-router'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// <Outlet /> es el "hueco" donde React Router dibuja la página de la ruta actual.
// Así TODAS las páginas tienen el mismo menú (en el legacy, contacto y admin no lo tenían).
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
