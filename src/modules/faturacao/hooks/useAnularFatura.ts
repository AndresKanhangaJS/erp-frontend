import { useMutation, useQueryClient } from '@tanstack/react-query'

import { anularFatura } from '@/api/modules/faturacao'

export function useAnularFatura() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => anularFatura(id),
    onSuccess: (documento) => {
      queryClient.setQueryData(['faturacao', 'faturas', documento.id], documento)
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'faturas'], exact: false })
    },
  })
}
