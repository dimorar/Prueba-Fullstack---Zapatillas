import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ProductCard from './ProductCard.jsx'

const gas = { id: 'G-05', name: 'Gas 5Kg', price: 10500, stock: 4, img: 'img/gas-5kg.svg' }

describe('ProductCard', () => {
  it('muestra los datos del producto', () => {
    render(<ProductCard producto={gas} onAgregar={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Gas 5Kg' })).toBeInTheDocument()
    expect(screen.getByText('$10.500', { exact: false })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Gas 5Kg' })).toHaveAttribute('src', 'img/gas-5kg.svg')
  })

  it('envía el producto y la cantidad elegida', async () => {
    const user = userEvent.setup()
    const onAgregar = vi.fn()
    render(<ProductCard producto={gas} onAgregar={onAgregar} />)
    await user.clear(screen.getByLabelText('Cantidad de Gas 5Kg'))
    await user.type(screen.getByLabelText('Cantidad de Gas 5Kg'), '3')
    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))
    expect(onAgregar).toHaveBeenCalledWith(gas, '3')
  })

  it('deshabilita la compra si no hay stock', () => {
    render(<ProductCard producto={{ ...gas, stock: 0 }} onAgregar={() => {}} />)
    expect(screen.getByRole('button', { name: 'Agotado' })).toBeDisabled()
    expect(screen.getByLabelText('Cantidad de Gas 5Kg')).toBeDisabled()
  })
})
