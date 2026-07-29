import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarCliente } from '@/api/modules/faturacao'

import type { ClienteFormValues } from '../schemas/clienteSchema'

export function useCriarCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ClienteFormValues) => criarCliente(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'clientes'], exact: false })
    },
  })
}
