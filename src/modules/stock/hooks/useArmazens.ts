import { useQuery } from '@tanstack/react-query'

import { listArmazens } from '@/api/modules/stock'

export function useArmazens() {
  return useQuery({
    queryKey: ['stock', 'armazens'],
    queryFn: () => listArmazens(),
    staleTime: 60_000,
  })
}
