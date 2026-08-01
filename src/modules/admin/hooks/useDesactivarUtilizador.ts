import { useMutation, useQueryClient } from '@tanstack/react-query'

import { desactivarUtilizador } from '@/api/modules/admin'

import type { DesactivarUtilizadorFormValues } from '../schemas/desactivarUtilizadorSchema'

export function useDesactivarUtilizador(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: DesactivarUtilizadorFormValues) => desactivarUtilizador(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'utilizadores'], exact: false })
    },
  })
}
