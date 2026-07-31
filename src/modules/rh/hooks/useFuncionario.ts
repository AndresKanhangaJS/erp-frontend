import { useQuery } from '@tanstack/react-query'

import { getFuncionario } from '@/api/modules/rh'

export function useFuncionario(id: string | undefined) {
  return useQuery({
    queryKey: ['rh', 'funcionarios', id],
    queryFn: () => getFuncionario(id!),
    enabled: Boolean(id),
  })
}
