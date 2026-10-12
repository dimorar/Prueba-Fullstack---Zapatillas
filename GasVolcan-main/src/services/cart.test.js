import { describe, expect, it } from 'vitest'
import {
  agregarAlCarrito, calcularTotal, cambiarCantidad, contarItems, lineasCarrito, quitarDelCarrito,
} from './cart.js'

const gas5 = { id: 'G-05', name: 'Gas 5Kg', price: 10500, stock: 3 }
const gas11 = { id: 'G-11', name: 'Gas 11Kg', price: 16800, stock: 5 }

describe('carrito', () => {
  it('agrega productos sin modificar el carrito original', () => {
    const original = {}
    const { cart, error } = agregarAlCarrito(original, gas5, 2)
    expect(error).toBeNull()
    expect(cart).toEqual({ 'G-05': 2 })
    expect(original).toEqual({})
  })

  it('no permite superar el stock ni cantidades inválidas', () => {
    expect(agregarAlCarrito({ 'G-05': 2 }, gas5, 2).error).toMatch(/stock/)
    expect(agregarAlCarrito({}, gas5, 0).error).toMatch(/cantidad/)
    expect(agregarAlCarrito({}, gas5, 'abc').error).toMatch(/cantidad/)
  })

  it('suma, resta y elimina al llegar a 0', () => {
    expect(cambiarCantidad({ 'G-05': 1 }, gas5, 1).cart).toEqual({ 'G-05': 2 })
    expect(cambiarCantidad({ 'G-05': 3 }, gas5, 1).error).toMatch(/tope/)
    expect(cambiarCantidad({ 'G-05': 1 }, gas5, -1).cart).toEqual({})
    expect(cambiarCantidad({ 'G-05': 2 }, gas5, -1).cart).toEqual({ 'G-05': 1 })
  })

  it('quita un producto completo', () => {
    expect(quitarDelCarrito({ 'G-05': 2, 'G-11': 1 }, 'G-05')).toEqual({ 'G-11': 1 })
  })

  it('cuenta unidades y calcula el total', () => {
    const cart = { 'G-05': 2, 'G-11': 1, 'NO-EXISTE': 4 }
    expect(contarItems(cart)).toBe(7)
    expect(lineasCarrito(cart, [gas5, gas11])).toHaveLength(2)
    expect(calcularTotal(cart, [gas5, gas11])).toBe(2 * 10500 + 16800)
  })
})
