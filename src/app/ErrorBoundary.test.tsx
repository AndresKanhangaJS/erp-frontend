import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ErrorBoundary } from './ErrorBoundary'

function Bomb(): never {
  throw new Error('Falha de teste')
}

describe('ErrorBoundary', () => {
  it('mostra o fallback quando um descendente rebenta', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Ocorreu um erro inesperado')).toBeInTheDocument()
    expect(screen.getByText('Falha de teste')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('renderiza os filhos normalmente quando não há erro', () => {
    render(
      <ErrorBoundary>
        <p>Tudo bem</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('Tudo bem')).toBeInTheDocument()
  })
})
