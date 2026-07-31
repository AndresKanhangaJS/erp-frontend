import { useMutation, useQueryClient } from '@tanstack/react-query'

import { editarConta } from '@/api/modules/contabilidade'

import type { ContaFormValues } from '../schemas/contaSchema'

export function useEditarConta(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ContaFormValues) => editarConta(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contabilidade', 'contas'], exact: false })
    },
  })
}
