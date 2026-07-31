import { useMutation, useQueryClient } from '@tanstack/react-query'

import { estornarMovimento } from '@/api/modules/stock'

export function useEstornarMovimento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => estornarMovimento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock', 'movimentos'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['stock', 'existencias'], exact: false })
    },
  })
}
