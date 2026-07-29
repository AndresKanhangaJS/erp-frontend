import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateConta } from '@/api/modules/contabilidade'

import type { ContaFormValues } from '../schemas/contaSchema'

export function useEditarConta(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ContaFormValues) => updateConta(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contabilidade', 'contas'], exact: false })
    },
  })
}
