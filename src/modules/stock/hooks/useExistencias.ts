import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listExistencias, type ListExistenciasParams } from '@/api/modules/stock'

export function useExistencias(params: ListExistenciasParams) {
  return useQuery({
    queryKey: ['stock', 'existencias', params],
    queryFn: () => listExistencias(params),
    placeholderData: keepPreviousData,
  })
}
