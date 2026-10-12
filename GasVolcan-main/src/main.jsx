import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

// HashRouter usa URLs como /#/catalogo. GitHub Pages solo sirve archivos estáticos,
// y con el "#" nunca pide al servidor una ruta que no existe (evita el 404 al recargar).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
