import { useMutation, useQueryClient } from '@tanstack/react-query'

import { anularLancamento } from '@/api/modules/contabilidade'

export function useAnularLancamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => anularLancamento(id),
    onSuccess: (lancamento) => {
      queryClient.setQueryData(['contabilidade', 'lancamentos', lancamento.id], lancamento)
      queryClient.invalidateQueries({ queryKey: ['contabilidade', 'lancamentos'], exact: false })
    },
  })
}
