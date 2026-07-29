import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarPeriodoFiscal } from '@/api/modules/faturacao'

import type { PeriodoFiscalFormValues } from '../schemas/periodoFiscalSchema'

export function useCriarPeriodoFiscal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: PeriodoFiscalFormValues) => criarPeriodoFiscal(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'periodos-fiscais'] })
    },
  })
}
