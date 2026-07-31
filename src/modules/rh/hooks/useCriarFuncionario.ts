import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarFuncionario } from '@/api/modules/rh'

import type { FuncionarioFormValues } from '../schemas/funcionarioSchema'

export function useCriarFuncionario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: FuncionarioFormValues) => criarFuncionario(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rh', 'funcionarios'], exact: false })
    },
  })
}
