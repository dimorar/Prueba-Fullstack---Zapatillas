import { formatearRut, validarCorreo, validarPassword, validarRut } from './validation.js'

// ⚠️ Solo para la demo: las contraseñas en texto plano en el navegador NO son seguras.
// En un sistema real la autenticación se hace en un backend.
export const USUARIOS_INICIALES = [
  {
    id: 1,
    rut: '12345678-5',
    nombre: 'Admin Sistema',
    email: 'admin@duoc.cl',
    password: 'admin123',
    rol: 'Admin',
    region: 'RM',
    comuna: 'Santiago',
  },
]

/** Revisa todos los campos y devuelve un objeto { campo: mensaje }. Vacío = sin errores. */
export function validarUsuario(datos, usuarios = [], idEditando = null) {
  const errores = {}
  if (!validarRut(datos.rut)) errores.rut = 'RUN inválido. Revisa el dígito verificador.'
  else if (
    usuarios.some((u) => u.rut === formatearRut(datos.rut) && String(u.id) !== String(idEditando))
  ) {
    errores.rut = 'Ya existe un usuario con ese RUN.'
  }
  if (!datos.nombre?.trim()) errores.nombre = 'El nombre es obligatorio.'
  if (!validarCorreo(datos.email)) {
    errores.email = 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  } else if (
    usuarios.some(
      (u) => u.email === datos.email.trim().toLowerCase() && String(u.id) !== String(idEditando),
    )
  ) {
    errores.email = 'Ya existe un usuario con ese correo.'
  }
  // Al editar, la contraseña puede quedar vacía (se mantiene la anterior).
  if (!(idEditando && !datos.password) && !validarPassword(datos.password)) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres.'
  }
  if (!datos.region) errores.region = 'Selecciona una región.'
  if (!datos.comuna) errores.comuna = 'Selecciona una comuna.'
  return errores
}

/** Crea (sin id) o actualiza (con id) un usuario. Devuelve la nueva lista. */
export function guardarUsuario(usuarios, datos, idEditando = null) {
  const normalizado = {
    rut: formatearRut(datos.rut),
    nombre: datos.nombre.trim(),
    email: datos.email.trim().toLowerCase(),
    region: datos.region,
    comuna: datos.comuna,
  }
  if (idEditando) {
    return usuarios.map((u) =>
      String(u.id) === String(idEditando)
        ? { ...u, ...normalizado, ...(datos.password ? { password: datos.password } : {}) }
        : u,
    )
  }
  return [...usuarios, { id: Date.now(), ...normalizado, password: datos.password, rol: 'Cliente' }]
}

export function eliminarUsuario(usuarios, id) {
  return usuarios.filter((u) => String(u.id) !== String(id))
}

/** Devuelve el usuario si el correo y la contraseña coinciden, o null. */
export function autenticar(usuarios, email, password) {
  const correo = email.trim().toLowerCase()
  return usuarios.find((u) => u.email === correo && u.password === password) ?? null
}

export function esAdmin(usuario) {
  return usuario?.rol === 'Admin'
}
