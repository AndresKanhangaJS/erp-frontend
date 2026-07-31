import { useQuery } from '@tanstack/react-query'

import { getLead } from '@/api/modules/comercial'

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: ['comercial', 'leads', id],
    queryFn: () => getLead(id!),
    enabled: Boolean(id),
  })
}
