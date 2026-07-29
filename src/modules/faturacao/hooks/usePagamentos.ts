import { useQuery } from '@tanstack/react-query'

import { listPagamentos } from '@/api/modules/faturacao'

export function usePagamentos(faturaId: string | undefined) {
  return useQuery({
    queryKey: ['faturacao', 'faturas', faturaId, 'pagamentos'],
    queryFn: () => listPagamentos(faturaId!),
    enabled: Boolean(faturaId),
  })
}
