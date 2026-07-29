import { useMutation, useQueryClient } from '@tanstack/react-query'

import { criarLancamento } from '@/api/modules/contabilidade'

import type { LancamentoFormValues } from '../schemas/lancamentoSchema'

/**
 * Mesma lógica do useEmitirFatura (Passo 9): popular a cache do
 * lançamento com a resposta real assim que chega, não inserir uma
 * linha optimista com um número inventado — o número é atribuído
 * pelo servidor.
 */
export function useCriarLancamento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: LancamentoFormValues) => criarLancamento(values),
    onSuccess: (lancamento) => {
      queryClient.setQueryData(['contabilidade', 'lancamentos', lancamento.id], lancamento)
      queryClient.invalidateQueries({ queryKey: ['contabilidade', 'lancamentos'], exact: false })
    },
  })
}
