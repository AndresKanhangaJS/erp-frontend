import { useQuery } from '@tanstack/react-query'

import { getAgtConfiguracao } from '@/api/modules/faturacao'

export function useAgtConfiguracao() {
  return useQuery({
    queryKey: ['faturacao', 'agt', 'configuracao'],
    queryFn: getAgtConfiguracao,
  })
}
