import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarConta } from '@/api/modules/contabilidade'

import type { ContaFormValues } from '../schemas/contaSchema'

export function useCriarConta() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ContaFormValues) => criarConta(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contabilidade', 'contas'], exact: false })
    },
  })
}
