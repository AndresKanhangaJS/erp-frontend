import { useMutation, useQueryClient } from '@tanstack/react-query'

import { emitirFatura } from '@/api/modules/faturacao'

import type { EmitirFaturaFormValues } from '../schemas/emitirFaturaSchema'

/**
 * "Optimistic" aqui é popular a cache do documento com a resposta da
 * mutation assim que chega, para a navegação para o detalhe não
 * esperar por um novo pedido — não inserir uma linha optimista na
 * lista com um número de documento inventado: o SERIE/NNNNNN é
 * atribuído pelo servidor, mostrar um valor fantasma num documento
 * fiscal seria enganoso.
 */
export function useEmitirFatura() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: EmitirFaturaFormValues) => emitirFatura(values),
    onSuccess: (documento) => {
      queryClient.setQueryData(['faturacao', 'faturas', documento.id], documento)
      queryClient.invalidateQueries({ queryKey: ['faturacao', 'faturas'], exact: false })
    },
  })
}
