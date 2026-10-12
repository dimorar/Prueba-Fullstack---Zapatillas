import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderAt } from '../test/renderWithRouter.jsx'

beforeEach(() => {
  localStorage.clear()
})

const tarjeta = (nombre) => screen.getByLabelText(`Cantidad de ${nombre}`).closest('article')

describe('Catálogo y carrito (HU-01)', () => {
  it('se llega desde la portada', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('link', { name: 'Ver productos' }))
    expect(screen.getByRole('heading', { name: 'Catálogo de productos' })).toBeInTheDocument()
  })

  it('agrega productos, calcula el total y actualiza el contador del menú', async () => {
    const user = userEvent.setup()
    renderAt('/catalogo')
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()

    const cantidad = screen.getByLabelText('Cantidad de Gas 5Kg')
    await user.clear(cantidad)
    await user.type(cantidad, '2')
    await user.click(within(tarjeta('Gas 5Kg')).getByRole('button', { name: 'Agregar al carrito' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Gas 5Kg agregado al carrito')
    expect(screen.getByTestId('total')).toHaveTextContent('$21.000')
    expect(screen.getByLabelText('productos en el carrito')).toHaveTextContent('2')

    await user.click(screen.getByRole('button', { name: 'Sumar Gas 5Kg' }))
    expect(screen.getByTestId('total')).toHaveTextContent('$31.500')
    await user.click(screen.getByRole('button', { name: 'Restar Gas 5Kg' }))
    expect(screen.getByTestId('total')).toHaveTextContent('$21.000')
    await user.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
  })

  it('no deja superar el stock', async () => {
    const user = userEvent.setup()
    renderAt('/catalogo')
    const cantidad = screen.getByLabelText('Cantidad de Gas 45Kg') // stock 2
    await user.clear(cantidad)
    await user.type(cantidad, '3')
    await user.click(within(tarjeta('Gas 45Kg')).getByRole('button', { name: 'Agregar al carrito' }))
    expect(screen.getByRole('alert')).toHaveTextContent('No puedes agregar más')
  })

  it('guarda el carrito en localStorage', async () => {
    const user = userEvent.setup()
    renderAt('/catalogo')
    await user.click(within(tarjeta('Gas 11Kg')).getByRole('button', { name: 'Agregar al carrito' }))
    expect(JSON.parse(localStorage.getItem('gv-carrito-v1'))).toEqual({ 'G-11': 1 })
  })

  it('busca y ordena los productos', async () => {
    const user = userEvent.setup()
    renderAt('/catalogo')
    const nombres = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

    await user.selectOptions(screen.getByLabelText('Ordenar por'), 'precio-desc')
    expect(nombres().slice(0, 4)).toEqual(['Gas 45Kg', 'Gas 15Kg', 'Gas 11Kg', 'Gas 5Kg'])

    await user.type(screen.getByRole('searchbox', { name: 'Buscar' }), '11')
    expect(screen.getAllByRole('article')).toHaveLength(1)

    await user.clear(screen.getByRole('searchbox', { name: 'Buscar' }))
    await user.type(screen.getByRole('searchbox', { name: 'Buscar' }), 'parafina')
    expect(screen.getByText('No hay productos que coincidan con “parafina”.')).toBeInTheDocument()
  })
})
