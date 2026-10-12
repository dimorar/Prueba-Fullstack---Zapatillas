import { Link } from 'react-router'

const CONSEJOS = [
  { titulo: 'Sobre nosotros', texto: 'Distribuidora líder en entrega de gas licuado para hogares y comercios.' },
  { titulo: 'Consejos de seguridad', texto: 'Revisa periódicamente la manguera y el regulador de tu cilindro.' },
]

const PASOS = [
  'Elige tus cilindros en el catálogo.',
  'Inicia sesión o regístrate.',
  'Confirma la dirección y sigue el estado de tu pedido.',
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Tu carga de gas a un click</h1>
        <p>Reparto rápido y seguro directo a tu hogar.</p>
        <Link to="/catalogo" className="btn">Ver productos</Link>
      </section>
      <section className="pasos" aria-labelledby="titulo-pasos">
        <h2 id="titulo-pasos">¿Cómo comprar?</h2>
        <ol>
          {PASOS.map((paso) => (
            <li key={paso}>{paso}</li>
          ))}
        </ol>
      </section>
      <section className="info-section">
        {CONSEJOS.map((c) => (
          <article key={c.titulo}>
            <h2>{c.titulo}</h2>
            <p>{c.texto}</p>
          </article>
        ))}
      </section>
    </>
  )
}
