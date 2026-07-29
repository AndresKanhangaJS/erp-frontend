import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarTaxaCambio } from '@/api/modules/faturacao'

import type { TaxaCambioFormValues } from '../schemas/taxaCambioSchema'

export function useCriarTaxaCambio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: TaxaCambioFormValues) => criarTaxaCambio(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'taxas-cambio'] })
    },
  })
}
