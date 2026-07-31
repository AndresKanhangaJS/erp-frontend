import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listInventarios, type ListInventariosParams } from '@/api/modules/stock'

export function useInventarios(params: ListInventariosParams) {
  return useQuery({
    queryKey: ['stock', 'inventarios', params],
    queryFn: () => listInventarios(params),
    placeholderData: keepPreviousData,
  })
}
