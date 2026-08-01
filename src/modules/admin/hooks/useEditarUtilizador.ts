import { useMutation, useQueryClient } from '@tanstack/react-query'

import { editarUtilizador } from '@/api/modules/admin'

import type { UtilizadorFormValues } from '../schemas/utilizadorSchema'

export function useEditarUtilizador(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: UtilizadorFormValues) => editarUtilizador(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'utilizadores'], exact: false })
    },
  })
}
