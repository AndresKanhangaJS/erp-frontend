import { useQuery } from '@tanstack/react-query'

import { listPeriodosFiscais } from '@/api/modules/faturacao'

export function usePeriodosFiscais() {
  return useQuery({
    queryKey: ['faturacao', 'periodos-fiscais'],
    queryFn: () => listPeriodosFiscais(),
  })
}
