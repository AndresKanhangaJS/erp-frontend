import { useQuery } from '@tanstack/react-query'

import { getFolha } from '@/api/modules/rh'

export function useFolha(id: string | undefined) {
  return useQuery({
    queryKey: ['rh', 'folhas', id],
    queryFn: () => getFolha(id!),
    enabled: Boolean(id),
  })
}
