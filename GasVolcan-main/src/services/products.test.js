import { describe, expect, it } from 'vitest'
import {
  PRODUCTOS_INICIALES, actualizarStock, descontarStock, esStockCritico, filtrarProductos, formatearPrecio,
} from './products.js'

describe('productos', () => {
  it('detecta stock crítico (stock <= stockCritico)', () => {
    expect(esStockCritico({ stock: 5, stockCritico: 5 })).toBe(true)
    expect(esStockCritico({ stock: 6, stockCritico: 5 })).toBe(false)
  })

  it('formatea precios en pesos chilenos', () => {
    expect(formatearPrecio(16800)).toBe('$16.800')
  })

  it('actualiza el stock devolviendo una lista nueva', () => {
    const nueva = actualizarStock(PRODUCTOS_INICIALES, 'G-11', '10')
    expect(nueva.find((p) => p.id === 'G-11').stock).toBe(10)
    expect(PRODUCTOS_INICIALES.find((p) => p.id === 'G-11').stock).toBe(3)
  })

  it('rechaza stock negativo o no entero', () => {
    expect(() => actualizarStock(PRODUCTOS_INICIALES, 'G-11', -1)).toThrow()
    expect(() => actualizarStock(PRODUCTOS_INICIALES, 'G-11', '2.5')).toThrow()
  })
})

describe('búsqueda y orden', () => {
  it('busca por nombre o código sin importar mayúsculas', () => {
    expect(filtrarProductos(PRODUCTOS_INICIALES, { texto: '15kg' }).map((p) => p.id)).toEqual(['G-15'])
    expect(filtrarProductos(PRODUCTOS_INICIALES, { texto: 'g-45' }).map((p) => p.id)).toEqual(['G-45'])
    expect(filtrarProductos(PRODUCTOS_INICIALES, { texto: 'leña' })).toEqual([])
    expect(filtrarProductos(PRODUCTOS_INICIALES)).toHaveLength(4)
  })

  it('ordena por precio sin modificar la lista original', () => {
    const desc = filtrarProductos(PRODUCTOS_INICIALES, { orden: 'precio-desc' })
    expect(desc.map((p) => p.id)).toEqual(['G-45', 'G-15', 'G-11', 'G-05'])
    const asc = filtrarProductos(PRODUCTOS_INICIALES, { orden: 'precio-asc' })
    expect(asc[0].id).toBe('G-05')
    expect(PRODUCTOS_INICIALES[0].id).toBe('G-05')
  })
})

describe('descontar stock', () => {
  it('resta las cantidades del carrito', () => {
    const nuevos = descontarStock(PRODUCTOS_INICIALES, { 'G-05': 2, 'NO-EXISTE': 1 })
    expect(nuevos.find((p) => p.id === 'G-05').stock).toBe(13)
    expect(nuevos.find((p) => p.id === 'G-15').stock).toBe(20)
  })

  it('falla si el stock ya no alcanza', () => {
    expect(() => descontarStock(PRODUCTOS_INICIALES, { 'G-45': 3 })).toThrow('Stock insuficiente de Gas 45Kg (quedan 2).')
  })
})
