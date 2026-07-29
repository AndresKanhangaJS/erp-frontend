import { useQuery } from '@tanstack/react-query'

import { listContas } from '@/api/modules/contabilidade'
import { useDebounce } from '@/shared/hooks/useDebounce'

export function useContas(search: string) {
  const debouncedSearch = useDebounce(search, 300)

  return useQuery({
    queryKey: ['contabilidade', 'contas', { search: debouncedSearch }],
    queryFn: () => listContas({ search: debouncedSearch, perPage: 20 }),
    staleTime: 60_000,
  })
}
