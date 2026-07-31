import { useQuery } from '@tanstack/react-query'

import { getApuramentoIva } from '@/api/modules/contabilidade'

export function useApuramentoIva(id: string | undefined) {
  return useQuery({
    queryKey: ['contabilidade', 'apuramento-iva', id],
    queryFn: () => getApuramentoIva(id!),
    enabled: Boolean(id),
  })
}
