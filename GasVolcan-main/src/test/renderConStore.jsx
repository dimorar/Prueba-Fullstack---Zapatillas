import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import StoreProvider from '../context/StoreProvider.jsx'

/** Renderiza un componente suelto con el estado global y un router (para probar secciones aisladas). */
export function renderConStore(ui) {
  return render(
    <MemoryRouter>
      <StoreProvider>{ui}</StoreProvider>
    </MemoryRouter>,
  )
}
