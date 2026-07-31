import { useQuery } from '@tanstack/react-query'

import { getInventario } from '@/api/modules/stock'

export function useInventario(id: string | undefined) {
  return useQuery({
    queryKey: ['stock', 'inventarios', id],
    queryFn: () => getInventario(id!),
    enabled: Boolean(id),
  })
}
