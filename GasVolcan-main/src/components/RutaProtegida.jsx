import { Navigate, useLocation } from 'react-router'
import { useStore } from '../hooks/useStore.js'
import { esAdmin } from '../services/users.js'

/**
 * Muestra la página solo si hay sesión (y rol Admin cuando soloAdmin).
 * Sin sesión redirige a /login recordando a qué página se quería entrar.
 */
export default function RutaProtegida({ children, soloAdmin = false }) {
  const { sesion } = useStore()
  const location = useLocation()

  if (!sesion) return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  if (soloAdmin && !esAdmin(sesion)) {
    return (
      <section className="form-box">
        <h2>Acceso restringido</h2>
        <p>Tu cuenta no tiene permisos de administración.</p>
      </section>
    )
  }
  return children
}
