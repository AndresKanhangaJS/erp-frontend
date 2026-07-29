import { describe, expect, it } from 'vitest'

import { lancamentoSchema } from './lancamentoSchema'

function linha(
  overrides: Partial<{
    contaId: string
    contaCodigo: string
    contaDesignacao: string
    debito: number
    credito: number
  }> = {},
) {
  return {
    contaId: '1',
    contaCodigo: '1.1.01',
    contaDesignacao: 'Caixa',
    debito: 0,
    credito: 0,
    ...overrides,
  }
}

function base(linhas: ReturnType<typeof linha>[]) {
  return {
    data: '2026-07-29',
    descricao: 'Lançamento de teste',
    periodoId: 'periodo-1',
    linhas,
  }
}

describe('lancamentoSchema', () => {
  it('aceita um lançamento equilibrado com pelo menos 2 linhas', () => {
    const result = lancamentoSchema.safeParse(
      base([linha({ debito: 1000 }), linha({ contaId: '2', credito: 1000 })]),
    )
    expect(result.success).toBe(true)
  })

  it('rejeita um lançamento desequilibrado (débito ≠ crédito)', () => {
    const result = lancamentoSchema.safeParse(
      base([linha({ debito: 1000 }), linha({ contaId: '2', credito: 500 })]),
    )
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join('.') === 'linhas')).toBe(true)
    }
  })

  it('rejeita menos de 2 linhas', () => {
    const result = lancamentoSchema.safeParse(base([linha({ debito: 1000 })]))
    expect(result.success).toBe(false)
  })

  it('rejeita uma linha com débito E crédito preenchidos ao mesmo tempo', () => {
    const result = lancamentoSchema.safeParse(
      base([linha({ debito: 1000, credito: 500 }), linha({ contaId: '2', credito: 500 })]),
    )
    expect(result.success).toBe(false)
  })

  it('rejeita uma linha sem débito nem crédito', () => {
    const result = lancamentoSchema.safeParse(
      base([linha(), linha({ contaId: '2', credito: 1000 })]),
    )
    expect(result.success).toBe(false)
  })
})
