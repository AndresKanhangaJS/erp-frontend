import { useMutation } from '@tanstack/react-query'

import { reenviarFaturaAgt } from '@/api/modules/faturacao'

export function useReenviarFaturaAgt(faturaId: string) {
  return useMutation({
    mutationFn: () => reenviarFaturaAgt(faturaId),
  })
}
