import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { criarPeriodo, fecharPeriodo, listPeriodos } from '@/api/modules/contabilidade'

import type { PeriodoFormValues } from '../schemas/periodoSchema'

export function usePeriodos() {
  return useQuery({
    queryKey: ['contabilidade', 'periodos'],
    queryFn: () => listPeriodos(),
    staleTime: 60_000,
  })
}

export function useCriarPeriodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: PeriodoFormValues) => criarPeriodo(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contabilidade', 'periodos'] })
    },
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
