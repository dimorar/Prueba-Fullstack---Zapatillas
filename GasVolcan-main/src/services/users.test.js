import { describe, expect, it } from 'vitest'
import {
  USUARIOS_INICIALES, autenticar, eliminarUsuario, esAdmin, guardarUsuario, validarUsuario,
} from './users.js'

const valido = {
  rut: '11.111.111-1', nombre: 'Ana Pérez', email: 'Ana@Gmail.com', password: 'secreto1', region: 'RM', comuna: 'Macul',
}

describe('usuarios', () => {
  it('no reporta errores con datos válidos', () => {
    expect(validarUsuario(valido, USUARIOS_INICIALES)).toEqual({})
  })

  it('reporta cada campo inválido', () => {
    const errores = validarUsuario({ rut: '1', nombre: ' ', email: 'x@y.com', password: '1' }, [])
    expect(Object.keys(errores).sort()).toEqual(['comuna', 'email', 'nombre', 'password', 'region', 'rut'])
  })

  it('no permite RUN duplicado, salvo el del propio usuario al editar', () => {
    const datos = { ...valido, rut: '12345678-5' }
    expect(validarUsuario(datos, USUARIOS_INICIALES).rut).toMatch(/Ya existe/)
    expect(validarUsuario({ ...datos, password: '' }, USUARIOS_INICIALES, 1)).toEqual({})
  })

  it('no permite correo duplicado, salvo el del propio usuario al editar', () => {
    const datos = { ...valido, email: ' ADMIN@duoc.cl ' }
    expect(validarUsuario(datos, USUARIOS_INICIALES).email).toMatch(/Ya existe/)
    expect(validarUsuario({ ...datos, rut: '12345678-5', password: '' }, USUARIOS_INICIALES, 1)).toEqual({})
  })

  it('crea usuarios normalizados con rol Cliente', () => {
    const lista = guardarUsuario(USUARIOS_INICIALES, valido)
    expect(lista).toHaveLength(2)
    expect(lista[1]).toMatchObject({ rut: '11111111-1', email: 'ana@gmail.com', rol: 'Cliente' })
  })

  it('edita manteniendo la contraseña si viene vacía', () => {
    const editado = guardarUsuario(USUARIOS_INICIALES, { ...valido, rut: '12345678-5', password: '' }, 1)
    expect(editado[0]).toMatchObject({ nombre: 'Ana Pérez', password: 'admin123', rol: 'Admin' })
    const conPass = guardarUsuario(USUARIOS_INICIALES, { ...valido, password: 'nueva123' }, 1)
    expect(conPass[0].password).toBe('nueva123')
  })

  it('elimina, autentica y reconoce administradores', () => {
    expect(eliminarUsuario(USUARIOS_INICIALES, '1')).toEqual([])
    expect(autenticar(USUARIOS_INICIALES, ' ADMIN@duoc.cl', 'admin123')?.nombre).toBe('Admin Sistema')
    expect(autenticar(USUARIOS_INICIALES, 'admin@duoc.cl', 'mala')).toBeNull()
    expect(esAdmin({ rol: 'Admin' })).toBe(true)
    expect(esAdmin(null)).toBe(false)
  })
})
