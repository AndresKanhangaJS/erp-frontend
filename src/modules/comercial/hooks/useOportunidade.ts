import { useQuery } from '@tanstack/react-query'

import { getOportunidade } from '@/api/modules/comercial'

export function useOportunidade(id: string | undefined) {
  return useQuery({
    queryKey: ['comercial', 'oportunidades', id],
    queryFn: () => getOportunidade(id!),
    enabled: Boolean(id),
  })
}
