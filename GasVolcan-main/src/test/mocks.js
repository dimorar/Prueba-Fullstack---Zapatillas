import { vi } from 'vitest'

// Datos falsos para no depender de archivos ni red en las pruebas.
export const regiones = [
  { codigo: 'RM', nombre: 'Región Metropolitana', comunas: ['Santiago', 'Macul'] },
  { codigo: 'V', nombre: 'Región de Valparaíso', comunas: ['Valparaíso', 'Viña del Mar'] },
]

/** Reemplaza fetch global por uno que responde según la URL pedida. */
export function mockFetch(routes) {
  return vi.fn(async (url) => {
    const entry = Object.entries(routes).find(([pattern]) => url.includes(pattern))
    if (!entry) return { ok: false, status: 404, json: async () => ({}) }
    return { ok: true, status: 200, json: async () => entry[1] }
  })
}
