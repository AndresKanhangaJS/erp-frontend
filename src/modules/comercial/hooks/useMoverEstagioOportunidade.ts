import { useMutation, useQueryClient } from '@tanstack/react-query'

import { moverEstagioOportunidade } from '@/api/modules/comercial'

export function useMoverEstagioOportunidade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, pipelineEstagioId }: { id: string; pipelineEstagioId: string }) =>
      moverEstagioOportunidade(id, pipelineEstagioId),
    onSuccess: (oportunidade) => {
      queryClient.setQueryData(['comercial', 'oportunidades', oportunidade.id], oportunidade)
      queryClient.invalidateQueries({ queryKey: ['comercial', 'oportunidades'], exact: false })
    },
  })
}
