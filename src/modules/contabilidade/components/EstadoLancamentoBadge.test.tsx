import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EstadoLancamentoBadge } from './EstadoLancamentoBadge'

describe('EstadoLancamentoBadge', () => {
  it('mostra "Rascunho" para rascunho', () => {
    render(<EstadoLancamentoBadge estado="rascunho" />)
    expect(screen.getByText('Rascunho')).toBeInTheDocument()
  })

  it('mostra "Lançado" para lancado', () => {
    render(<EstadoLancamentoBadge estado="lancado" />)
    expect(screen.getByText('Lançado')).toBeInTheDocument()
  })

  it('mostra "Anulado" para anulado', () => {
    render(<EstadoLancamentoBadge estado="anulado" />)
    expect(screen.getByText('Anulado')).toBeInTheDocument()
  })
})
