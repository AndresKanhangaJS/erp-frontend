import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fecharInventario } from '@/api/modules/stock'

export function useFecharInventario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => fecharInventario(id),
    onSuccess: (inventario) => {
      queryClient.setQueryData(['stock', 'inventarios', inventario.id], inventario)
      queryClient.invalidateQueries({ queryKey: ['stock', 'inventarios'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['stock', 'existencias'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['stock', 'movimentos'], exact: false })
    },
  })
}
