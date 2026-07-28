import { useQuery } from '@tanstack/react-query'

import { listArtigos } from '@/api/modules/faturacao'
import { useDebounce } from '@/shared/hooks/useDebounce'

export function useArtigos(search: string) {
  const debouncedSearch = useDebounce(search, 300)

  return useQuery({
    queryKey: ['faturacao', 'artigos', { search: debouncedSearch }],
    queryFn: () => listArtigos({ search: debouncedSearch, perPage: 10 }),
    staleTime: 60_000,
  })
}
