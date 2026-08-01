import { useQuery } from '@tanstack/react-query'

import { getUtilizador } from '@/api/modules/admin'

export function useUtilizador(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'utilizadores', id],
    queryFn: () => getUtilizador(id!),
    enabled: Boolean(id),
  })
}
