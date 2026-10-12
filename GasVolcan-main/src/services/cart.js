// El carrito es un objeto { idProducto: cantidad }. Todas las funciones devuelven
// un carrito NUEVO (inmutabilidad), que es lo que React necesita para re-renderizar.

/** Agrega `cantidad` unidades respetando el stock. Devuelve { cart, error }. */
export function agregarAlCarrito(cart, producto, cantidad = 1) {
  const cant = Number(cantidad)
  if (!Number.isInteger(cant) || cant < 1) {
    return { cart, error: 'La cantidad debe ser un número entero mayor a 0' }
  }
  const actual = cart[producto.id] ?? 0
  if (actual + cant > producto.stock) {
    return { cart, error: `No puedes agregar más. El stock de ${producto.name} es ${producto.stock}.` }
  }
  return { cart: { ...cart, [producto.id]: actual + cant }, error: null }
}

/** Suma o resta 1 unidad. Si llega a 0, el producto sale del carrito. */
export function cambiarCantidad(cart, producto, cambio) {
  const nueva = (cart[producto.id] ?? 0) + cambio
  if (nueva > producto.stock) {
    return { cart, error: `Alcanzaste el tope de stock (${producto.stock})` }
  }
  if (nueva <= 0) return { cart: quitarDelCarrito(cart, producto.id), error: null }
  return { cart: { ...cart, [producto.id]: nueva }, error: null }
}

export function quitarDelCarrito(cart, id) {
  const copia = { ...cart }
  delete copia[id]
  return copia
}

export function contarItems(cart) {
  return Object.values(cart).reduce((total, cant) => total + cant, 0)
}

/** Une el carrito con los productos para mostrar la tabla (ignora ids que ya no existen). */
export function lineasCarrito(cart, productos) {
  return Object.entries(cart)
    .map(([id, cantidad]) => {
      const producto = productos.find((p) => p.id === id)
      return producto ? { producto, cantidad, subtotal: producto.price * cantidad } : null
    })
    .filter(Boolean)
}

export function calcularTotal(cart, productos) {
  return lineasCarrito(cart, productos).reduce((total, linea) => total + linea.subtotal, 0)
}
