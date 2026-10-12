import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorage } from './useLocalStorage.js'

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('useLocalStorage', () => {
  it('usa el valor inicial y guarda los cambios', () => {
    const { result } = renderHook(() => useLocalStorage('k', 1))
    expect(result.current[0]).toBe(1)
    act(() => result.current[1](2))
    expect(localStorage.getItem('k')).toBe('2')
  })

  it('recupera el valor guardado', () => {
    localStorage.setItem('k', JSON.stringify({ a: 1 }))
    const { result } = renderHook(() => useLocalStorage('k', null))
    expect(result.current[0]).toEqual({ a: 1 })
  })

  it('vuelve al valor inicial si el JSON está corrupto y tolera errores al guardar', () => {
    localStorage.setItem('k', '{malo')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('lleno')
    })
    const { result } = renderHook(() => useLocalStorage('k', 'inicial'))
    expect(result.current[0]).toBe('inicial')
  })
})
