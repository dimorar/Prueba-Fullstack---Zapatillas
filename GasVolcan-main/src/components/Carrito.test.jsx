import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Carrito from './Carrito.jsx'

const productos = [{ id: 'G-05', name: 'Gas 5Kg', price: 10500, stock: 4 }]

describe('Carrito', () => {
  it('indica cuando está vacío', () => {
    render(<Carrito carrito={{}} productos={productos} onCambiar={() => {}} onQuitar={() => {}} />)
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(screen.getByTestId('total')).toHaveTextContent('$0')
  })

  it('muestra subtotal y total, y avisa las acciones', async () => {
    const user = userEvent.setup()
    const onCambiar = vi.fn()
    const onQuitar = vi.fn()
    render(<Carrito carrito={{ 'G-05': 2 }} productos={productos} onCambiar={onCambiar} onQuitar={onQuitar} />)

    expect(screen.getByTestId('total')).toHaveTextContent('$21.000')
    await user.click(screen.getByRole('button', { name: 'Sumar Gas 5Kg' }))
    expect(onCambiar).toHaveBeenCalledWith(productos[0], 1)
    await user.click(screen.getByRole('button', { name: 'Restar Gas 5Kg' }))
    expect(onCambiar).toHaveBeenCalledWith(productos[0], -1)
    await user.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(onQuitar).toHaveBeenCalledWith('G-05')
  })
})
