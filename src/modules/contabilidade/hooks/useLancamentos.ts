import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listLancamentos, type ListLancamentosParams } from '@/api/modules/contabilidade'

export function useLancamentos(params: ListLancamentosParams) {
  return useQuery({
    queryKey: ['contabilidade', 'lancamentos', params],
    queryFn: () => listLancamentos(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  })
}
