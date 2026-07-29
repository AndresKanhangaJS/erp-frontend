import { useMutation, useQueryClient } from '@tanstack/react-query'

import { editarCliente } from '@/api/modules/faturacao'

import type { ClienteFormValues } from '../schemas/clienteSchema'

export function useEditarCliente(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ClienteFormValues) => editarCliente(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'clientes'], exact: false })
    },
  })
}
