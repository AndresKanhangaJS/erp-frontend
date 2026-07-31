import { useMutation, useQueryClient } from '@tanstack/react-query'

import { editarFuncionario } from '@/api/modules/rh'

import type { FuncionarioFormValues } from '../schemas/funcionarioSchema'

export function useEditarFuncionario(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: FuncionarioFormValues) => editarFuncionario(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rh', 'funcionarios'], exact: false })
    },
  })
}
