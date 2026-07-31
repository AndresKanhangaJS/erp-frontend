import { useMutation, useQueryClient } from '@tanstack/react-query'

import { registarMovimento } from '@/api/modules/stock'

import type { MovimentoFormValues } from '../schemas/movimentoSchema'

export function useRegistarMovimento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: MovimentoFormValues) => registarMovimento(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock', 'movimentos'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['stock', 'existencias'], exact: false })
    },
  })
}
