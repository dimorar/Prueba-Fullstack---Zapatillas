import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Filtros from './Filtros.jsx'

describe('Filtros', () => {
  it('avisa cada cambio conservando el resto de los filtros', async () => {
    const user = userEvent.setup()
    const onCambiar = vi.fn()
    render(<Filtros filtros={{ texto: '', orden: 'relevancia' }} onCambiar={onCambiar} />)

    await user.type(screen.getByRole('searchbox', { name: 'Buscar' }), 'g')
    expect(onCambiar).toHaveBeenLastCalledWith({ texto: 'g', orden: 'relevancia' })

    await user.selectOptions(screen.getByLabelText('Ordenar por'), 'precio-desc')
    expect(onCambiar).toHaveBeenLastCalledWith({ texto: '', orden: 'precio-desc' })
  })
})
