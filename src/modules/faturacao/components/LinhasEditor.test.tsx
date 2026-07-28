import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

import type { EmitirFaturaFormValues } from '../schemas/emitirFaturaSchema'
import { LinhasEditor } from './LinhasEditor'

function Wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

function ComLinhaHarness() {
  const { control } = useForm<EmitirFaturaFormValues>({
    defaultValues: {
      tipo: 'FT',
      clienteId: '',
      moeda: 'AOA',
      linhas: [
        {
          artigoId: '1',
          designacao: 'Artigo A',
          quantidade: 2,
          precoUnitario: 1000,
          taxaIva: 14,
          motivoIsencao: null,
        },
      ],
    },
  })
  return <LinhasEditor control={control} />
}

function VaziaHarness() {
  const { control } = useForm<EmitirFaturaFormValues>({
    defaultValues: { tipo: 'FT', clienteId: '', moeda: 'AOA', linhas: [] },
  })
  return <LinhasEditor control={control} />
}

function renderComWrapper(ui: ReactNode) {
  return render(<Wrapper>{ui}</Wrapper>)
}

describe('LinhasEditor', () => {
  it('mostra a mensagem vazia quando não há linhas', () => {
    renderComWrapper(<VaziaHarness />)
    expect(screen.getByText(/Sem linhas/)).toBeInTheDocument()
  })

  it('mostra a linha inicial com o subtotal correcto', () => {
    renderComWrapper(<ComLinhaHarness />)
    expect(screen.getByText('Artigo A')).toBeInTheDocument()
    expect(screen.getByText(/2.*000,00/)).toBeInTheDocument()
  })

  it('recalcula o subtotal da linha ao mudar a quantidade (bug do fields desactualizado)', () => {
    renderComWrapper(<ComLinhaHarness />)
    fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '3' } })
    expect(screen.getByText(/3.*000,00/)).toBeInTheDocument()
  })

  it('remove uma linha ao clicar em remover', () => {
    renderComWrapper(<ComLinhaHarness />)
    fireEvent.click(screen.getByLabelText('Remover linha'))
    expect(screen.getByText(/Sem linhas/)).toBeInTheDocument()
  })
})
