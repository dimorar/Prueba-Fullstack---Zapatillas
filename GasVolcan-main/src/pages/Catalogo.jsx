import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import Carrito from '../components/Carrito.jsx'
import Filtros from '../components/Filtros.jsx'
import Checkout from '../components/Checkout.jsx'
import { useStore } from '../hooks/useStore.js'
import { agregarAlCarrito, cambiarCantidad, quitarDelCarrito } from '../services/cart.js'
import { filtrarProductos } from '../services/products.js'

// HU-01: catálogo interactivo. Los mensajes reemplazan los alert() del código legacy.
export default function Catalogo() {
  const { productos, carrito, setCarrito } = useStore()
  const [mensaje, setMensaje] = useState(null)
  const [filtros, setFiltros] = useState({ texto: '', orden: 'relevancia' })
  const visibles = filtrarProductos(productos, filtros)

  const aplicar = ({ cart, error }, exito) => {
    setCarrito(cart)
    setMensaje(error ? { tipo: 'error', texto: error } : exito && { tipo: 'ok', texto: exito })
  }

  return (
    <>
      <h2>Catálogo de productos</h2>
      {mensaje && (
        <p className={mensaje.tipo === 'error' ? 'alerta alerta--error' : 'alerta'} role="alert">
          {mensaje.texto}
        </p>
      )}
      <Filtros filtros={filtros} onCambiar={setFiltros} />
      {visibles.length === 0 ? (
        <p>No hay productos que coincidan con “{filtros.texto}”.</p>
      ) : (
        <div className="product-grid">
          {visibles.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              onAgregar={(prod, cant) => aplicar(agregarAlCarrito(carrito, prod, cant), `${prod.name} agregado al carrito`)}
            />
          ))}
        </div>
      )}
      <Carrito
        carrito={carrito}
        productos={productos}
        onCambiar={(prod, cambio) => aplicar(cambiarCantidad(carrito, prod, cambio))}
        onQuitar={(id) => aplicar({ cart: quitarDelCarrito(carrito, id), error: null })}
      />
      <Checkout />
    </>
  )
}
