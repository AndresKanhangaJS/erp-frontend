import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listFaturas, type ListFaturasParams } from '@/api/modules/faturacao'

export function useFaturas(params: ListFaturasParams) {
  return useQuery({
    queryKey: ['faturacao', 'faturas', params],
    queryFn: () => listFaturas(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  })
}
