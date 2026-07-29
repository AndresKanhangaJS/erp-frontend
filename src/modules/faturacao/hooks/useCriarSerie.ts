import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarSerie } from '@/api/modules/faturacao'

import type { SerieFormValues } from '../schemas/serieSchema'

export function useCriarSerie() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: SerieFormValues) => criarSerie(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'series'], exact: false })
    },
  })
}
