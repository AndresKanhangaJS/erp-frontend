import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'

import { useAuthStore } from '@/shared/stores/authStore'

import { AuthGuard } from './AuthGuard'

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/protegido']}>
      <Routes>
        <Route element={<AuthGuard />}>
          <Route path="/protegido" element={<div>Conteúdo protegido</div>} />
        </Route>
        <Route path="/login" element={<div>Página de login</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AuthGuard', () => {
  afterEach(() => {
    act(() => {
      useAuthStore.getState().logout()
    })
  })

  it('mostra o conteúdo protegido quando autenticado', () => {
    act(() => {
      useAuthStore.getState().setAuth({
        token: 'tok',
        user: { id: '1', name: 'Ana', email: 'ana@example.com' },
        permissions: [],
      })
    })

    renderWithRouter()

    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument()
  })

  it('redirecciona para /login quando não autenticado', () => {
    renderWithRouter()

    expect(screen.getByText('Página de login')).toBeInTheDocument()
    expect(screen.queryByText('Conteúdo protegido')).not.toBeInTheDocument()
  })
})
