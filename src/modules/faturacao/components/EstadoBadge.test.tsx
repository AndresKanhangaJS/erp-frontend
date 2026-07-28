import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EstadoBadge } from './EstadoBadge'

describe('EstadoBadge', () => {
  it('mostra "Rascunho" para rascunho', () => {
    render(<EstadoBadge estado="rascunho" />)
    expect(screen.getByText('Rascunho')).toBeInTheDocument()
  })

  it('mostra "Emitido" para emitido', () => {
    render(<EstadoBadge estado="emitido" />)
    expect(screen.getByText('Emitido')).toBeInTheDocument()
  })

  it('mostra "Anulado" para anulado', () => {
    render(<EstadoBadge estado="anulado" />)
    expect(screen.getByText('Anulado')).toBeInTheDocument()
  })
})
