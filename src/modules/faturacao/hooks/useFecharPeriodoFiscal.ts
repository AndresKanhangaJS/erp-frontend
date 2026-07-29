import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fecharPeriodoFiscal } from '@/api/modules/faturacao'

export function useFecharPeriodoFiscal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => fecharPeriodoFiscal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'periodos-fiscais'] })
    },
  })
}
