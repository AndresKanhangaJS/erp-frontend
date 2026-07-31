import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listMovimentos, type ListMovimentosParams } from '@/api/modules/stock'

export function useMovimentos(params: ListMovimentosParams) {
  return useQuery({
    queryKey: ['stock', 'movimentos', params],
    queryFn: () => listMovimentos(params),
    placeholderData: keepPreviousData,
  })
}
