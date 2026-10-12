import { useId, useState } from 'react'
import { useFetch } from '../hooks/useFetch.js'
import { REGIONES_URL, comunasDeRegion } from '../services/regiones.js'

const VACIO = { rut: '', nombre: '', email: '', password: '', region: '', comuna: '' }

/**
 * Formulario controlado de usuario. Se usa en Registro (Contacto) y en el panel Admin.
 * El padre valida y decide qué hacer en onGuardar; aquí solo se muestran los errores.
 * Para "reiniciar" el formulario, el padre cambia su prop `key`.
 */
export default function UserForm({ inicial = VACIO, errores = {}, textoBoton, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({ ...VACIO, ...inicial, password: '' })
  const { data: regiones, error, loading } = useFetch(REGIONES_URL)
  const uid = useId()
  // El error va FUERA del <label> y se asocia con aria-describedby: así el nombre accesible
  // del campo sigue siendo solo "RUN", "Correo", etc. (y los lectores de pantalla leen el error).
  const errorDe = (name) =>
    errores[name] ? { 'aria-invalid': true, 'aria-describedby': `${uid}-${name}` } : {}
  const mensajeError = (name) =>
    errores[name] && <span id={`${uid}-${name}`} className="error">{errores[name]}</span>

  const cambiar = (e) => {
    const { name, value } = e.target
    // Al cambiar de región se borra la comuna elegida (puede no existir en la nueva).
    setDatos((d) => ({ ...d, [name]: value, ...(name === 'region' ? { comuna: '' } : {}) }))
  }

  const enviar = (e) => {
    e.preventDefault()
    onGuardar(datos)
  }

  const campo = (name, label, props = {}) => (
    <div className="campo">
      <label>
        {label}
        <input name={name} value={datos[name]} onChange={cambiar} {...errorDe(name)} {...props} />
      </label>
      {mensajeError(name)}
    </div>
  )

  return (
    <form onSubmit={enviar} noValidate aria-label={`Formulario: ${textoBoton}`}>
      {campo('rut', 'RUN', { placeholder: '12345678-5' })}
      {campo('nombre', 'Nombre completo')}
      {campo('email', 'Correo', { type: 'email', placeholder: 'nombre@duoc.cl' })}
      {campo('password', 'Contraseña', { type: 'password', autoComplete: 'new-password' })}

      {loading && <p role="status">Cargando regiones…</p>}
      {error && <p className="error" role="alert">No se pudieron cargar las regiones.</p>}

      <div className="campo">
      <label>
        Región
        <select name="region" value={datos.region} onChange={cambiar} {...errorDe('region')}>
          <option value="">Seleccione región</option>
          {(regiones ?? []).map((r) => (
            <option key={r.codigo} value={r.codigo}>{r.nombre}</option>
          ))}
        </select>
      </label>
      {mensajeError('region')}
      </div>
      <div className="campo">
      <label>
        Comuna
        <select name="comuna" value={datos.comuna} onChange={cambiar} disabled={!datos.region} {...errorDe('comuna')}>
          <option value="">Seleccione comuna</option>
          {comunasDeRegion(regiones, datos.region).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      {mensajeError('comuna')}
      </div>

      <button type="submit" className="btn">{textoBoton}</button>
      {onCancelar && (
        <button type="button" className="btn btn--secundario" onClick={onCancelar}>Cancelar</button>
      )}
    </form>
  )
}
