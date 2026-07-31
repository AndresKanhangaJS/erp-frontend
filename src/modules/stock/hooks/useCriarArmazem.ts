import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarArmazem } from '@/api/modules/stock'

import type { ArmazemFormValues } from '../schemas/armazemSchema'

export function useCriarArmazem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ArmazemFormValues) => criarArmazem(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock', 'armazens'] })
    },
  })
}
