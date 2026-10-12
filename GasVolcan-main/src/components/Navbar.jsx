import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { useStore } from '../hooks/useStore.js'
import { contarItems } from '../services/cart.js'
import { esAdmin } from '../services/users.js'

// NavLink agrega la clase "active" al link de la página actual.
// En pantallas chicas el menú se abre y cierra con el botón ☰.
export default function Navbar() {
  const { carrito, sesion, setSesion } = useStore()
  const [abierto, setAbierto] = useState(false)
  const navigate = useNavigate()
  const cerrar = () => setAbierto(false)

  const salir = () => {
    setSesion(null)
    cerrar()
    navigate('/')
  }

  return (
    <header className="main-header">
      <Link to="/" className="logo" onClick={cerrar}>GasVolcan</Link>
      <button
        className="menu-toggle"
        aria-label="Menú"
        aria-expanded={abierto}
        aria-controls="menu-principal"
        onClick={() => setAbierto(!abierto)}
      >
        ☰
      </button>
      <nav id="menu-principal" className={abierto ? 'nav-menu abierto' : 'nav-menu'} aria-label="Principal">
        <NavLink to="/" end onClick={cerrar}>Inicio</NavLink>
        <NavLink to="/catalogo" onClick={cerrar}>
          Catálogo <span className="badge" aria-label="productos en el carrito">{contarItems(carrito)}</span>
        </NavLink>
        <NavLink to="/contacto" onClick={cerrar}>Contacto/Registro</NavLink>
        {sesion && <NavLink to="/mis-pedidos" onClick={cerrar}>Mis pedidos</NavLink>}
        {esAdmin(sesion) && <NavLink to="/admin" onClick={cerrar}>Admin</NavLink>}
        {sesion ? (
          <>
            <span className="saludo">Hola, {sesion.nombre.split(' ')[0]}</span>
            <button className="link-boton" onClick={salir}>Cerrar sesión</button>
          </>
        ) : (
          <NavLink to="/login" onClick={cerrar}>Iniciar sesión</NavLink>
        )}
      </nav>
    </header>
  )
}
