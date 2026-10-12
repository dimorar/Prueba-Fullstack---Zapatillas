import { useState } from 'react'
import EstadoPedido from '../EstadoPedido.jsx'
import { useStore } from '../../hooks/useStore.js'
import { ESTADOS_PEDIDO, cambiarEstadoPedido, esEstadoFinal, formatearFecha } from '../../services/orders.js'
import { formatearPrecio } from '../../services/products.js'

/** Gestión de pedidos: filtrar por estado y avanzar o cancelar (cancelar repone stock). */
export default function Pedidos() {
  const { pedidos, setPedidos, productos, setProductos } = useStore()
  const [filtro, setFiltro] = useState('Todos')
  const [mensaje, setMensaje] = useState(null)
  const visibles = filtro === 'Todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)
  const pendientes = pedidos.filter((p) => p.estado === 'Pendiente').length

  const cambiar = (id, estado) => {
    try {
      const resultado = cambiarEstadoPedido(pedidos, productos, id, estado)
      setPedidos(resultado.pedidos)
      setProductos(resultado.productos)
      setMensaje({ texto: `Pedido ${id} cambiado a "${estado}".` })
    } catch (error) {
      setMensaje({ texto: error.message, error: true })
    }
  }

  return (
    <section aria-labelledby="titulo-pedidos">
      <h3 id="titulo-pedidos">Pedidos ({pendientes} pendientes)</h3>
      {mensaje && (
        <p className={mensaje.error ? 'alerta alerta--error' : 'alerta'} role="alert">{mensaje.texto}</p>
      )}
      <label className="filtro-estado">
        Filtrar por estado
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option>Todos</option>
          {ESTADOS_PEDIDO.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </label>
      {visibles.length === 0 ? (
        <p>No hay pedidos{filtro !== 'Todos' && ` en estado ${filtro}`}.</p>
      ) : (
        <div className="tabla-scroll">
          <table className="admin-table">
            <thead>
              <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Despacho</th><th>Total</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {visibles.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{formatearFecha(p.fecha)}</td>
                  <td>{p.cliente}</td>
                  <td>{p.direccion}{p.comuna && `, ${p.comuna}`}</td>
                  <td>{formatearPrecio(p.total)}</td>
                  <td>
                    <EstadoPedido estado={p.estado} />{' '}
                    <select
                      aria-label={`Estado del pedido ${p.id}`}
                      value={p.estado}
                      disabled={esEstadoFinal(p.estado)}
                      onChange={(e) => cambiar(p.id, e.target.value)}
                    >
                      {ESTADOS_PEDIDO.map((e) => (
                        <option key={e}>{e}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
