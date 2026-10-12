import { ORDENES } from '../services/products.js'

/** Búsqueda por texto y orden del catálogo (componente controlado). */
export default function Filtros({ filtros, onCambiar }) {
  const cambiar = (e) => onCambiar({ ...filtros, [e.target.name]: e.target.value })

  return (
    <div className="filtros" role="search">
      <label>
        Buscar
        <input type="search" name="texto" value={filtros.texto} onChange={cambiar} placeholder="Ej: 15Kg" />
      </label>
      <label>
        Ordenar por
        <select name="orden" value={filtros.orden} onChange={cambiar}>
          {ORDENES.map((o) => (
            <option key={o.valor} value={o.valor}>{o.texto}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
