import { useMutation, useQueryClient } from '@tanstack/react-query'

import { anularFolha } from '@/api/modules/rh'

export function useAnularFolha() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => anularFolha(id),
    onSuccess: (folha) => {
      queryClient.setQueryData(['rh', 'folhas', folha.id], folha)
      queryClient.invalidateQueries({ queryKey: ['rh', 'folhas'], exact: false })
    },
  })
}
