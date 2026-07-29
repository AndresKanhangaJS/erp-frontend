import { useMutation, useQueryClient } from '@tanstack/react-query'

import { anularFatura } from '@/api/modules/faturacao'

import type { AnularFaturaFormValues } from '../schemas/anularFaturaSchema'

/** Devolve a Nota de Crédito gerada — não a factura original (que fica só marcada como anulada). */
export function useAnularFatura() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: AnularFaturaFormValues }) =>
      anularFatura(id, values),
    onSuccess: (notaCredito, { id: faturaOriginalId }) => {
      queryClient.setQueryData(['faturacao', 'faturas', notaCredito.id], notaCredito)
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'faturas', faturaOriginalId] })
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'faturas'], exact: false })
    },
  })
}
