import { useQuery } from '@tanstack/react-query'

import { getFatura } from '@/api/modules/faturacao'

export function useFatura(id: string | undefined) {
  return useQuery({
    queryKey: ['faturacao', 'faturas', id],
    queryFn: () => getFatura(id!),
    enabled: Boolean(id),
  })
}
