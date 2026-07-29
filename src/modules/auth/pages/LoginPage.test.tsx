import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import LoginPage from './LoginPage'

/**
 * Regressão: esta página rebentava em runtime (ecrã em branco, sem
 * ErrorBoundary) porque usava o FormField partilhado sem envolver o
 * <form> em <Form {...form}> (FormProvider) — useFormContext() dentro
 * de FormLabel/FormControl/FormMessage devolvia null. tsc/vitest
 * nunca apanhavam isto porque nenhum teste renderizava a página de
 * facto até agora.
 */
function renderLoginPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  it('renderiza sem rebentar, com os campos e labels associados', () => {
    renderLoginPage()

    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByLabelText('ID do tenant')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Palavra-passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })
})
