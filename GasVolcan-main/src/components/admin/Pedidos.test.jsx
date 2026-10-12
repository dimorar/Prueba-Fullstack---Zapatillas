import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import Pedidos from './Pedidos.jsx'
import Inventario from './Inventario.jsx'
import { renderConStore } from '../../test/renderConStore.jsx'

const pedido = (id, estado, items = []) => ({
  id, usuarioId: 2, cliente: 'Ana Pérez', direccion: 'Los Olmos 123', comuna: 'Macul', items,
  total: 21000, estado, fecha: '2026-10-01T10:00:00Z',
})

const guardarPedidos = (pedidos) => localStorage.setItem('gv-pedidos-v1', JSON.stringify(pedidos))
const seccion = () => within(screen.getByRole('region', { name: /Pedidos/ }))

beforeEach(() => {
  localStorage.clear()
})

describe('Gestión de pedidos', () => {
  it('indica cuando no hay pedidos', () => {
    renderConStore(<Pedidos />)
    expect(seccion().getByRole('heading')).toHaveTextContent('Pedidos (0 pendientes)')
    expect(seccion().getByText('No hay pedidos.')).toBeInTheDocument()
  })

  it('filtra por estado y avanza un pedido', async () => {
    const user = userEvent.setup()
    guardarPedidos([pedido('P-0001', 'Pendiente'), pedido('P-0002', 'Entregado')])
    renderConStore(<Pedidos />)
    expect(seccion().getByRole('heading')).toHaveTextContent('Pedidos (1 pendientes)')

    await user.selectOptions(seccion().getByLabelText('Filtrar por estado'), 'Cancelado')
    expect(seccion().getByText('No hay pedidos en estado Cancelado.')).toBeInTheDocument()
    await user.selectOptions(seccion().getByLabelText('Filtrar por estado'), 'Pendiente')
    expect(seccion().getAllByRole('row')).toHaveLength(2) // encabezado + 1

    await user.selectOptions(seccion().getByLabelText('Estado del pedido P-0001'), 'En reparto')
    expect(seccion().getByRole('alert')).toHaveTextContent('Pedido P-0001 cambiado a "En reparto".')
    expect(seccion().getByRole('heading')).toHaveTextContent('Pedidos (0 pendientes)')
  })

  it('un pedido entregado no se puede modificar', () => {
    guardarPedidos([pedido('P-0002', 'Entregado')])
    renderConStore(<Pedidos />)
    expect(seccion().getByLabelText('Estado del pedido P-0002')).toBeDisabled()
  })

  it('al cancelar devuelve el stock al inventario', async () => {
    const user = userEvent.setup()
    guardarPedidos([pedido('P-0003', 'En reparto', [{ id: 'G-45', nombre: 'Gas 45Kg', cantidad: 4, precio: 62000, subtotal: 248000 }])])
    renderConStore(<><Pedidos /><Inventario /></>)
    expect(screen.getByLabelText('Stock de Gas 45Kg')).toHaveValue(2)

    await user.selectOptions(seccion().getByLabelText('Estado del pedido P-0003'), 'Cancelado')
    expect(screen.getByLabelText('Stock de Gas 45Kg')).toHaveValue(6)
    expect(seccion().getByLabelText('Estado del pedido P-0003')).toBeDisabled()
  })
})
