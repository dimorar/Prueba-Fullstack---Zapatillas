import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ADMIN, CLIENTE, conSesion, guardar } from '../test/datos.js'
import { iniciarSesion, llenarUsuario } from '../test/formularios.js'
import { mockFetch, regiones } from '../test/mocks.js'
import { renderAt } from '../test/renderWithRouter.jsx'
import { USUARIOS_INICIALES } from '../services/users.js'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', mockFetch({ 'data/regiones.json': regiones }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const fila = (texto) => screen.getByRole('cell', { name: texto }).closest('tr')

describe('Acceso al panel (HU-03)', () => {
  it('sin sesión redirige al login y vuelve al panel después de entrar', async () => {
    const user = userEvent.setup()
    renderAt('/admin')
    expect(screen.getByRole('heading', { name: 'Inicio de sesión' })).toBeInTheDocument()
    await iniciarSesion(user, 'admin@duoc.cl', 'admin123')
    expect(screen.getByRole('heading', { name: 'Panel de administración' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument()
  })

  it('un administrador que entra desde /login llega al panel', async () => {
    const user = userEvent.setup()
    renderAt('/login')
    await iniciarSesion(user, 'admin@duoc.cl', 'admin123')
    expect(screen.getByRole('heading', { name: 'Panel de administración' })).toBeInTheDocument()
  })

  it('muestra las secciones de pedidos, inventario y usuarios', () => {
    conSesion(ADMIN)
    renderAt('/admin')
    for (const nombre of [/Pedidos/, 'Inventario (control de stock)', 'Usuarios']) {
      expect(screen.getByRole('region', { name: nombre })).toBeInTheDocument()
    }
  })

  it('un cliente no tiene acceso', () => {
    guardar('usuarios', [...USUARIOS_INICIALES, CLIENTE])
    conSesion(CLIENTE)
    renderAt('/admin')
    expect(screen.getByRole('heading', { name: 'Acceso restringido' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument()
  })
})

describe('Usuarios', () => {
  it('crea, edita y elimina usuarios', async () => {
    const user = userEvent.setup()
    conSesion(ADMIN)
    renderAt('/admin')

    await llenarUsuario(user, { rut: '11111111-1', nombre: 'Pedro', email: 'pedro@duoc.cl', password: '12' })
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }))
    expect(screen.getByText(/al menos 6 caracteres/)).toBeInTheDocument()
    await user.type(screen.getByLabelText('Contraseña'), '3456')
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Usuario creado con éxito.')

    await user.click(within(fila('Pedro')).getByRole('button', { name: 'Editar' }))
    expect(screen.getByRole('heading', { name: 'Editar usuario: Pedro' })).toBeInTheDocument()
    await user.clear(screen.getByLabelText('Nombre completo'))
    await user.type(screen.getByLabelText('Nombre completo'), 'Pedro Soto')
    await user.click(screen.getByRole('button', { name: 'Actualizar usuario' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Usuario actualizado con éxito.')

    await user.click(within(fila('Pedro Soto')).getByRole('button', { name: 'Editar' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.getByRole('heading', { name: 'Crear usuario' })).toBeInTheDocument()

    await user.click(within(fila('Admin Sistema')).getByRole('button', { name: 'Eliminar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('No puedes eliminar tu propia cuenta.')
    await user.click(within(fila('Pedro Soto')).getByRole('button', { name: 'Eliminar' }))
    expect(screen.queryByRole('cell', { name: 'Pedro Soto' })).not.toBeInTheDocument()
  })
})
