import { useQuery } from '@tanstack/react-query'

import { listPipelines } from '@/api/modules/comercial'

export function usePipelines() {
  return useQuery({
    queryKey: ['comercial', 'pipelines'],
    queryFn: () => listPipelines(),
    staleTime: 60_000,
  })
}
