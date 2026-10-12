import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { CLIENTE, conSesion, guardar } from '../test/datos.js'
import { renderAt } from '../test/renderWithRouter.jsx'

beforeEach(() => {
  localStorage.clear()
  guardar('usuarios', [CLIENTE])
})

const checkout = () => within(screen.getByRole('region', { name: 'Confirmar pedido' }))

describe('Confirmar pedido', () => {
  it('no aparece con el carrito vacío', () => {
    renderAt('/catalogo')
    expect(screen.queryByRole('region', { name: 'Confirmar pedido' })).not.toBeInTheDocument()
  })

  it('pide iniciar sesión y vuelve al catálogo después de entrar', async () => {
    const user = userEvent.setup()
    guardar('carrito', { 'G-05': 1 })
    renderAt('/catalogo')
    await user.click(checkout().getByRole('link', { name: 'iniciar sesión' }))

    await user.type(screen.getByLabelText('Correo'), 'ana@gmail.com')
    await user.type(screen.getByLabelText('Contraseña'), 'secreto1')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(checkout().getByText(/Despacho a nombre de/)).toHaveTextContent('Ana Pérez en Macul')
  })

  it('valida la dirección, crea el pedido, descuenta stock y vacía el carrito', async () => {
    const user = userEvent.setup()
    conSesion(CLIENTE)
    guardar('carrito', { 'G-05': 2 })
    renderAt('/catalogo')
    expect(screen.getByText('Stock: 15')).toBeInTheDocument()

    await user.click(checkout().getByRole('button', { name: 'Confirmar pedido' }))
    expect(checkout().getByRole('alert')).toHaveTextContent('dirección de despacho válida')

    await user.type(checkout().getByLabelText('Dirección de despacho'), 'Los Olmos 123')
    await user.click(checkout().getByRole('button', { name: 'Confirmar pedido' }))

    expect(checkout().getByRole('status')).toHaveTextContent('Pedido P-0001 confirmado.')
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(screen.getByText('Stock: 13')).toBeInTheDocument()

    await user.click(checkout().getByRole('link', { name: 'Ver mis pedidos' }))
    const pedido = within(screen.getByRole('listitem', { name: 'Pedido P-0001' }))
    expect(pedido.getByText('Pendiente')).toBeInTheDocument()
    expect(pedido.getByText('2 × Gas 5Kg — $21.000')).toBeInTheDocument()
    expect(pedido.getByText('Total: $21.000')).toBeInTheDocument()
  })

  it('avisa si el stock ya no alcanza', async () => {
    const user = userEvent.setup()
    conSesion(CLIENTE)
    guardar('carrito', { 'G-45': 5 })
    renderAt('/catalogo')
    await user.type(checkout().getByLabelText('Dirección de despacho'), 'Los Olmos 123')
    await user.click(checkout().getByRole('button', { name: 'Confirmar pedido' }))
    expect(checkout().getByRole('alert')).toHaveTextContent('Stock insuficiente de Gas 45Kg (quedan 2).')
  })
})

describe('Mis pedidos', () => {
  it('requiere sesión', () => {
    renderAt('/mis-pedidos')
    expect(screen.getByRole('heading', { name: 'Inicio de sesión' })).toBeInTheDocument()
  })

  it('muestra un mensaje si aún no hay pedidos', () => {
    conSesion(CLIENTE)
    renderAt('/mis-pedidos')
    expect(screen.getByText(/Aún no tienes pedidos/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Mis pedidos' })).toHaveClass('active')
  })

  it('solo muestra los pedidos del usuario conectado', () => {
    conSesion(CLIENTE)
    guardar('pedidos', [
      { id: 'P-0001', usuarioId: 2, cliente: 'Ana', direccion: 'Los Olmos 123', comuna: '', items: [], total: 0, estado: 'Entregado', fecha: '2026-10-01T10:00:00Z' },
      { id: 'P-0002', usuarioId: 99, cliente: 'Otro', direccion: 'X 1234', comuna: 'Macul', items: [], total: 0, estado: 'Pendiente', fecha: '2026-10-02T10:00:00Z' },
    ])
    renderAt('/mis-pedidos')
    expect(screen.getByRole('listitem', { name: 'Pedido P-0001' })).toHaveTextContent('Entregado')
    expect(screen.queryByRole('listitem', { name: 'Pedido P-0002' })).not.toBeInTheDocument()
  })
})
