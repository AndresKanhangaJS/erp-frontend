import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listLeads, type ListLeadsParams } from '@/api/modules/comercial'

export function useLeads(params: ListLeadsParams) {
  return useQuery({
    queryKey: ['comercial', 'leads', params],
    queryFn: () => listLeads(params),
    placeholderData: keepPreviousData,
  })
}
