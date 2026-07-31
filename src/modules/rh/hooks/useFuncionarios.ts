import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listFuncionarios, type ListFuncionariosParams } from '@/api/modules/rh'

export function useFuncionarios(params: ListFuncionariosParams) {
  return useQuery({
    queryKey: ['rh', 'funcionarios', params],
    queryFn: () => listFuncionarios(params),
    placeholderData: keepPreviousData,
  })
}
