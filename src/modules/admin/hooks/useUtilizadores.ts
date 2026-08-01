import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listUtilizadores, type ListUtilizadoresParams } from '@/api/modules/admin'

export function useUtilizadores(params: ListUtilizadoresParams) {
  return useQuery({
    queryKey: ['admin', 'utilizadores', params],
    queryFn: () => listUtilizadores(params),
    placeholderData: keepPreviousData,
  })
}
