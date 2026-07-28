import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'

import { useTenantStore } from '@/shared/stores/tenantStore'

import { ModuleGuard } from './ModuleGuard'

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/comercial']}>
      <Routes>
        <Route element={<ModuleGuard module="comercial" />}>
          <Route path="/comercial" element={<div>Página Comercial</div>} />
        </Route>
        <Route path="/planos" element={<div>Página de upgrade</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ModuleGuard', () => {
  afterEach(() => {
    act(() => {
      useTenantStore.getState().clearTenant()
    })
  })

  it('mostra a rota quando o módulo está activo', () => {
    act(() => {
      useTenantStore
        .getState()
        .setTenant({ tenantId: 't1', plan: 'pro', activeModules: ['comercial'] })
    })

    renderWithRouter()

    expect(screen.getByText('Página Comercial')).toBeInTheDocument()
  })

  it('redirecciona para /planos quando o módulo está inactivo', () => {
    act(() => {
      useTenantStore
        .getState()
        .setTenant({ tenantId: 't1', plan: 'starter', activeModules: ['faturacao'] })
    })

    renderWithRouter()

    expect(screen.getByText('Página de upgrade')).toBeInTheDocument()
    expect(screen.queryByText('Página Comercial')).not.toBeInTheDocument()
  })
})
