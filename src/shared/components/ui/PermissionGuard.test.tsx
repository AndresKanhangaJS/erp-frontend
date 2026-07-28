import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/shared/stores/authStore'

import { PermissionGuard } from './PermissionGuard'

describe('PermissionGuard', () => {
  afterEach(() => {
    act(() => {
      useAuthStore.getState().logout()
    })
  })

  it('mostra o conteúdo quando o utilizador tem a permissão', () => {
    act(() => {
      useAuthStore.getState().setAuth({
        token: 'tok',
        user: { id: '1', name: 'Ana', email: 'ana@example.com' },
        permissions: ['faturacao.emitir'],
      })
    })

    render(
      <PermissionGuard permission="faturacao.emitir">
        <button type="button">Emitir factura</button>
      </PermissionGuard>,
    )

    expect(screen.getByText('Emitir factura')).toBeInTheDocument()
  })

  it('esconde o conteúdo quando falta a permissão', () => {
    act(() => {
      useAuthStore.getState().setAuth({
        token: 'tok',
        user: { id: '1', name: 'Ana', email: 'ana@example.com' },
        permissions: [],
      })
    })

    render(
      <PermissionGuard permission="faturacao.emitir">
        <button type="button">Emitir factura</button>
      </PermissionGuard>,
    )

    expect(screen.queryByText('Emitir factura')).not.toBeInTheDocument()
  })

  it('mostra o fallback quando fornecido e falta a permissão', () => {
    render(
      <PermissionGuard permission="faturacao.emitir" fallback={<span>Sem acesso</span>}>
        <button type="button">Emitir factura</button>
      </PermissionGuard>,
    )

    expect(screen.getByText('Sem acesso')).toBeInTheDocument()
    expect(screen.queryByText('Emitir factura')).not.toBeInTheDocument()
  })
})
