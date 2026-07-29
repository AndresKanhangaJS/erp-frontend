import { useMutation } from '@tanstack/react-query'

import { exportarSaft } from '@/api/modules/faturacao'

import type { SaftFormValues } from '../schemas/saftSchema'

export function useExportarSaft() {
  return useMutation({
    mutationFn: (values: SaftFormValues) => exportarSaft(values),
  })
}
