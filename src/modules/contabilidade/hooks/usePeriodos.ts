import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fecharPeriodo, listPeriodos } from '@/api/modules/contabilidade'

export function usePeriodos() {
  return useQuery({
    queryKey: ['contabilidade', 'periodos'],
    queryFn: () => listPeriodos(),
    staleTime: 60_000,
  })
}

export function useFecharPeriodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => fecharPeriodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contabilidade', 'periodos'] })
    },
  })
}
