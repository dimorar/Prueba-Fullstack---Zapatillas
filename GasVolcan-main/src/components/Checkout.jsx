import { useState } from 'react'
import { Link } from 'react-router'
import { useStore } from '../hooks/useStore.js'
import { contarItems } from '../services/cart.js'
import { crearPedido } from '../services/orders.js'

/** Confirma el carrito como pedido: pide la dirección, descuenta stock y vacía el carrito. */
export default function Checkout() {
  const { carrito, setCarrito, productos, setProductos, pedidos, setPedidos, sesion, usuarios } = useStore()
  const [direccion, setDireccion] = useState('')
  const [estado, setEstado] = useState(null)
  const usuario = usuarios.find((u) => String(u.id) === String(sesion?.id))
  const vacio = contarItems(carrito) === 0

  if (vacio && !estado?.ok) return null

  const confirmar = (e) => {
    e.preventDefault()
    try {
      const { pedido, productos: actualizados } = crearPedido({ carrito, productos, pedidos, usuario, direccion })
      setProductos(actualizados)
      setPedidos([...pedidos, pedido])
      setCarrito({})
      setDireccion('')
      setEstado({ ok: `Pedido ${pedido.id} confirmado.` })
    } catch (error) {
      setEstado({ error: error.message })
    }
  }

  return (
    <section className="form-box" aria-labelledby="titulo-checkout">
      <h2 id="titulo-checkout">Confirmar pedido</h2>
      {estado?.ok && (
        <p className="alerta" role="status">
          {estado.ok} <Link to="/mis-pedidos">Ver mis pedidos</Link>
        </p>
      )}
      {estado?.error && <p className="alerta alerta--error" role="alert">{estado.error}</p>}
      {!vacio &&
        (usuario ? (
          <form onSubmit={confirmar} noValidate>
            <p>
              Despacho a nombre de <strong>{usuario.nombre}</strong>
              {usuario.comuna && ` en ${usuario.comuna}`}.
            </p>
            <label>
              Dirección de despacho
              <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle, número, depto." />
            </label>
            <button type="submit" className="btn">Confirmar pedido</button>
          </form>
        ) : (
          <p>
            Para confirmar tu pedido debes{' '}
            <Link to="/login" state={{ desde: '/catalogo' }}>iniciar sesión</Link>.
          </p>
        ))}
    </section>
  )
}
