import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useStore } from './useStore.js'
import { StoreContext } from '../context/StoreContext.js'

describe('useStore', () => {
  it('entrega el estado del contexto', () => {
    const wrapper = ({ children }) => <StoreContext.Provider value={{ carrito: {} }}>{children}</StoreContext.Provider>
    const { result } = renderHook(() => useStore(), { wrapper })
    expect(result.current).toEqual({ carrito: {} })
  })

  it('avisa si se usa fuera de <StoreProvider>', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useStore())).toThrow('useStore debe usarse dentro de <StoreProvider>')
    vi.restoreAllMocks()
  })
})
