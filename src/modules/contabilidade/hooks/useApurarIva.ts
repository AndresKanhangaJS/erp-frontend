import { useMutation } from '@tanstack/react-query'

import { apurarIva } from '@/api/modules/contabilidade'

import type { ApurarIvaFormValues } from '../schemas/apuramentoIvaSchema'

export function useApurarIva() {
  return useMutation({
    mutationFn: (values: ApurarIvaFormValues) => apurarIva(values),
  })
}
