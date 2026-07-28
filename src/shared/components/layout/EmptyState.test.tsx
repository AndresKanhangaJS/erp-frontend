import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('mostra o título e a descrição', () => {
    render(<EmptyState title="Sem documentos" description="Emite a primeira factura" />)

    expect(screen.getByText('Sem documentos')).toBeInTheDocument()
    expect(screen.getByText('Emite a primeira factura')).toBeInTheDocument()
  })

  it('não mostra descrição quando não fornecida', () => {
    render(<EmptyState title="Sem documentos" />)

    expect(screen.getByText('Sem documentos')).toBeInTheDocument()
  })
})
