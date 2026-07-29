import { useQuery } from '@tanstack/react-query'

import { listContas } from '@/api/modules/contabilidade'

const PER_PAGE_ARVORE = 500

/** Plano de contas completo, sem paginação — para a vista em árvore e para o formulário de edição. */
export function useContasArvore() {
  return useQuery({
    queryKey: ['contabilidade', 'contas', 'arvore'],
    queryFn: () => listContas({ perPage: PER_PAGE_ARVORE }),
    select: (response) => response.data,
    staleTime: 60_000,
  })
}
