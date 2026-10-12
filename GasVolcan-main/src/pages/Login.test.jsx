import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { CLIENTE, conSesion, guardar } from '../test/datos.js'
import { iniciarSesion } from '../test/formularios.js'
import { renderAt } from '../test/renderWithRouter.jsx'

beforeEach(() => {
  localStorage.clear()
  guardar('usuarios', [CLIENTE])
})

describe('Inicio de sesión', () => {
  it('rechaza credenciales incorrectas', async () => {
    const user = userEvent.setup()
    renderAt('/login')
    await iniciarSesion(user, 'ana@gmail.com', 'incorrecta')
    expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
  })

  it('un cliente entra, ve su nombre en el menú y puede cerrar sesión', async () => {
    const user = userEvent.setup()
    renderAt('/login')
    await iniciarSesion(user, 'ana@gmail.com', 'secreto1')

    expect(screen.queryByRole('heading', { name: 'Inicio de sesión' })).not.toBeInTheDocument()
    expect(screen.getByText('Hola, Ana')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tu carga de gas a un click')
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('avisa si ya hay una sesión iniciada', () => {
    conSesion(CLIENTE)
    renderAt('/login')
    expect(screen.getByRole('heading', { name: 'Ya iniciaste sesión' })).toBeInTheDocument()
    expect(screen.getByText('Estás conectado como Ana Pérez.')).toBeInTheDocument()
  })
})
