import { useQuery } from '@tanstack/react-query'

import { listClientes } from '@/api/modules/faturacao'
import { useDebounce } from '@/shared/hooks/useDebounce'

export function useClientes(search: string) {
  const debouncedSearch = useDebounce(search, 300)

  return useQuery({
    queryKey: ['faturacao', 'clientes', { search: debouncedSearch }],
    queryFn: () => listClientes({ search: debouncedSearch, perPage: 10 }),
    staleTime: 60_000,
  })
}
