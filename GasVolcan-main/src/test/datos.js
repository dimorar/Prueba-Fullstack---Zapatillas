// Atajos para preparar localStorage antes de renderizar (sin pasar por la interfaz).
export const ADMIN = { id: 1, nombre: 'Admin Sistema', rol: 'Admin' }

export const CLIENTE = {
  id: 2, rut: '11111111-1', nombre: 'Ana Pérez', email: 'ana@gmail.com', password: 'secreto1',
  rol: 'Cliente', region: 'RM', comuna: 'Macul',
}

export function guardar(clave, valor) {
  localStorage.setItem(`gv-${clave}-v1`, JSON.stringify(valor))
}

export function conSesion(usuario) {
  guardar('sesion', { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol })
}
