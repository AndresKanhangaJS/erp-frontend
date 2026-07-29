import { useQuery } from '@tanstack/react-query'

import { getLancamento } from '@/api/modules/contabilidade'

export function useLancamento(id: string | undefined) {
  return useQuery({
    queryKey: ['contabilidade', 'lancamentos', id],
    queryFn: () => getLancamento(id!),
    enabled: Boolean(id),
  })
}
