import { useMutation, useQueryClient } from '@tanstack/react-query'

import { anularLancamento } from '@/api/modules/contabilidade'

export function useAnularLancamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => anularLancamento(id),
    onSuccess: ({ original, estorno }) => {
      queryClient.setQueryData(['contabilidade', 'lancamentos', original.id], original)
      queryClient.setQueryData(['contabilidade', 'lancamentos', estorno.id], estorno)
      queryClient.invalidateQueries({ queryKey: ['contabilidade', 'lancamentos'], exact: false })
    },
  })
}
