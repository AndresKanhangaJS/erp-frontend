import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SaldoLancamento } from './SaldoLancamento'

describe('SaldoLancamento', () => {
  it('mostra "Lançamento equilibrado" quando débito e crédito batem certo', () => {
    render(
      <SaldoLancamento
        saldo={{ totalDebito: 1000, totalCredito: 1000, diferenca: 0, equilibrado: true }}
      />,
    )
    expect(screen.getByText('Lançamento equilibrado')).toBeInTheDocument()
  })

  it('mostra a diferença quando desequilibrado', () => {
    render(
      <SaldoLancamento
        saldo={{ totalDebito: 1000, totalCredito: 700, diferenca: 300, equilibrado: false }}
      />,
    )
    expect(screen.queryByText('Lançamento equilibrado')).not.toBeInTheDocument()
    expect(screen.getByText(/Diferença de/)).toBeInTheDocument()
  })
})
