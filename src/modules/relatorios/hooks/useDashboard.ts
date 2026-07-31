import { useQuery } from '@tanstack/react-query'

import { getDashboard, type DashboardParams } from '@/api/modules/relatorios'

export function useDashboard(params: DashboardParams) {
  return useQuery({
    queryKey: ['relatorios', 'dashboard', params],
    queryFn: () => getDashboard(params),
  })
}
