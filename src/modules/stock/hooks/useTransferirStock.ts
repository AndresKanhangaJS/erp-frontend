import { useMutation, useQueryClient } from '@tanstack/react-query'

import { transferirStock } from '@/api/modules/stock'

import type { TransferenciaFormValues } from '../schemas/transferenciaSchema'

export function useTransferirStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: TransferenciaFormValues) => transferirStock(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock', 'movimentos'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['stock', 'existencias'], exact: false })
    },
  })
}
