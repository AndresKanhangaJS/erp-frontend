import { useQuery } from '@tanstack/react-query'

import { listActividades } from '@/api/modules/comercial'

import type { RelacionadoTipo } from '../types'

export function useActividades(
  relacionadoTipo: RelacionadoTipo,
  relacionadoId: string | undefined,
) {
  return useQuery({
    queryKey: ['comercial', 'actividades', relacionadoTipo, relacionadoId],
    queryFn: () => listActividades(relacionadoTipo, relacionadoId!),
    enabled: Boolean(relacionadoId),
  })
}
