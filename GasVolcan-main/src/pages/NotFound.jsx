import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="hero">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn">Volver al inicio</Link>
    </section>
  )
}
