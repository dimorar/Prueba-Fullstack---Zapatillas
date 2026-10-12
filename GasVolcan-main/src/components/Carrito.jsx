import { formatearPrecio } from '../services/products.js'
import { calcularTotal, lineasCarrito } from '../services/cart.js'

export default function Carrito({ carrito, productos, onCambiar, onQuitar }) {
  const lineas = lineasCarrito(carrito, productos)

  return (
    <section className="cart-section" aria-labelledby="titulo-carrito">
      <h2 id="titulo-carrito">Carrito de compras</h2>
      {lineas.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acción</th></tr>
          </thead>
          <tbody>
            {lineas.map(({ producto, cantidad, subtotal }) => (
              <tr key={producto.id}>
                <td>{producto.name}</td>
                <td>{formatearPrecio(producto.price)}</td>
                <td>
                  <button onClick={() => onCambiar(producto, -1)} aria-label={`Restar ${producto.name}`}>-</button>
                  {' '}{cantidad}{' '}
                  <button onClick={() => onCambiar(producto, 1)} aria-label={`Sumar ${producto.name}`}>+</button>
                </td>
                <td>{formatearPrecio(subtotal)}</td>
                <td><button onClick={() => onQuitar(producto.id)}>Quitar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 data-testid="total">Total a pagar: {formatearPrecio(calcularTotal(carrito, productos))}</h3>
    </section>
  )
}
