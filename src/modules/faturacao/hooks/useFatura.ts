import { useQuery } from '@tanstack/react-query'

import { getDocumento } from '@/api/modules/faturacao'

export function useFatura(id: string | undefined) {
  return useQuery({
    queryKey: ['faturacao', 'faturas', id],
    queryFn: () => getDocumento(id!),
    enabled: Boolean(id),
  })
}
