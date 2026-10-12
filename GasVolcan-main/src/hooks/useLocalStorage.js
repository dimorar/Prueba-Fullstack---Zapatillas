import { useEffect, useState } from 'react'

/**
 * Como useState, pero guarda el valor en localStorage para que sobreviva a recargas.
 * Reemplaza los JSON.parse(localStorage.getItem(...)) repetidos del código legacy.
 */
export function useLocalStorage(key, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(key)
      return guardado !== null ? JSON.parse(guardado) : valorInicial
    } catch {
      return valorInicial // JSON corrupto o storage bloqueado
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(valor))
    } catch {
      // Sin espacio o storage bloqueado: la app sigue funcionando en memoria.
    }
  }, [key, valor])

  return [valor, setValor]
}
