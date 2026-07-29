import { useMutation, useQueryClient } from '@tanstack/react-query'

import { emitirFatura } from '@/api/modules/faturacao'

import type { EmitirFaturaFormValues } from '../schemas/emitirFaturaSchema'

/**
 * "Optimistic" aqui é popular a cache da factura com a resposta da
 * mutation assim que chega, para a navegação para o detalhe não
 * esperar por um novo pedido — não inserir uma linha optimista na
 * lista com um número inventado: o número é atribuído pelo servidor
 * (lockForUpdate na série), mostrar um valor fantasma num documento
 * fiscal seria enganoso.
 */
export function useEmitirFatura() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: EmitirFaturaFormValues) => emitirFatura(values),
    onSuccess: (fatura) => {
      queryClient.setQueryData(['faturacao', 'faturas', fatura.id], fatura)
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'faturas'], exact: false })
    },
  })
}
