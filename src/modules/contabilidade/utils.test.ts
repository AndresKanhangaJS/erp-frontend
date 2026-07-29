import { describe, expect, it } from 'vitest'

import { calcularSaldoLancamento } from './utils'
import type { LinhaLancamento } from './types'

function linha(overrides: Partial<LinhaLancamento> = {}): LinhaLancamento {
  return {
    contaId: '1',
    contaCodigo: '1.1.01',
    contaDesignacao: 'Caixa',
    debito: 0,
    credito: 0,
    ...overrides,
  }
}

describe('calcularSaldoLancamento', () => {
  it('devolve equilibrado=true e diferenca=0 para uma lista vazia', () => {
    const resultado = calcularSaldoLancamento([])
    expect(resultado).toEqual({ totalDebito: 0, totalCredito: 0, diferenca: 0, equilibrado: true })
  })

  it('considera equilibrado quando débito e crédito batem certo', () => {
    const resultado = calcularSaldoLancamento([linha({ debito: 5000 }), linha({ credito: 5000 })])
    expect(resultado.equilibrado).toBe(true)
    expect(resultado.diferenca).toBe(0)
  })

  it('considera desequilibrado quando débito e crédito não batem certo', () => {
    const resultado = calcularSaldoLancamento([linha({ debito: 5000 }), linha({ credito: 4000 })])
    expect(resultado.equilibrado).toBe(false)
    expect(resultado.diferenca).toBe(1000)
  })

  it('tolera diferenças de arredondamento inferiores a 0,005', () => {
    const resultado = calcularSaldoLancamento([linha({ debito: 100.001 }), linha({ credito: 100 })])
    expect(resultado.equilibrado).toBe(true)
  })
})
