import { createContext } from 'react'

// Estado compartido de la tienda (productos, carrito, usuarios y sesión).
// Va en su propio archivo para cumplir la regla react-refresh/only-export-components.
export const StoreContext = createContext(null)
