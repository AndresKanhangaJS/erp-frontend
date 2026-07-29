import { useQuery } from '@tanstack/react-query'

import { getBalanco } from '@/api/modules/contabilidade'

export function useBalanco(periodoId: string) {
  return useQuery({
    queryKey: ['contabilidade', 'balanco', periodoId],
    queryFn: () => getBalanco(periodoId),
    enabled: Boolean(periodoId),
  })
}
