import { Link } from 'react-router'
import EstadoPedido from '../components/EstadoPedido.jsx'
import { useStore } from '../hooks/useStore.js'
import { formatearFecha, pedidosDeUsuario } from '../services/orders.js'
import { formatearPrecio } from '../services/products.js'

// Historial de pedidos del usuario conectado (ruta protegida en App.jsx).
export default function MisPedidos() {
  const { pedidos, sesion } = useStore()
  const mios = pedidosDeUsuario(pedidos, sesion.id)

  return (
    <>
      <h2>Mis pedidos</h2>
      {mios.length === 0 ? (
        <p>Aún no tienes pedidos. <Link to="/catalogo">Ir al catálogo</Link></p>
      ) : (
        <ul className="lista-pedidos">
          {mios.map((p) => (
            <li key={p.id} className="pedido" aria-label={`Pedido ${p.id}`}>
              <div className="pedido__cabecera">
                <strong>{p.id}</strong>
                <EstadoPedido estado={p.estado} />
              </div>
              <p className="nota">
                {formatearFecha(p.fecha)} · {p.direccion}
                {p.comuna && `, ${p.comuna}`}
              </p>
              <ul>
                {p.items.map((i) => (
                  <li key={i.id}>{i.cantidad} × {i.nombre} — {formatearPrecio(i.subtotal)}</li>
                ))}
              </ul>
              <p><strong>Total: {formatearPrecio(p.total)}</strong></p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
