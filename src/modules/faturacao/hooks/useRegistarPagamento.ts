import { useMutation, useQueryClient } from '@tanstack/react-query'

import { registarPagamento } from '@/api/modules/faturacao'

import type { PagamentoFormValues } from '../schemas/pagamentoSchema'

export function useRegistarPagamento(faturaId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: PagamentoFormValues) => registarPagamento(faturaId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'faturas', faturaId, 'pagamentos'] })
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'faturas', faturaId] })
    },
  })
}
