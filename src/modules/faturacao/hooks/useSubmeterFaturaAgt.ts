import { useMutation } from '@tanstack/react-query'

import { submeterFaturaAgt } from '@/api/modules/faturacao'

/** Submissão normal é automática ao emitir — isto é só para reenviar manualmente após uma falha. */
export function useSubmeterFaturaAgt(faturaId: string) {
  return useMutation({
    mutationFn: () => submeterFaturaAgt(faturaId),
  })
}
