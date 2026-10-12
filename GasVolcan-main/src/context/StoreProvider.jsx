import { StoreContext } from './StoreContext.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { PRODUCTOS_INICIALES } from '../services/products.js'
import { USUARIOS_INICIALES } from '../services/users.js'

// Las claves llevan versión: si cambias los datos iniciales, sube el número (v1 → v2).
export default function StoreProvider({ children }) {
  const [productos, setProductos] = useLocalStorage('gv-productos-v1', PRODUCTOS_INICIALES)
  const [carrito, setCarrito] = useLocalStorage('gv-carrito-v1', {})
  const [usuarios, setUsuarios] = useLocalStorage('gv-usuarios-v1', USUARIOS_INICIALES)
  const [sesion, setSesion] = useLocalStorage('gv-sesion-v1', null)
  const [pedidos, setPedidos] = useLocalStorage('gv-pedidos-v1', [])

  const value = {
    productos, setProductos, carrito, setCarrito, usuarios, setUsuarios, sesion, setSesion, pedidos, setPedidos,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
