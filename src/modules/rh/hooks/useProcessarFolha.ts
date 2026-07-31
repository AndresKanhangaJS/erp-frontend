import { useMutation, useQueryClient } from '@tanstack/react-query'

import { processarFolha } from '@/api/modules/rh'

import type { ProcessarFolhaFormValues } from '../schemas/processarFolhaSchema'

export function useProcessarFolha() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ProcessarFolhaFormValues) => processarFolha(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rh', 'folhas'], exact: false })
    },
  })
}
