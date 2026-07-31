import { useQuery } from '@tanstack/react-query'

import { listVencimentosDaFolha } from '@/api/modules/rh'

export function useVencimentosDaFolha(folhaId: string | undefined) {
  return useQuery({
    queryKey: ['rh', 'folhas', folhaId, 'vencimentos'],
    queryFn: () => listVencimentosDaFolha(folhaId!),
    enabled: Boolean(folhaId),
  })
}
