import { useState } from 'react'
import { useStore } from '../../hooks/useStore.js'
import { actualizarStock, esStockCritico, formatearPrecio } from '../../services/products.js'

function FilaProducto({ producto, onGuardarStock }) {
  const [stock, setStock] = useState(String(producto.stock))
  const critico = esStockCritico(producto)
  return (
    <tr className={critico ? 'stock-critical' : ''}>
      <td>{producto.id}</td>
      <td>{producto.name}</td>
      <td>{formatearPrecio(producto.price)}</td>
      <td>
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          aria-label={`Stock de ${producto.name}`}
          className="input-stock"
        />
        <button onClick={() => onGuardarStock(producto.id, stock)}>Guardar</button>
      </td>
      <td>{critico ? '⚠️ CRÍTICO' : 'OK'}</td>
    </tr>
  )
}

/** Inventario con alerta de stock crítico y edición de stock. */
export default function Inventario() {
  const { productos, setProductos } = useStore()
  const [mensaje, setMensaje] = useState(null)
  const criticos = productos.filter(esStockCritico).length

  const guardarStock = (id, valor) => {
    try {
      setProductos(actualizarStock(productos, id, valor))
      setMensaje({ texto: 'Stock actualizado.' })
    } catch (error) {
      setMensaje({ texto: error.message, error: true })
    }
  }

  return (
    <section aria-labelledby="titulo-inventario">
      <h3 id="titulo-inventario">Inventario (control de stock)</h3>
      {mensaje && (
        <p className={mensaje.error ? 'alerta alerta--error' : 'alerta'} role="alert">{mensaje.texto}</p>
      )}
      {criticos > 0 && (
        <p className="alerta alerta--error">⚠️ Hay {criticos} producto(s) con stock crítico.</p>
      )}
      <div className="tabla-scroll">
        <table className="admin-table">
          <thead>
            <tr><th>Código</th><th>Producto</th><th>Precio</th><th>Stock</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              // La key incluye el stock: si cambia desde otro lado (un pedido), la fila se reinicia.
              <FilaProducto key={`${p.id}-${p.stock}`} producto={p} onGuardarStock={guardarStock} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
