import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarOportunidade } from '@/api/modules/comercial'

import type { OportunidadeFormValues } from '../schemas/oportunidadeSchema'

export function useCriarOportunidade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: OportunidadeFormValues) => criarOportunidade(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comercial', 'oportunidades'], exact: false })
    },
  })
}
