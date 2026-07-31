import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getReciboVencimento } from '@/api/modules/rh'

/** A geração do recibo é assíncrona (Job) — 202 na primeira tentativa é normal, o utilizador tenta de novo. */
export function useReciboVencimento() {
  return useMutation({
    mutationFn: (id: string) => getReciboVencimento(id),
    onSuccess: (resultado) => {
      if (resultado.pronto) {
        window.open(resultado.url, '_blank', 'noopener,noreferrer')
      } else {
        toast.info('O recibo está a ser gerado; tenta novamente dentro de momentos.')
      }
    },
  })
}
