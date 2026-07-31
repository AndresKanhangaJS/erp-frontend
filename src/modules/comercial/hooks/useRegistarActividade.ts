import { useMutation, useQueryClient } from '@tanstack/react-query'

import { registarActividade } from '@/api/modules/comercial'

import type { ActividadeFormValues } from '../schemas/actividadeSchema'

export function useRegistarActividade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ActividadeFormValues) => registarActividade(values),
    onSuccess: (actividade) => {
      queryClient.invalidateQueries({
        queryKey: [
          'comercial',
          'actividades',
          actividade.relacionadoTipo,
          actividade.relacionadoId,
        ],
      })
    },
  })
}
