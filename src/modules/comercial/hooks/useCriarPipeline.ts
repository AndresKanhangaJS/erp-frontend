import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarPipeline } from '@/api/modules/comercial'

import type { PipelineFormValues } from '../schemas/pipelineSchema'

export function useCriarPipeline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: PipelineFormValues) => criarPipeline(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comercial', 'pipelines'] })
    },
  })
}
