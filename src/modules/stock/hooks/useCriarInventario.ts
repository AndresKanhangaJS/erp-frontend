import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarInventario } from '@/api/modules/stock'

import type { InventarioFormValues } from '../schemas/inventarioSchema'

export function useCriarInventario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: InventarioFormValues) => criarInventario(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock', 'inventarios'], exact: false })
    },
  })
}
