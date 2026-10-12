import { useContext } from 'react'
import { StoreContext } from '../context/StoreContext.js'

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore debe usarse dentro de <StoreProvider>')
  return store
}
