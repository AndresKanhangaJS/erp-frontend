import { useQuery } from '@tanstack/react-query'

import { getVencimento } from '@/api/modules/rh'

export function useVencimento(id: string | undefined) {
  return useQuery({
    queryKey: ['rh', 'vencimentos', id],
    queryFn: () => getVencimento(id!),
    enabled: Boolean(id),
  })
}
