import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarUtilizador } from '@/api/modules/admin'

import type { UtilizadorFormValues } from '../schemas/utilizadorSchema'

export function useCriarUtilizador() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: UtilizadorFormValues) => criarUtilizador(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'utilizadores'], exact: false })
    },
  })
}
