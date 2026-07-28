import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { listDocumentos, type ListDocumentosParams } from '@/api/modules/faturacao'

export function useFaturas(params: ListDocumentosParams) {
  return useQuery({
    queryKey: ['faturacao', 'faturas', params],
    queryFn: () => listDocumentos(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  })
}
