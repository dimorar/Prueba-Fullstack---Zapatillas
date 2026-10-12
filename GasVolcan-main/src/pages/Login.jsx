import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useStore } from '../hooks/useStore.js'
import { autenticar, esAdmin } from '../services/users.js'

// Inicio de sesión para clientes y administradores.
// Si se llegó aquí desde una página protegida, al entrar se vuelve a esa página.
export default function Login() {
  const { usuarios, sesion, setSesion } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  if (sesion) {
    return (
      <section className="form-box">
        <h2>Ya iniciaste sesión</h2>
        <p>Estás conectado como {sesion.nombre}.</p>
        <Link to="/catalogo" className="btn">Ir al catálogo</Link>
      </section>
    )
  }

  const enviar = (e) => {
    e.preventDefault()
    const usuario = autenticar(usuarios, email, password)
    if (!usuario) return setError('Correo o contraseña incorrectos.')
    setSesion({ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol })
    navigate(location.state?.desde ?? (esAdmin(usuario) ? '/admin' : '/catalogo'), { replace: true })
  }

  return (
    <section className="form-box form-box--angosto">
      <h2>Inicio de sesión</h2>
      {error && <p className="alerta alerta--error" role="alert">{error}</p>}
      <form onSubmit={enviar}>
        <label>Correo<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" className="btn">Ingresar</button>
      </form>
      <p className="nota">¿No tienes cuenta? <Link to="/contacto">Regístrate aquí</Link>.</p>
    </section>
  )
}
