import { useState } from 'react'
import UserForm from '../UserForm.jsx'
import { useStore } from '../../hooks/useStore.js'
import { eliminarUsuario, guardarUsuario, validarUsuario } from '../../services/users.js'

/** CRUD de usuarios: tabla + formulario para crear o editar. */
export default function Usuarios() {
  const { usuarios, setUsuarios, sesion } = useStore()
  const [editando, setEditando] = useState(null) // usuario en edición o null
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState(null)

  const guardar = (datos) => {
    const idEdit = editando?.id ?? null
    const errs = validarUsuario(datos, usuarios, idEdit)
    setErrores(errs)
    if (Object.keys(errs).length > 0) return
    setUsuarios(guardarUsuario(usuarios, datos, idEdit))
    setMensaje({ texto: idEdit ? 'Usuario actualizado con éxito.' : 'Usuario creado con éxito.' })
    setEditando(null)
  }

  const borrar = (id) => {
    if (String(id) === String(sesion.id)) {
      return setMensaje({ texto: 'No puedes eliminar tu propia cuenta.', error: true })
    }
    setUsuarios(eliminarUsuario(usuarios, id))
    setMensaje({ texto: 'Usuario eliminado.' })
  }

  const editar = (usuario) => {
    setEditando(usuario)
    setErrores({})
  }

  return (
    <section aria-labelledby="titulo-usuarios">
      <h3 id="titulo-usuarios">Usuarios</h3>
      {mensaje && (
        <p className={mensaje.error ? 'alerta alerta--error' : 'alerta'} role="alert">{mensaje.texto}</p>
      )}
      <div className="tabla-scroll">
        <table className="admin-table">
          <thead>
            <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.rut}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>
                  <button onClick={() => editar(u)}>Editar</button>{' '}
                  <button onClick={() => borrar(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-box">
        <h3>{editando ? `Editar usuario: ${editando.nombre}` : 'Crear usuario'}</h3>
        <UserForm
          key={editando?.id ?? 'nuevo'}
          inicial={editando ?? undefined}
          errores={errores}
          textoBoton={editando ? 'Actualizar usuario' : 'Crear usuario'}
          onGuardar={guardar}
          onCancelar={editando ? () => editar(null) : undefined}
        />
      </div>
    </section>
  )
}
