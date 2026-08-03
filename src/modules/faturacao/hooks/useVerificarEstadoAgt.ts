import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getFaturaAgtEstado } from '@/api/modules/faturacao'

/** Actualiza directamente a cache de useFatura(faturaId) — mesmo query key, sem precisar de um segundo estado para a mesma factura. */
export function useVerificarEstadoAgt(faturaId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => getFaturaAgtEstado(faturaId),
    onSuccess: (fatura) => {
      queryClient.setQueryData(['faturacao', 'faturas', faturaId], fatura)
    },
  })
}
