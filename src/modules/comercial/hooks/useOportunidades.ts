import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listOportunidades, type ListOportunidadesParams } from '@/api/modules/comercial'

export function useOportunidades(params: ListOportunidadesParams) {
  return useQuery({
    queryKey: ['comercial', 'oportunidades', params],
    queryFn: () => listOportunidades(params),
    placeholderData: keepPreviousData,
  })
}
