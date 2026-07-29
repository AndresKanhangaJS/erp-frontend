import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EstadoBadge } from './EstadoBadge'

describe('EstadoBadge', () => {
  it('mostra "Rascunho" para rascunho', () => {
    render(<EstadoBadge estado="rascunho" />)
    expect(screen.getByText('Rascunho')).toBeInTheDocument()
  })

  it('mostra "Emitida" para emitida', () => {
    render(<EstadoBadge estado="emitida" />)
    expect(screen.getByText('Emitida')).toBeInTheDocument()
  })

  it('mostra "Paga" para paga', () => {
    render(<EstadoBadge estado="paga" />)
    expect(screen.getByText('Paga')).toBeInTheDocument()
  })

  it('mostra "Anulada" para anulada', () => {
    render(<EstadoBadge estado="anulada" />)
    expect(screen.getByText('Anulada')).toBeInTheDocument()
  })
})
