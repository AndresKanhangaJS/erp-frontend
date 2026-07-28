import { describe, expect, it } from 'vitest'

import { calcularTotais } from './utils'
import type { LinhaDocumento } from './types'

function linha(overrides: Partial<LinhaDocumento> = {}): LinhaDocumento {
  return {
    artigoId: '1',
    designacao: 'Artigo',
    quantidade: 1,
    precoUnitario: 1000,
    taxaIva: 14,
    ...overrides,
  }
}

describe('calcularTotais', () => {
  it('devolve zeros para uma lista vazia', () => {
    expect(calcularTotais([])).toEqual({ subtotal: 0, totalIva: 0, total: 0 })
  })

  it('calcula subtotal, IVA e total de uma linha simples', () => {
    const result = calcularTotais([linha({ quantidade: 2, precoUnitario: 1000, taxaIva: 14 })])
    expect(result.subtotal).toBe(2000)
    expect(result.totalIva).toBeCloseTo(280)
    expect(result.total).toBeCloseTo(2280)
  })

  it('soma corretamente linhas com taxas de IVA diferentes', () => {
    const result = calcularTotais([
      linha({ quantidade: 1, precoUnitario: 1000, taxaIva: 14 }),
      linha({ quantidade: 1, precoUnitario: 500, taxaIva: 0 }),
    ])
    expect(result.subtotal).toBe(1500)
    expect(result.totalIva).toBeCloseTo(140)
    expect(result.total).toBeCloseTo(1640)
  })
})
