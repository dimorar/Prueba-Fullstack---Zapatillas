import { calcularTotal, lineasCarrito } from './cart.js'
import { descontarStock } from './products.js'

// Flujo de un pedido: Pendiente → En reparto → Entregado (o Cancelado en cualquier momento).
export const ESTADOS_PEDIDO = ['Pendiente', 'En reparto', 'Entregado', 'Cancelado']
export const ESTADOS_FINALES = ['Entregado', 'Cancelado']

/** Dirección de despacho entre 5 y 100 caracteres (ej: "Av. Siempre Viva 742"). */
export function validarDireccion(direccion = '') {
  const largo = direccion.trim().length
  return largo >= 5 && largo <= 100
}

export function esEstadoFinal(estado) {
  return ESTADOS_FINALES.includes(estado)
}

/** P-0001, P-0002, ... (siguiente número disponible). */
export function siguienteIdPedido(pedidos) {
  const max = pedidos.reduce((mayor, p) => Math.max(mayor, Number(p.id.slice(2)) || 0), 0)
  return `P-${String(max + 1).padStart(4, '0')}`
}

/**
 * Convierte el carrito en un pedido y descuenta el stock.
 * Devuelve { pedido, productos } o lanza un Error con un mensaje para el usuario.
 */
export function crearPedido({ carrito, productos, pedidos = [], usuario, direccion, fecha = new Date() }) {
  const lineas = lineasCarrito(carrito, productos)
  if (lineas.length === 0) throw new Error('El carrito está vacío.')
  if (!usuario) throw new Error('Debes iniciar sesión para confirmar el pedido.')
  if (!validarDireccion(direccion)) {
    throw new Error('Ingresa una dirección de despacho válida (entre 5 y 100 caracteres).')
  }
  const productosActualizados = descontarStock(productos, carrito)
  const pedido = {
    id: siguienteIdPedido(pedidos),
    usuarioId: usuario.id,
    cliente: usuario.nombre,
    comuna: usuario.comuna ?? '',
    direccion: direccion.trim(),
    items: lineas.map(({ producto, cantidad, subtotal }) => ({
      id: producto.id,
      nombre: producto.name,
      cantidad,
      precio: producto.price,
      subtotal,
    })),
    total: calcularTotal(carrito, productos),
    estado: 'Pendiente',
    fecha: fecha.toISOString(),
  }
  return { pedido, productos: productosActualizados }
}

/** Pedidos de un usuario, del más reciente al más antiguo. */
export function pedidosDeUsuario(pedidos, usuarioId) {
  return pedidos
    .filter((p) => String(p.usuarioId) === String(usuarioId))
    .toSorted((a, b) => b.fecha.localeCompare(a.fecha))
}

/** Devuelve al inventario las unidades de un pedido cancelado. */
export function reponerStock(productos, items) {
  return productos.map((p) => {
    const item = items.find((i) => i.id === p.id)
    return item ? { ...p, stock: p.stock + item.cantidad } : p
  })
}

/** Cambia el estado de un pedido. Si se cancela, repone el stock. Devuelve { pedidos, productos }. */
export function cambiarEstadoPedido(pedidos, productos, id, estado) {
  if (!ESTADOS_PEDIDO.includes(estado)) throw new Error(`Estado inválido: ${estado}`)
  const pedido = pedidos.find((p) => p.id === id)
  if (!pedido) throw new Error('El pedido no existe.')
  if (esEstadoFinal(pedido.estado)) {
    throw new Error(`El pedido ${id} está ${pedido.estado.toLowerCase()} y no se puede modificar.`)
  }
  return {
    pedidos: pedidos.map((p) => (p.id === id ? { ...p, estado } : p)),
    productos: estado === 'Cancelado' ? reponerStock(productos, pedido.items) : productos,
  }
}

export function formatearFecha(iso) {
  return new Date(iso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })
}
