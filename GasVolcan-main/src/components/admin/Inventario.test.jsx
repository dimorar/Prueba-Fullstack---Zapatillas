import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import Inventario from './Inventario.jsx'
import { renderConStore } from '../../test/renderConStore.jsx'

beforeEach(() => {
  localStorage.clear()
})

describe('Inventario', () => {
  it('muestra el stock crítico y permite actualizarlo', async () => {
    const user = userEvent.setup()
    renderConStore(<Inventario />)

    expect(screen.getByText('⚠️ Hay 2 producto(s) con stock crítico.')).toBeInTheDocument()
    const fila11 = screen.getByLabelText('Stock de Gas 11Kg').closest('tr')
    expect(fila11).toHaveClass('stock-critical')

    await user.clear(screen.getByLabelText('Stock de Gas 11Kg'))
    await user.type(screen.getByLabelText('Stock de Gas 11Kg'), '30')
    await user.click(within(fila11).getByRole('button', { name: 'Guardar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Stock actualizado.')
    expect(screen.getByText('⚠️ Hay 1 producto(s) con stock crítico.')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('gv-productos-v1'))[1].stock).toBe(30)
  })

  it('rechaza stock negativo', async () => {
    const user = userEvent.setup()
    renderConStore(<Inventario />)
    const fila45 = screen.getByLabelText('Stock de Gas 45Kg').closest('tr')
    await user.clear(screen.getByLabelText('Stock de Gas 45Kg'))
    await user.type(screen.getByLabelText('Stock de Gas 45Kg'), '-3')
    await user.click(within(fila45).getByRole('button', { name: 'Guardar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('entero mayor o igual a 0')
  })
})
