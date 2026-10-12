/** Etiqueta de color según el estado del pedido. */
export default function EstadoPedido({ estado }) {
  const clase = estado.toLowerCase().replace(' ', '-')
  return <span className={`estado estado--${clase}`}>{estado}</span>
}
