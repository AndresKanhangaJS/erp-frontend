import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getFaturaPdf } from '@/api/modules/faturacao'

/**
 * A geração do PDF é assíncrona (Job) — o primeiro pedido normalmente
 * despacha o job e devolve 202 (sem URL ainda). Mostra um toast a
 * pedir para tentar de novo dentro de momentos, em vez de bloquear a
 * UI à espera — o utilizador clica "Ver PDF" outra vez quando quiser.
 */
export function useFaturaPdf() {
  return useMutation({
    mutationFn: (id: string) => getFaturaPdf(id),
    onSuccess: (resultado) => {
      if (resultado.pronto) {
        window.open(resultado.url, '_blank', 'noopener,noreferrer')
      } else {
        toast.info('O PDF está a ser gerado; tenta novamente dentro de momentos.')
      }
    },
  })
}
