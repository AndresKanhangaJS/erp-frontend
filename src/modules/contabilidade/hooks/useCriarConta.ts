import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createConta } from '@/api/modules/contabilidade'

import type { ContaFormValues } from '../schemas/contaSchema'

export function useCriarConta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ContaFormValues) => createConta(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contabilidade', 'contas'], exact: false })
    },
  })
}
