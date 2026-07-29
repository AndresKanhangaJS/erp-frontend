import { useQuery } from '@tanstack/react-query'

import { getDemonstracaoResultados } from '@/api/modules/contabilidade'

export function useDemonstracaoResultados(periodoId: string) {
  return useQuery({
    queryKey: ['contabilidade', 'demonstracao-resultados', periodoId],
    queryFn: () => getDemonstracaoResultados(periodoId),
    enabled: Boolean(periodoId),
  })
}
