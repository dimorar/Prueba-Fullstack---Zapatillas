// Catálogo inicial. Las imágenes están en public/img y se usan con ruta relativa
// (funciona en GitHub Pages porque usamos base: './' y HashRouter).
export const PRODUCTOS_INICIALES = [
  { id: 'G-05', name: 'Gas 5Kg', price: 10500, stock: 15, stockCritico: 5, img: 'img/gas-5kg.svg' },
  { id: 'G-11', name: 'Gas 11Kg', price: 16800, stock: 3, stockCritico: 5, img: 'img/gas-11kg.svg' },
  { id: 'G-15', name: 'Gas 15Kg', price: 21500, stock: 20, stockCritico: 5, img: 'img/gas-15kg.svg' },
  { id: 'G-45', name: 'Gas 45Kg', price: 62000, stock: 2, stockCritico: 3, img: 'img/gas-45kg.svg' },
]

export function esStockCritico(producto) {
  return producto.stock <= producto.stockCritico
}

/** 16800 → "$16.800" */
export function formatearPrecio(valor) {
  return `$${Number(valor).toLocaleString('es-CL')}`
}

/** Devuelve una NUEVA lista con el stock actualizado (no modifica la original). */
export function actualizarStock(productos, id, nuevoStock) {
  const stock = Number(nuevoStock)
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('El stock debe ser un número entero mayor o igual a 0')
  }
  return productos.map((p) => (p.id === id ? { ...p, stock } : p))
}

export const ORDENES = [
  { valor: 'relevancia', texto: 'Relevancia' },
  { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
  { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
]

/** Filtra por nombre o código y ordena por precio. No modifica la lista original. */
export function filtrarProductos(productos, { texto = '', orden = 'relevancia' } = {}) {
  const buscado = texto.trim().toLowerCase()
  const lista = productos.filter(
    (p) => p.name.toLowerCase().includes(buscado) || p.id.toLowerCase().includes(buscado),
  )
  if (orden === 'precio-asc') return lista.toSorted((a, b) => a.price - b.price)
  if (orden === 'precio-desc') return lista.toSorted((a, b) => b.price - a.price)
  return lista
}

/** Resta del stock lo que hay en el carrito. Lanza un error si algo ya no alcanza. */
export function descontarStock(productos, carrito) {
  for (const [id, cantidad] of Object.entries(carrito)) {
    const producto = productos.find((p) => p.id === id)
    if (producto && cantidad > producto.stock) {
      throw new Error(`Stock insuficiente de ${producto.name} (quedan ${producto.stock}).`)
    }
  }
  return productos.map((p) => (carrito[p.id] ? { ...p, stock: p.stock - carrito[p.id] } : p))
}
