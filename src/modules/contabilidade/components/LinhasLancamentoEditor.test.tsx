import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import type { LancamentoFormValues } from '../schemas/lancamentoSchema'
import { LinhasLancamentoEditor } from './LinhasLancamentoEditor'

function Wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

function ComLinhasHarness() {
  const { control } = useForm<LancamentoFormValues>({
    defaultValues: {
      data: '2026-07-29',
      descricao: 'Teste',
      periodoId: 'p1',
      linhas: [
        { contaId: '1', contaCodigo: '1.1.01', contaDesignacao: 'Caixa', debito: 1000, credito: 0 },
        {
          contaId: '2',
          contaCodigo: '7.1.01',
          contaDesignacao: 'Vendas',
          debito: 0,
          credito: 1000,
        },
      ],
    },
  })
  return <LinhasLancamentoEditor control={control} />
}

function VaziaHarness() {
  const { control } = useForm<LancamentoFormValues>({
    defaultValues: { data: '', descricao: '', periodoId: '', linhas: [] },
  })
  return <LinhasLancamentoEditor control={control} />
}

function renderComWrapper(ui: ReactNode) {
  return render(<Wrapper>{ui}</Wrapper>)
}

describe('LinhasLancamentoEditor', () => {
  it('mostra a mensagem vazia quando não há linhas', () => {
    renderComWrapper(<VaziaHarness />)
    expect(screen.getByText(/Sem linhas/)).toBeInTheDocument()
  })

  it('mostra as linhas iniciais com as contas e valores certos', () => {
    renderComWrapper(<ComLinhasHarness />)
    expect(screen.getByText('1.1.01')).toBeInTheDocument()
    expect(screen.getByText('7.1.01')).toBeInTheDocument()
  })

  it('adiciona uma linha vazia ao clicar em "Adicionar linha"', () => {
    renderComWrapper(<ComLinhasHarness />)
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar linha' }))
    expect(screen.getAllByLabelText('Débito')).toHaveLength(3)
  })

  it('remove uma linha ao clicar em remover', () => {
    renderComWrapper(<ComLinhasHarness />)
    fireEvent.click(screen.getAllByLabelText('Remover linha')[0]!)
    expect(screen.getAllByLabelText('Débito')).toHaveLength(1)
  })
})
