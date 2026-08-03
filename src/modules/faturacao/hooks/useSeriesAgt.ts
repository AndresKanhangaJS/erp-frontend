import { useQuery } from '@tanstack/react-query'

import { listarSeriesAgt, type ListarSeriesAgtParams } from '@/api/modules/faturacao'

/** Consulta directa à AGT — só corre quando o utilizador pede (ver AgtSeriesPage), nunca automaticamente. */
export function useSeriesAgt(params: ListarSeriesAgtParams, enabled: boolean) {
  return useQuery({
    queryKey: ['faturacao', 'agt', 'series', params],
    queryFn: () => listarSeriesAgt(params),
    enabled,
  })
}
