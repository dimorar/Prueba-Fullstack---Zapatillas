import Pedidos from '../components/admin/Pedidos.jsx'
import Inventario from '../components/admin/Inventario.jsx'
import Usuarios from '../components/admin/Usuarios.jsx'

// HU-03: panel administrativo. Solo entra el rol Admin: lo controla
// <RutaProtegida soloAdmin> en App.jsx, así esta página no repite esa lógica.
export default function Admin() {
  return (
    <>
      <h2>Panel de administración</h2>
      <Pedidos />
      <Inventario />
      <Usuarios />
    </>
  )
}
