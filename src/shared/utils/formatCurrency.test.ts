import { describe, expect, it } from 'vitest'

import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('formata AOA por omissão com 2 casas decimais', () => {
    const result = formatCurrency(125000)
    expect(result).toContain('125')
    expect(result).toContain('000')
    expect(result).toMatch(/,00/)
  })

  it('nunca arredonda para menos de 2 casas decimais', () => {
    expect(formatCurrency(10)).toMatch(/,00/)
    expect(formatCurrency(10.5)).toMatch(/,50/)
  })

  it('formata USD quando pedido', () => {
    expect(formatCurrency(100, 'USD')).toContain('100')
  })

  it('formata EUR quando pedido', () => {
    expect(formatCurrency(100, 'EUR')).toContain('100')
  })

  it('lida com zero', () => {
    expect(formatCurrency(0)).toMatch(/0,00/)
  })
})
