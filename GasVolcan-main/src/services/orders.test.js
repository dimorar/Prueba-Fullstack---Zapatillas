import { describe, expect, it } from 'vitest'
import {
  cambiarEstadoPedido, crearPedido, esEstadoFinal, formatearFecha, pedidosDeUsuario, reponerStock, siguienteIdPedido,
  validarDireccion,
} from './orders.js'

const productos = [
  { id: 'G-05', name: 'Gas 5Kg', price: 10500, stock: 5 },
  { id: 'G-11', name: 'Gas 11Kg', price: 16800, stock: 1 },
]
const usuario = { id: 7, nombre: 'Ana Pérez', comuna: 'Macul' }
const fecha = new Date('2026-10-01T12:00:00Z')

describe('crear pedido', () => {
  it('genera el pedido y descuenta el stock', () => {
    const { pedido, productos: nuevos } = crearPedido({
      carrito: { 'G-05': 2, 'G-11': 1 }, productos, usuario, direccion: ' Los Olmos 123 ', fecha,
    })
    expect(pedido).toMatchObject({
      id: 'P-0001', usuarioId: 7, cliente: 'Ana Pérez', comuna: 'Macul', direccion: 'Los Olmos 123',
      total: 2 * 10500 + 16800, estado: 'Pendiente', fecha: '2026-10-01T12:00:00.000Z',
    })
    expect(pedido.items[0]).toEqual({ id: 'G-05', nombre: 'Gas 5Kg', cantidad: 2, precio: 10500, subtotal: 21000 })
    expect(nuevos.map((p) => p.stock)).toEqual([3, 0])
    expect(productos[0].stock).toBe(5)
  })

  it('usa el siguiente número de pedido y deja la comuna vacía si no hay', () => {
    const { pedido } = crearPedido({
      carrito: { 'G-05': 1 }, productos, pedidos: [{ id: 'P-0009' }], usuario: { id: 1, nombre: 'X' }, direccion: 'Calle 12345',
    })
    expect(pedido.id).toBe('P-0010')
    expect(pedido.comuna).toBe('')
  })

  it('valida carrito, sesión, dirección y stock', () => {
    const base = { carrito: { 'G-05': 1 }, productos, usuario, direccion: 'Los Olmos 123' }
    expect(() => crearPedido({ ...base, carrito: {} })).toThrow('El carrito está vacío.')
    expect(() => crearPedido({ ...base, usuario: null })).toThrow('Debes iniciar sesión')
    expect(() => crearPedido({ ...base, direccion: 'ab' })).toThrow('dirección de despacho')
    expect(() => crearPedido({ ...base, carrito: { 'G-11': 2 } })).toThrow('Stock insuficiente')
  })
})

describe('dirección de despacho', () => {
  it('acepta entre 5 y 100 caracteres', () => {
    expect(validarDireccion('Av. Siempre Viva 742')).toBe(true)
    expect(validarDireccion('  Av  ')).toBe(false)
    expect(validarDireccion('a'.repeat(101))).toBe(false)
    expect(validarDireccion()).toBe(false)
  })
})

describe('consultar y cambiar pedidos', () => {
  const pedidos = [
    { id: 'P-0001', usuarioId: 7, fecha: '2026-10-01T10:00:00Z', estado: 'Pendiente', items: [{ id: 'G-05', cantidad: 2 }] },
    { id: 'P-0002', usuarioId: 8, fecha: '2026-10-02T10:00:00Z', estado: 'Entregado', items: [] },
    { id: 'P-0003', usuarioId: 7, fecha: '2026-10-03T10:00:00Z', estado: 'En reparto', items: [] },
  ]

  it('calcula el siguiente id', () => {
    expect(siguienteIdPedido([])).toBe('P-0001')
    expect(siguienteIdPedido(pedidos)).toBe('P-0004')
  })

  it('lista los pedidos de un usuario del más nuevo al más antiguo', () => {
    expect(pedidosDeUsuario(pedidos, '7').map((p) => p.id)).toEqual(['P-0003', 'P-0001'])
  })

  it('avanza el estado sin tocar el stock', () => {
    const r = cambiarEstadoPedido(pedidos, productos, 'P-0001', 'En reparto')
    expect(r.pedidos[0].estado).toBe('En reparto')
    expect(r.productos).toBe(productos)
  })

  it('al cancelar repone el stock', () => {
    const r = cambiarEstadoPedido(pedidos, productos, 'P-0001', 'Cancelado')
    expect(r.pedidos[0].estado).toBe('Cancelado')
    expect(r.productos[0].stock).toBe(7)
    expect(reponerStock(productos, [{ id: 'G-11', cantidad: 3 }])[1].stock).toBe(4)
  })

  it('rechaza estados inválidos, pedidos inexistentes y pedidos cerrados', () => {
    expect(() => cambiarEstadoPedido(pedidos, productos, 'P-0001', 'Perdido')).toThrow('Estado inválido')
    expect(() => cambiarEstadoPedido(pedidos, productos, 'P-9999', 'Entregado')).toThrow('no existe')
    expect(() => cambiarEstadoPedido(pedidos, productos, 'P-0002', 'Pendiente')).toThrow('está entregado')
    expect(esEstadoFinal('Cancelado')).toBe(true)
    expect(esEstadoFinal('Pendiente')).toBe(false)
  })

  it('formatea la fecha en formato chileno', () => {
    expect(formatearFecha('2026-10-01T12:00:00Z')).toMatch(/0?1[-/]10[-/](20)?26/)
  })
})
