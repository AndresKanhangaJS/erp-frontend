import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarArtigo } from '@/api/modules/faturacao'

import type { ArtigoFormValues } from '../schemas/artigoSchema'

export function useCriarArtigo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ArtigoFormValues) => criarArtigo(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'artigos'], exact: false })
    },
  })
}
