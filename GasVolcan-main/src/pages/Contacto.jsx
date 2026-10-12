import { useState } from 'react'
import UserForm from '../components/UserForm.jsx'
import { useStore } from '../hooks/useStore.js'
import { guardarUsuario, validarUsuario } from '../services/users.js'
import { MAX_MENSAJE, validarCorreo, validarMensaje } from '../services/validation.js'

// HU-02: registro con validación de RUN y correo + formulario de contacto.
export default function Contacto() {
  const { usuarios, setUsuarios } = useStore()
  const [erroresReg, setErroresReg] = useState({})
  const [okReg, setOkReg] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const [contacto, setContacto] = useState({ nombre: '', email: '', mensaje: '' })
  const [estadoContacto, setEstadoContacto] = useState(null)

  const registrar = (datos) => {
    const errores = validarUsuario(datos, usuarios)
    setErroresReg(errores)
    setOkReg(false)
    if (Object.keys(errores).length > 0) return
    setUsuarios(guardarUsuario(usuarios, datos))
    setOkReg(true)
    setFormKey((k) => k + 1) // nueva key = formulario limpio
  }

  const enviarContacto = (e) => {
    e.preventDefault()
    if (!contacto.nombre.trim()) return setEstadoContacto({ error: 'El nombre es obligatorio.' })
    if (!validarCorreo(contacto.email)) {
      return setEstadoContacto({ error: 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.' })
    }
    if (!validarMensaje(contacto.mensaje)) {
      return setEstadoContacto({ error: `El mensaje debe tener entre 1 y ${MAX_MENSAJE} caracteres.` })
    }
    setEstadoContacto({ ok: 'Mensaje enviado con éxito. Nos pondremos en contacto pronto.' })
    setContacto({ nombre: '', email: '', mensaje: '' })
  }

  const cambiarContacto = (e) => setContacto((c) => ({ ...c, [e.target.name]: e.target.value }))

  return (
    <div className="split-view">
      <section className="form-box">
        <h2>Registro de cliente</h2>
        {okReg && <p className="alerta" role="alert">Registro exitoso.</p>}
        <UserForm key={formKey} errores={erroresReg} textoBoton="Registrarse" onGuardar={registrar} />
      </section>

      <section className="form-box">
        <h2>Contacto</h2>
        {estadoContacto?.error && <p className="alerta alerta--error" role="alert">{estadoContacto.error}</p>}
        {estadoContacto?.ok && <p className="alerta" role="alert">{estadoContacto.ok}</p>}
        <form onSubmit={enviarContacto} noValidate>
          <label>
            Nombre
            <input name="nombre" value={contacto.nombre} onChange={cambiarContacto} />
          </label>
          <label>
            Correo
            <input name="email" type="email" value={contacto.email} onChange={cambiarContacto} />
          </label>
          <label>
            Mensaje
            <textarea name="mensaje" maxLength={MAX_MENSAJE} value={contacto.mensaje} onChange={cambiarContacto} />
            <small>{contacto.mensaje.length}/{MAX_MENSAJE}</small>
          </label>
          <button type="submit" className="btn">Enviar</button>
        </form>
      </section>
    </div>
  )
}
