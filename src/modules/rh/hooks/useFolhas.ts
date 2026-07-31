import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listFolhas, type ListFolhasParams } from '@/api/modules/rh'

export function useFolhas(params: ListFolhasParams) {
  return useQuery({
    queryKey: ['rh', 'folhas', params],
    queryFn: () => listFolhas(params),
    placeholderData: keepPreviousData,
  })
}
