import { useMutation, useQueryClient } from '@tanstack/react-query'

import { desactivarFuncionario } from '@/api/modules/rh'

import type { DeactivateFuncionarioFormValues } from '../schemas/deactivateFuncionarioSchema'

export function useDesactivarFuncionario(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: DeactivateFuncionarioFormValues) => desactivarFuncionario(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rh', 'funcionarios'], exact: false })
    },
  })
}
