import { useQuery } from '@tanstack/react-query'

import { listSeries } from '@/api/modules/faturacao'

export function useSeries() {
  return useQuery({
    queryKey: ['faturacao', 'series'],
    queryFn: () => listSeries(),
    staleTime: 60_000,
  })
}
