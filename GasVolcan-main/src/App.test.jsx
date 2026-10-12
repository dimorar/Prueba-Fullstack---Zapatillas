import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderAt } from './test/renderWithRouter.jsx'

beforeEach(() => {
  localStorage.clear()
})

describe('Navegación', () => {
  it('muestra la portada con los pasos para comprar', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tu carga de gas a un click')
    expect(screen.getByRole('heading', { name: '¿Cómo comprar?' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('muestra 404 en rutas desconocidas', () => {
    renderAt('/no-existe')
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })

  it('abre y cierra el menú en pantallas chicas', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const boton = screen.getByRole('button', { name: 'Menú' })
    expect(boton).toHaveAttribute('aria-expanded', 'false')
    await user.click(boton)
    expect(boton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: 'Principal' })).toHaveClass('abierto')
    await user.click(screen.getByRole('link', { name: 'Contacto/Registro' }))
    expect(boton).toHaveAttribute('aria-expanded', 'false')
  })
})
