import { describe, expect, it } from 'vitest'
import { comunasDeRegion } from './regiones.js'
import { regiones } from '../test/mocks.js'

describe('regiones', () => {
  it('devuelve las comunas de una región o lista vacía', () => {
    expect(comunasDeRegion(regiones, 'RM')).toEqual(['Santiago', 'Macul'])
    expect(comunasDeRegion(regiones, 'X')).toEqual([])
    expect(comunasDeRegion(null, 'RM')).toEqual([])
  })
})
