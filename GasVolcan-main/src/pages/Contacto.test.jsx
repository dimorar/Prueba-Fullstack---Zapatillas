import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { llenarUsuario } from '../test/formularios.js'
import { mockFetch, regiones } from '../test/mocks.js'
import { renderAt } from '../test/renderWithRouter.jsx'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', mockFetch({ 'data/regiones.json': regiones }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Registro y contacto (HU-02)', () => {
  it('muestra errores con RUN y correo inválidos', async () => {
    const user = userEvent.setup()
    renderAt('/contacto')
    await llenarUsuario(user, { rut: '12345678-K', nombre: 'Ana', email: 'ana@hotmail.com', password: '123456' })
    await user.click(screen.getByRole('button', { name: 'Registrarse' }))
    expect(screen.getByText(/RUN inválido/)).toBeInTheDocument()
    expect(screen.getByText(/El correo debe ser/)).toBeInTheDocument()
  })

  it('registra un cliente válido y carga comunas según la región', async () => {
    const user = userEvent.setup()
    renderAt('/contacto')
    await llenarUsuario(user, {
      rut: '11.111.111-1', nombre: 'Ana Pérez', email: 'ana@gmail.com', password: 'secreto1', region: 'V', comuna: 'Viña del Mar',
    })
    await user.click(screen.getByRole('button', { name: 'Registrarse' }))
    expect(screen.getByText('Registro exitoso.')).toBeInTheDocument()
    const guardados = JSON.parse(localStorage.getItem('gv-usuarios-v1'))
    expect(guardados.at(-1)).toMatchObject({ rut: '11111111-1', comuna: 'Viña del Mar', rol: 'Cliente' })
  })

  it('avisa si no se pueden cargar las regiones', async () => {
    vi.stubGlobal('fetch', mockFetch({}))
    renderAt('/contacto')
    expect(await screen.findByText('No se pudieron cargar las regiones.')).toBeInTheDocument()
  })

  it('valida y envía el formulario de contacto', async () => {
    const user = userEvent.setup()
    renderAt('/contacto')
    const form = screen.getByRole('button', { name: 'Enviar' }).closest('form')
    const enviar = () => user.click(within(form).getByRole('button', { name: 'Enviar' }))

    await enviar()
    expect(screen.getByRole('alert')).toHaveTextContent('El nombre es obligatorio.')

    await user.type(within(form).getByLabelText('Nombre'), 'Luis')
    await user.type(within(form).getByLabelText('Correo'), 'luis@yahoo.com')
    await enviar()
    expect(screen.getByRole('alert')).toHaveTextContent('El correo debe ser')

    await user.clear(within(form).getByLabelText('Correo'))
    await user.type(within(form).getByLabelText('Correo'), 'luis@duoc.cl')
    await enviar()
    expect(screen.getByRole('alert')).toHaveTextContent('El mensaje debe tener')

    await user.type(within(form).getByLabelText(/Mensaje/), 'Necesito un cilindro')
    await enviar()
    expect(screen.getByRole('alert')).toHaveTextContent('Mensaje enviado con éxito')
  })
})
