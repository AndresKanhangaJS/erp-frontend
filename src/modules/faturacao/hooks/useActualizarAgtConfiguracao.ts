import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateAgtConfiguracao } from '@/api/modules/faturacao'

import type { AgtConfiguracaoFormValues } from '../schemas/agtConfiguracaoSchema'

export function useActualizarAgtConfiguracao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: AgtConfiguracaoFormValues) => updateAgtConfiguracao(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'agt', 'configuracao'] })
    },
  })
}
