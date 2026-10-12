import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import UserForm from './UserForm.jsx'
import { mockFetch, regiones } from '../test/mocks.js'

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch({ 'data/regiones.json': regiones }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('UserForm', () => {
  it('carga las regiones y reinicia la comuna al cambiar de región', async () => {
    const user = userEvent.setup()
    render(<UserForm textoBoton="Guardar" onGuardar={() => {}} />)
    expect(screen.getByRole('status')).toHaveTextContent('Cargando regiones')
    await screen.findByRole('option', { name: 'Región Metropolitana' })
    expect(screen.getByLabelText('Comuna')).toBeDisabled()

    await user.selectOptions(screen.getByLabelText('Región'), 'RM')
    await user.selectOptions(screen.getByLabelText('Comuna'), 'Macul')
    await user.selectOptions(screen.getByLabelText('Región'), 'V')
    expect(screen.getByLabelText('Comuna')).toHaveValue('')
    expect(screen.getByRole('option', { name: 'Viña del Mar' })).toBeInTheDocument()
  })

  it('envía los datos escritos y muestra los errores recibidos', async () => {
    const user = userEvent.setup()
    const onGuardar = vi.fn()
    render(<UserForm textoBoton="Guardar" errores={{ rut: 'RUN inválido' }} onGuardar={onGuardar} />)
    expect(screen.getByLabelText('RUN')).toHaveAccessibleDescription('RUN inválido')

    await user.type(screen.getByLabelText('Nombre completo'), 'Ana')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(onGuardar).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Ana', rut: '' }))
  })

  it('precarga un usuario para editar sin mostrar su contraseña', async () => {
    const user = userEvent.setup()
    const onCancelar = vi.fn()
    render(
      <UserForm
        textoBoton="Actualizar"
        inicial={{ rut: '11111111-1', nombre: 'Ana', password: 'secreta' }}
        onGuardar={() => {}}
        onCancelar={onCancelar}
      />,
    )
    expect(screen.getByLabelText('RUN')).toHaveValue('11111111-1')
    expect(screen.getByLabelText('Contraseña')).toHaveValue('')
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancelar).toHaveBeenCalled()
  })
})
