import { useQuery } from '@tanstack/react-query'

import { getBalancete } from '@/api/modules/contabilidade'

export function useBalancete(periodoId: string | undefined) {
  return useQuery({
    queryKey: ['contabilidade', 'balancete', periodoId],
    queryFn: () => getBalancete(periodoId!),
    enabled: Boolean(periodoId),
  })
}
