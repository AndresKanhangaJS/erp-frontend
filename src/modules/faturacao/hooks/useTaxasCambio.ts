import { useQuery } from '@tanstack/react-query'

import { listTaxasCambio } from '@/api/modules/faturacao'

export function useTaxasCambio() {
  return useQuery({
    queryKey: ['faturacao', 'taxas-cambio'],
    queryFn: () => listTaxasCambio(),
  })
}
