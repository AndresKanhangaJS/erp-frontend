import { useQuery } from '@tanstack/react-query'

import { getMovimento } from '@/api/modules/stock'

export function useMovimento(id: string | undefined) {
  return useQuery({
    queryKey: ['stock', 'movimentos', id],
    queryFn: () => getMovimento(id!),
    enabled: Boolean(id),
  })
}
