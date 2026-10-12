import { useState } from 'react'
import { formatearPrecio } from '../services/products.js'

export default function ProductCard({ producto, onAgregar }) {
  const [cantidad, setCantidad] = useState(1)
  const agotado = producto.stock === 0

  return (
    <article className="product-card">
      <img src={producto.img} alt={producto.name} width="120" />
      <h3>{producto.name}</h3>
      <p>
        {formatearPrecio(producto.price)} | <strong>Stock: {producto.stock}</strong>
      </p>
      <label>
        Cantidad
        <input
          type="number"
          min="1"
          max={producto.stock}
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          disabled={agotado}
          aria-label={`Cantidad de ${producto.name}`}
        />
      </label>
      <button className="btn" onClick={() => onAgregar(producto, cantidad)} disabled={agotado}>
        {agotado ? 'Agotado' : 'Agregar al carrito'}
      </button>
    </article>
  )
}
