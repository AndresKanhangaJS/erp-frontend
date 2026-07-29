import { useQuery } from '@tanstack/react-query'

import { getCliente } from '@/api/modules/faturacao'

export function useCliente(id: string | undefined) {
  return useQuery({
    queryKey: ['faturacao', 'clientes', id],
    queryFn: () => getCliente(id!),
    enabled: Boolean(id),
  })
}
