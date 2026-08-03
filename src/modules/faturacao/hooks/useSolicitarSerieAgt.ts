import { useMutation, useQueryClient } from '@tanstack/react-query'

import { solicitarSerieAgt } from '@/api/modules/faturacao'

export function useSolicitarSerieAgt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serieId: string) => solicitarSerieAgt(serieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'series'] })
    },
  })
}
